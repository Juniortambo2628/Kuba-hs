<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorChallengeController extends Controller
{
    /**
     * Verify a TOTP code to complete the 2FA challenge.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $userId = $request->session()->get('2fa_user_id');
        if (!$userId) {
            return response()->json(['message' => 'No pending 2FA challenge. Please sign in again.'], 422);
        }

        $user = User::find($userId);
        if (!$user || !$user->two_factor_secret) {
            $request->session()->forget('2fa_user_id');

            return response()->json(['message' => 'Invalid session. Please sign in again.'], 422);
        }

        $secret = Crypt::decryptString($user->two_factor_secret);
        $google2fa = new Google2FA();

        $code = $request->input('code');

        // Check if it's a recovery code
        if (strlen($code) === 9 && str_contains($code, '-')) {
            return $this->verifyRecoveryCode($request, $user, $code);
        }

        // Verify TOTP code
        if (!$google2fa->verifyKey($secret, $code)) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        // Complete the login
        return $this->completeLogin($request, $user);
    }

    /**
     * Verify a recovery code to complete the 2FA challenge.
     */
    private function verifyRecoveryCode(Request $request, User $user, string $code): JsonResponse
    {
        if (!$user->two_factor_recovery_codes) {
            return response()->json(['message' => 'Invalid recovery code.'], 422);
        }

        $recoveryCodes = json_decode(Crypt::decryptString($user->two_factor_recovery_codes), true);

        $codeIndex = array_search(strtoupper($code), $recoveryCodes);
        if ($codeIndex === false) {
            return response()->json(['message' => 'Invalid recovery code.'], 422);
        }

        // Remove used recovery code
        unset($recoveryCodes[$codeIndex]);
        $recoveryCodes = array_values($recoveryCodes);

        $user->update([
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode($recoveryCodes)),
        ]);

        return $this->completeLogin($request, $user);
    }

    /**
     * Complete login after 2FA verification.
     */
    private function completeLogin(Request $request, User $user): JsonResponse
    {
        $request->session()->forget('2fa_user_id');

        Auth()->guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Authenticated successfully.',
            'user' => new UserResource($user),
        ]);
    }
}
