<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\EmailLoginCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmailCodeController extends Controller
{
    /**
     * Request a one-time login code via email.
     */
    public function requestCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Always return success to prevent email enumeration
        if (!$user) {
            return response()->json([
                'message' => 'If an account exists with that email, a login code has been sent.',
            ]);
        }

        // Rate limit: max 3 codes per 10 minutes
        $recentCodes = EmailLoginCode::where('user_id', $user->id)
            ->where('created_at', '>', now()->subMinutes(10))
            ->count();

        if ($recentCodes >= 3) {
            return response()->json([
                'message' => 'Too many code requests. Please wait before trying again.',
            ], 429);
        }

        // Generate 6-digit code
        $code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Invalidate any existing unused codes for this user
        EmailLoginCode::where('user_id', $user->id)
            ->where('used', false)
            ->update(['used' => true]);

        // Store new code
        EmailLoginCode::create([
            'user_id' => $user->id,
            'code' => $code,
            'email' => $user->email,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Send email
        Mail::raw("Your Kuba login code is: {$code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.", function ($message) use ($user, $code) {
            $message->to($user->email)
                ->subject('Your Kuba Login Code')
                ->from(config('mail.from.address'), config('mail.from.name'));
        });

        return response()->json([
            'message' => 'If an account exists with that email, a login code has been sent.',
        ]);
    }

    /**
     * Verify a login code and complete authentication.
     */
    public function verifyCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid or expired code.',
            ], 422);
        }

        $loginCode = EmailLoginCode::where('user_id', $user->id)
            ->where('code', $request->code)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$loginCode) {
            return response()->json([
                'message' => 'Invalid or expired code.',
            ], 422);
        }

        // Mark code as used
        $loginCode->update(['used' => true]);

        // Check if user is active
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been deactivated. Please contact support.',
            ], 403);
        }

        // Complete login
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        // Check if 2FA is required
        if ($user->hasTwoFactorEnabled()) {
            $request->session()->put('2fa_user_id', $user->id);

            return response()->json([
                'two_factor_required' => true,
                'challenge_methods' => ['totp', 'recovery_code'],
            ]);
        }

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => new UserResource($user),
        ]);
    }
}
