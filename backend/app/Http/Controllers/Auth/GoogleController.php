<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

    public function redirectToGoogle()
    {
        return $this->getGoogleDriver()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = $this->getGoogleDriver()->user();
            
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));

            if (!$user) {
                // Redirect to frontend complete-profile with data
                $params = http_build_query([
                    'first_name' => $googleUser->user['given_name'] ?? '',
                    'last_name' => $googleUser->user['family_name'] ?? '',
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'is_new' => true
                ]);
                return redirect($frontendUrl . '/auth/complete-profile?' . $params);
            }

            // If user exists but no role, they still need to complete profile
            if (!$user->role) {
                $params = http_build_query([
                    'email' => $user->email,
                    'is_incomplete' => true
                ]);
                return redirect($frontendUrl . '/auth/complete-profile?' . $params);
            }

            // Sync google_id if it was found by email
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->id]);
            }

            Auth::login($user);
            
            // For SPA, we might need to pass a token or just rely on cookies/sessions
            // Since we are using Sanctum/web guard, session should be set in this browser context
            return redirect($frontendUrl . '/dashboard');

        } catch (\Exception $e) {
            \Log::error('Google Auth Error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/login?error=google_auth_failed');
        }
    }
}
