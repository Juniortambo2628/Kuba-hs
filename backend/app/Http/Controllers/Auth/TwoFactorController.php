<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Generate a new 2FA secret and QR code SVG for the user.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();
        $otpUrl = $google2fa->getQRCodeUrl(
            config('app.name', 'Kuba'),
            $user->email,
            $secret
        );

        $renderer = new ImageRenderer(
            new RendererStyle(200, 0),
            new SvgImageBackEnd()
        );
        $qrCodeSvg = (new Writer($renderer))->writeString($otpUrl);

        // Store the secret temporarily (encrypted) until confirmed
        $request->session()->put('2fa_secret', Crypt::encryptString($secret));

        return response()->json([
            'qr_code' => $qrCodeSvg,
            'secret' => $secret,
            'recovery_codes' => $this->generateRecoveryCodes(),
        ]);
    }

    /**
     * Confirm 2FA setup by verifying the TOTP code.
     */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $encryptedSecret = $request->session()->pull('2fa_secret');
        if (!$encryptedSecret) {
            return response()->json(['message' => 'No pending 2FA setup. Please start again.'], 422);
        }

        $secret = Crypt::decryptString($encryptedSecret);

        $google2fa = new Google2FA();
        if (!$google2fa->verifyKey($secret, $request->input('code'))) {
            // Put it back for retry
            $request->session()->put('2fa_secret', $encryptedSecret);

            return response()->json(['message' => 'Invalid verification code. Please try again.'], 422);
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $request->user()->update([
            'two_factor_secret' => Crypt::encryptString($secret),
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode($recoveryCodes)),
            'two_factor_confirmed_at' => now(),
            'two_factor_setup_required' => false,
        ]);

        return response()->json([
            'message' => 'Two-factor authentication enabled.',
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable 2FA for the authenticated user.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!\Illuminate\Support\Facades\Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Incorrect password.'], 422);
        }

        $user->update([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);

        return response()->json(['message' => 'Two-factor authentication disabled.']);
    }

    /**
     * Regenerate recovery codes (invalidates old ones).
     */
    public function recoveryCodes(Request $request): JsonResponse
    {
        $recoveryCodes = $this->generateRecoveryCodes();

        $request->user()->update([
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode($recoveryCodes)),
        ]);

        return response()->json([
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Get current 2FA status.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'enabled' => $user->two_factor_confirmed_at !== null,
            'setup_required' => (bool) $user->two_factor_setup_required,
            'confirmed_at' => $user->two_factor_confirmed_at?->toISOString(),
        ]);
    }

    private function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(Str::random(4) . '-' . Str::random(4));
        }

        return $codes;
    }
}
