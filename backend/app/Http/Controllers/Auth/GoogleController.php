<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    private function getGoogleDriver()
    {
        $driver = Socialite::driver('google');
        // Disable SSL verification in local environment to prevent cURL error 60
        if (app()->environment('local')) {
            $driver->setHttpClient(new \GuzzleHttp\Client(['verify' => false]));
        }

        return $driver->stateless();
    }

    public function redirectToGoogle(Request $request): RedirectResponse
    {
        $role = $request->query('role', 'customer');
        if (! in_array($role, ['customer', 'provider'], true)) {
            $role = 'customer';
        }

        return $this->getGoogleDriver()
            ->with(['role' => $role])
            ->redirect();
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = $this->getGoogleDriver()->user();
            $oauthRole = $request->input('role', 'customer');
            if (! in_array($oauthRole, ['customer', 'provider'], true)) {
                $oauthRole = 'customer';
            }

            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));

            if (! $user) {
                // First-time Google sign-in: create the user now so the SPA can
                // hit the auth:sanctum-guarded /api/auth/complete-profile route
                // with an actual session.
                $user = User::create([
                    'email' => $googleUser->email,
                    'first_name' => $googleUser->user['given_name'] ?? '',
                    'last_name' => $googleUser->user['family_name'] ?? '',
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(40)),
                    'role' => $oauthRole,
                    'is_verified' => true,
                    'is_active' => true,
                ]);

                Auth::guard('web')->login($user);

                if ($request->hasSession()) {
                    $request->session()->regenerate();
                }

                $params = http_build_query([
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'google_id' => $user->google_id,
                    'is_new' => true,
                    'role' => $oauthRole,
                ]);

                return redirect($frontendUrl.'/auth/complete-profile?'.$params);
            }

            // Sync google_id if it was found by email
            if (! $user->google_id) {
                $user->update(['google_id' => $googleUser->id]);
            }

            Auth::guard('web')->login($user);

            if ($request->hasSession()) {
                $request->session()->regenerate();
            }

            // If user exists but no role, they still need to complete profile
            if (! $user->role) {
                $params = http_build_query([
                    'email' => $user->email,
                    'is_incomplete' => true,
                ]);

                return redirect($frontendUrl.'/auth/complete-profile?'.$params);
            }

            // For SPA, we might need to pass a token or just rely on cookies/sessions
            // Since we are using Sanctum/web guard, session should be set in this browser context
            $dashboardPath = $user->role === UserRole::Admin
                ? '/admin'
                : ($user->role === UserRole::Provider ? '/dashboard/provider' : '/dashboard/client');

            return redirect($frontendUrl.$dashboardPath);

        } catch (\Exception $e) {
            \Log::error('Google Auth Error: '.$e->getMessage());
            $frontendUrl = config('app.frontend_url', 'https://kuba.co.ke');

            return redirect($frontendUrl.'/login?error=google_auth_failed');
        }
    }
}
