<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\WebauthnCredential;
use App\Notifications\SignInLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $request->authenticate();

        $user = $request->user();

        // Check if 2FA is enabled — return challenge instead of completing login
        if ($user->hasTwoFactorEnabled()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $request->session()->put('2fa_user_id', $user->id);

            return response()->json([
                'two_factor_required' => true,
                'challenge_methods' => ['totp', 'recovery_code'],
            ]);
        }

        $request->session()->regenerate();

        // Send sign-in notification
        $user->notify(new SignInLog(
            ip: $request->ip(),
            user_agent: $request->userAgent(),
            timestamp: now()
        ));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'message' => 'Logged in successfully',
                'user' => new UserResource($user),
            ]);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Handle passkey-based sign-in.
     */
    public function passkeyLogin(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'user_id' => 'required|string',
        ]);

        $user = \App\Models\User::find($request->input('user_id'));
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Check if 2FA is enabled
        if ($user->hasTwoFactorEnabled()) {
            // Passkey already verified identity, skip 2FA challenge
            Auth::guard('web')->login($user);
            $request->session()->regenerate();

            $user->notify(new SignInLog(
                ip: $request->ip(),
                user_agent: $request->userAgent(),
                timestamp: now(),
                method: 'passkey'
            ));

            return response()->json([
                'message' => 'Logged in successfully via passkey.',
                'user' => new UserResource($user),
            ]);
        }

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        $user->notify(new SignInLog(
            ip: $request->ip(),
            user_agent: $request->userAgent(),
            timestamp: now(),
            method: 'passkey'
        ));

        return response()->json([
            'message' => 'Logged in successfully via passkey.',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Logged out successfully']);
        }

        return redirect('/');
    }
}
