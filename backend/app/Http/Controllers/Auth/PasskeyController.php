<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\WebauthnCredential;
use App\Notifications\PasskeyCreated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class PasskeyController extends Controller
{
    /**
     * List the authenticated user's passkeys.
     */
    public function index(Request $request): JsonResponse
    {
        $credentials = $request->user()
            ->webauthnCredentials()
            ->select('id', 'name', 'authenticator_type', 'backup_eligible', 'last_used_at', 'created_at')
            ->get();

        return response()->json(['passkeys' => $credentials]);
    }

    /**
     * Generate WebAuthn registration options.
     */
    public function registerOptions(Request $request): JsonResponse
    {
        $user = $request->user();

        $challenge = random_bytes(32);

        $existingIds = $user->webauthnCredentials()
            ->pluck('credential_id')
            ->toArray();

        $options = [
            'challenge' => $this->base64urlEncode($challenge),
            'rp' => [
                'name' => config('app.name', 'Kuba'),
                'id' => $this->getRpId(),
            ],
            'user' => [
                'id' => base64_encode($user->id),
                'name' => $user->email,
                'displayName' => $user->name,
            ],
            'pubKeyCredParams' => [
                ['type' => 'public-key', 'alg' => -7],   // ES256
                ['type' => 'public-key', 'alg' => -257],  // RS256
            ],
            'authenticatorSelection' => [
                'residentKey' => 'preferred',
                'userVerification' => 'preferred',
            ],
            'timeout' => 60000,
            'attestation' => 'none',
            'excludeCredentials' => array_map(function ($id) {
                return [
                    'id' => $id,
                    'type' => 'public-key',
                ];
            }, $existingIds),
        ];

        // Store challenge in session for verification (use base64url to match browser encoding)
        $request->session()->put('webauthn_registration_challenge', $this->base64urlEncode($challenge));

        return response()->json($options);
    }

    /**
     * Verify and store a new passkey credential.
     */
    public function registerVerify(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'required|array',
            'credential.id' => 'required|string',
            'credential.rawId' => 'required|string',
            'credential.response' => 'required|array',
            'credential.response.attestationObject' => 'required|string',
            'credential.response.clientDataJSON' => 'required|string',
            'credential.type' => 'required|string|in:public-key',
            'name' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $credential = $request->input('credential');

        $storedChallenge = $request->session()->pull('webauthn_registration_challenge');
        if (!$storedChallenge) {
            return response()->json(['message' => 'Registration challenge expired. Please try again.'], 422);
        }

        // Verify the client data
        $clientDataJSON = $this->base64urlDecode($credential['response']['clientDataJSON']);
        $clientData = json_decode($clientDataJSON, true);

        if (!$clientData || ($clientData['type'] ?? '') !== 'webauthn.create') {
            return response()->json(['message' => 'Invalid client data type.'], 422);
        }

        if (!$this->isOriginValid($clientData['origin'] ?? '')) {
            return response()->json(['message' => 'Invalid origin.'], 422);
        }

        // Verify the challenge
        $challengeFromClient = $clientData['challenge'] ?? '';
        if (!hash_equals($storedChallenge, $challengeFromClient)) {
            return response()->json(['message' => 'Challenge mismatch.'], 422);
        }

        // Decode attestation object
        $attestationObject = $this->base64urlDecode($credential['response']['attestationObject']);
        $attData = $this->parseCBOR($attestationObject);

        if (!$attData) {
            return response()->json(['message' => 'Invalid attestation object.'], 422);
        }

        // Extract credential data from attestation
        $authData = $attData['authData'] ?? null;
        if (!$authData || strlen($authData) < 55) {
            return response()->json(['message' => 'Invalid authenticator data.'], 422);
        }

        // Parse RP ID hash (32 bytes), sign count (4 bytes), flags (1 byte)
        $rpIdHash = substr($authData, 0, 32);
        $flags = ord($authData[32]);
        $counter = unpack('N', substr($authData, 33, 4))[1];

        // Verify RP ID hash
        $expectedRpIdHash = hash('sha256', $this->getRpId(), true);
        if (!hash_equals($expectedRpIdHash, $rpIdHash)) {
            return response()->json(['message' => 'Relying Party ID mismatch.'], 422);
        }

        // Check AT flag (Attested Credential Data present)
        if (!($flags & 0x40)) {
            return response()->json(['message' => 'No attested credential data.'], 422);
        }

        // Parse credential data from auth data
        $credData = substr($authData, 37);
        if (strlen($credData) < 18) {
            return response()->json(['message' => 'Invalid credential data length.'], 422);
        }

        $aaguid = substr($credData, 0, 16);
        $credIdLength = unpack('n', substr($credData, 16, 2))[1];
        $credId = substr($credData, 18, $credIdLength);
        $publicKeyBytes = substr($credData, 18 + $credIdLength);

        // Verify credential ID matches
        $expectedCredId = $this->base64urlDecode($credential['rawId']);
        if ($credId !== $expectedCredId) {
            // Fallback: try standard base64
            $expectedCredId = base64_decode($credential['id'], true);
            if ($credId !== $expectedCredId && $credId !== ($credential['rawId'] ?? '')) {
                return response()->json(['message' => 'Credential ID mismatch.'], 422);
            }
        }

        // Store the credential
        $webauthnCred = WebauthnCredential::create([
            'user_id' => $user->id,
            'credential_id' => base64_encode($credId),
            'public_key' => Crypt::encryptString(base64_encode($publicKeyBytes)),
            'counter' => $counter,
            'name' => $request->input('name') ?: $this->guessCredentialName($clientData),
            'authenticator_type' => $this->detectAuthenticatorType($flags),
            'transports' => $credential['response']['transports'] ?? ['internal'],
            'backup_eligible' => (bool) ($flags & 0x08),
            'backup_state' => (bool) ($flags & 0x10),
            'last_used_at' => now(),
        ]);

        // Send notification
        $user->notify(new PasskeyCreated($webauthnCred));

        return response()->json([
            'message' => 'Passkey registered successfully.',
            'passkey' => [
                'id' => $webauthnCred->id,
                'name' => $webauthnCred->name,
                'created_at' => $webauthnCred->created_at,
            ],
        ]);
    }

    /**
     * Generate WebAuthn authentication options (for passkey sign-in).
     */
    public function authenticateOptions(Request $request): JsonResponse
    {
        $challenge = random_bytes(32);

        // Get all credential IDs for the user (if authenticated) or allow discoverable credentials
        $credentialIds = [];
        if ($request->user()) {
            $credentialIds = $request->user()
                ->webauthnCredentials()
                ->pluck('credential_id')
                ->toArray();
        }

        $options = [
            'challenge' => $this->base64urlEncode($challenge),
            'timeout' => 60000,
            'rpId' => $this->getRpId(),
            'userVerification' => 'preferred',
        ];

        if (!empty($credentialIds)) {
            $options['allowCredentials'] = array_map(function ($id) {
                return [
                    'id' => $id,
                    'type' => 'public-key',
                    'transports' => ['internal'],
                ];
            }, $credentialIds);
        }

        $request->session()->put('webauthn_authentication_challenge', $this->base64urlEncode($challenge));

        return response()->json($options);
    }

    /**
     * Verify passkey authentication (for passkey sign-in).
     */
    public function authenticateVerify(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'required|array',
            'credential.id' => 'required|string',
            'credential.rawId' => 'required|string',
            'credential.response' => 'required|array',
            'credential.response.authenticatorData' => 'required|string',
            'credential.response.clientDataJSON' => 'required|string',
            'credential.response.signature' => 'required|string',
            'credential.type' => 'required|string|in:public-key',
        ]);

        $credential = $request->input('credential');

        $storedChallenge = $request->session()->pull('webauthn_authentication_challenge');
        if (!$storedChallenge) {
            return response()->json(['message' => 'Authentication challenge expired.'], 422);
        }

        // Verify client data
        $clientDataJSON = $this->base64urlDecode($credential['response']['clientDataJSON']);
        $clientData = json_decode($clientDataJSON, true);

        if (!$clientData || ($clientData['type'] ?? '') !== 'webauthn.get') {
            return response()->json(['message' => 'Invalid client data type.'], 422);
        }

        if (!$this->isOriginValid($clientData['origin'] ?? '')) {
            return response()->json(['message' => 'Invalid origin.'], 422);
        }

        $challengeFromClient = $clientData['challenge'] ?? '';
        if (!hash_equals($storedChallenge, $challengeFromClient)) {
            return response()->json(['message' => 'Challenge mismatch.'], 422);
        }

        // Find the credential
        $credId = $this->base64urlDecode($credential['rawId']);
        $webauthnCred = WebauthnCredential::where('credential_id', base64_encode($credId))->first();

        if (!$webauthnCred) {
            // Fallback: try standard base64
            $credId = base64_decode($credential['id'], true);
            if ($credId !== false) {
                $webauthnCred = WebauthnCredential::where('credential_id', base64_encode($credId))->first();
            }
        }

        if (!$webauthnCred) {
            return response()->json(['message' => 'Credential not found.'], 422);
        }

        // Verify authenticator data
        $authData = $this->base64urlDecode($credential['response']['authenticatorData']);
        if (strlen($authData) < 37) {
            return response()->json(['message' => 'Invalid authenticator data.'], 422);
        }

        $expectedRpIdHash = hash('sha256', $this->getRpId(), true);
        $rpIdHash = substr($authData, 0, 32);
        if (!hash_equals($expectedRpIdHash, $rpIdHash)) {
            return response()->json(['message' => 'Relying Party ID mismatch.'], 422);
        }

        $flags = ord($authData[32]);
        $signCount = unpack('N', substr($authData, 33, 4))[1];

        // Verify counter (if both are non-zero, new must be greater)
        if ($webauthnCred->counter > 0 && $signCount > 0) {
            if ($signCount <= $webauthnCred->counter) {
                return response()->json(['message' => 'Credential counter violation.'], 422);
            }
        }

        // Verify signature using stored public key
        $publicKeyBytes = base64_decode(Crypt::decryptString($webauthnCred->public_key));
        $signature = $this->base64urlDecode($credential['response']['signature']);

        // Build the signed data: authData + SHA-256(clientDataJSON)
        $signedData = $authData . hash('sha256', $clientDataJSON, true);

        if (!$this->verifySignature($publicKeyBytes, $signedData, $signature)) {
            return response()->json(['message' => 'Invalid signature.'], 422);
        }

        // Update counter and last used
        $webauthnCred->update([
            'counter' => $signCount,
            'last_used_at' => now(),
        ]);

        // Return the user associated with this credential for login
        $user = $webauthnCred->user;

        return response()->json([
            'message' => 'Passkey verified.',
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * Delete a passkey credential.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $credential = $request->user()
            ->webauthnCredentials()
            ->where('id', $id)
            ->first();

        if (!$credential) {
            return response()->json(['message' => 'Passkey not found.'], 404);
        }

        $credential->delete();

        return response()->json(['message' => 'Passkey deleted.']);
    }

    // ---------------------------------------------------------------
    //  Helper methods
    // ---------------------------------------------------------------

    private function getRpId(): string
    {
        $host = parse_url(config('app.url', 'https://kuba.co.ke'), PHP_URL_HOST) ?? 'kuba.co.ke';

        // WebAuthn RP ID must be a registrable domain suffix of the page origin.
        // The frontend runs on kuba.co.ke / www.kuba.co.ke while the API is on api.kuba.co.ke.
        // Use the bare domain so passkeys work across both subdomains.
        $parts = explode('.', $host);
        if (count($parts) >= 3) {
            return strtolower(implode('.', array_slice($parts, -3)));
        }

        return $host;
    }

    private function getOrigin(): string
    {
        // Derive from APP_URL: replace api. subdomain with www. or bare domain
        $appUrl = config('app.url', 'https://kuba.co.ke');
        $host = parse_url($appUrl, PHP_URL_HOST) ?? 'kuba.co.ke';
        $parts = explode('.', $host);
        if (count($parts) >= 3 && $parts[0] === 'api') {
            $host = implode('.', array_slice($parts, 1));
        }

        return parse_url($appUrl, PHP_URL_SCHEME) . '://' . $host;
    }

    /**
     * Check if the client-reported origin matches any valid origin.
     * Allows both the frontend URL and the API URL as valid origins.
     */
    private function isOriginValid(string $origin): bool
    {
        $validOrigins = [
            $this->getOrigin(),
            config('app.url', 'https://api.kuba.co.ke'),
            'https://kuba.co.ke',
            'https://www.kuba.co.ke',
        ];

        return in_array(rtrim($origin, '/'), array_unique($validOrigins), true);
    }

    private function base64urlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($data, '-_', '+/'));
    }

    private function base64urlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Simple CBOR parser for attestation objects.
     * Handles the subset needed for WebAuthn.
     */
    private function parseCBOR(string $data): ?array
    {
        $offset = 0;
        $result = $this->parseCBORValue($data, $offset);

        return is_array($result) ? $result : null;
    }

    private function parseCBORValue(string $data, int &$offset): mixed
    {
        if ($offset >= strlen($data)) {
            return null;
        }

        $byte = ord($data[$offset++]);
        $majorType = $byte >> 5;
        $additionalInfo = $byte & 0x1F;

        if ($additionalInfo < 24) {
            $length = $additionalInfo;
        } elseif ($additionalInfo === 24) {
            $length = ord($data[$offset++]);
        } elseif ($additionalInfo === 25) {
            $length = unpack('n', substr($data, $offset, 2))[1];
            $offset += 2;
        } elseif ($additionalInfo === 26) {
            $length = unpack('N', substr($data, $offset, 4))[1];
            $offset += 4;
        } elseif ($additionalInfo === 27) {
            $length =unpack('J', substr($data, $offset, 8))[1];
            $offset += 8;
        } else {
            return null; // Indefinite length not supported
        }

        return match ($majorType) {
            0 => $length, // Unsigned integer
            1 => -1 - $length, // Negative integer
            2, 3 => $this->parseCBORString($data, $offset, $length),
            4 => $this->parseCBORArray($data, $offset, $length), // Array
            5 => $this->parseCBORMap($data, $offset, $length), // Map
            7 => $length === 21 ? true : ($length === 22 ? false : null), // Simple/Float
            default => null,
        };
    }

    private function parseCBORString(string $data, int &$offset, int $length): string
    {
        $result = substr($data, $offset, $length);
        $offset += $length;

        return $result;
    }

    private function parseCBORArray(string $data, int &$offset, int $length): array
    {
        $result = [];
        for ($i = 0; $i < $length; $i++) {
            $result[] = $this->parseCBORValue($data, $offset);
        }

        return $result;
    }

    private function parseCBORMap(string $data, int &$offset, int $length): array
    {
        $result = [];
        for ($i = 0; $i < $length; $i++) {
            $key = $this->parseCBORValue($data, $offset);
            $value = $this->parseCBORValue($data, $offset);
            if (is_int($key)) {
                $result[$key] = $value;
            } else {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    private function verifySignature(string $publicKeyBytes, string $data, string $signature): bool
    {
        if (strlen($publicKeyBytes) < 1 || strlen($signature) < 1) {
            return false;
        }

        $pem = $this->buildPemKey($publicKeyBytes);
        $key = openssl_pkey_get_public($pem);
        if (!$key) {
            return false;
        }

        $result = openssl_verify($data, $signature, $key, OPENSSL_ALGO_SHA256);

        return $result === 1;
    }

    private function buildPemKey(string $keyBytes): string
    {
        // If it's already PEM, return it
        if (str_starts_with($keyBytes, '-----')) {
            return $keyBytes;
        }

        // If it's a raw EC uncompressed point (0x04 prefix, 65 bytes), build DER directly
        if (strlen($keyBytes) === 65 && $keyBytes[0] === "\x04") {
            $der = $this->buildECDerKey($keyBytes);
            if ($der) {
                $b64 = chunk_split(base64_encode($der), 64, "\n");
                return "-----BEGIN PUBLIC KEY-----\n{$b64}-----END PUBLIC KEY-----\n";
            }
        }

        // If it starts with a CBOR map header (0xA0-0xBF), parse COSE key
        $firstByte = ord($keyBytes[0]);
        if ($firstByte >= 0xA0 && $firstByte <= 0xBF) {
            $cooseKey = $this->parseCBOR($keyBytes);
            if (is_array($cooseKey)) {
                $kty = $cooseKey[1] ?? null;
                $x = $cooseKey[-2] ?? null;
                $y = $cooseKey[-3] ?? null;

                // kty=2 is EC2
                if ($kty === 2 && $x && $y && strlen($x) === 32 && strlen($y) === 32) {
                    $rawEcPoint = "\x04" . $x . $y;
                    $der = $this->buildECDerKey($rawEcPoint);
                    if ($der) {
                        $b64 = chunk_split(base64_encode($der), 64, "\n");
                        return "-----BEGIN PUBLIC KEY-----\n{$b64}-----END PUBLIC KEY-----\n";
                    }
                }

                // kty=3 is RSA — extract n and e
                $n = $cooseKey[-1] ?? null;
                $e = $cooseKey[3] ?? null;
                if ($kty === 3 && $n && $e) {
                    $der = $this->buildRSADerKey($n, $e);
                    if ($der) {
                        $b64 = chunk_split(base64_encode($der), 64, "\n");
                        return "-----BEGIN PUBLIC KEY-----\n{$b64}-----END PUBLIC KEY-----\n";
                    }
                }
            }
        }

        // Fallback: try as raw DER/SubjectPublicKeyInfo
        $b64 = chunk_split(base64_encode($keyBytes), 64, "\n");

        return "-----BEGIN PUBLIC KEY-----\n{$b64}-----END PUBLIC KEY-----\n";
    }

    private function buildECDerKey(string $rawKey): ?string
    {
        if (strlen($rawKey) !== 65 || $rawKey[0] !== "\x04") {
            return null;
        }

        $x = substr($rawKey, 1, 32);
        $y = substr($rawKey, 33, 32);

        // Build EC public key in SubjectPublicKeyInfo format
        $ecPublicKey = "\x04" . $x . $y;
        $ecPublicKeyBitString = "\x03" . $this->encodeLength(strlen($ecPublicKey) + 1) . "\x00" . $ecPublicKey;

        // OID for P-256 curve (1.2.840.10045.3.1.7)
        $oid = "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07";
        $algorithmSeq = "\x30" . $this->encodeLength(strlen($oid) + strlen("\x05\x00")) . $oid . "\x05\x00";

        $subjectPublicKeyInfo = "\x30" . $this->encodeLength(strlen($algorithmSeq) + strlen($ecPublicKeyBitString)) . $algorithmSeq . $ecPublicKeyBitString;

        return $subjectPublicKeyInfo;
    }

    private function buildRSADerKey(string $n, string $e): ?string
    {
        // Remove leading zero bytes from n and e (DER requires minimal encoding)
        $n = ltrim($n, "\x00");
        $e = ltrim($e, "\x00");

        // OID for RSA encryption (1.2.840.113549.1.1.1)
        $algorithmSeq = "\x30\x0d\x30\x09\x06\x07\x2a\x86\x48\xce\x37\x02\x02\x06\x01";
        $nInteger = "\x02" . $this->encodeLength(strlen($n)) . $n;
        $eInteger = "\x02" . $this->encodeLength(strlen($e)) . $e;
        $rsaSeq = "\x30" . $this->encodeLength(strlen($nInteger) + strlen($eInteger)) . $nInteger . $eInteger;
        $bitString = "\x03" . $this->encodeLength(strlen($rsaSeq) + 1) . "\x00" . $rsaSeq;

        return "\x30" . $this->encodeLength(strlen($algorithmSeq) + strlen($bitString)) . $algorithmSeq . $bitString;
    }

    private function encodeLength(int $length): string
    {
        if ($length < 0x80) {
            return chr($length);
        }
        if ($length < 0x100) {
            return "\x81" . chr($length);
        }
        if ($length < 0x10000) {
            return "\x82" . pack('n', $length);
        }

        return "\x83" . pack('N', $length);
    }

    private function guessCredentialName(array $clientData): string
    {
        return 'Passkey ' . now()->format('M d, Y');
    }

    private function detectAuthenticatorType(int $flags): string
    {
        // UP (0x01) = User Presence
        // UV (0x04) = User Verification
        // AT (0x40) = Attested
        // ED (0x80) = Extensions
        return ($flags & 0x04) ? 'multiDevice' : 'singleDevice';
    }
}
