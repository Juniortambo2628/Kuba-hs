<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Fortify ships a complete second auth stack - /login, /register,
        // /logout, /forgot-password, /reset-password, /two-factor-challenge,
        // /user/two-factor-*, /user/confirm-password, /user/password,
        // /user/profile-information and /passkeys/* - on top of the ones the
        // API serves under /api/auth. None of it has a caller: the Next.js
        // client posts only to /api/auth/*, no test reaches these URIs, and
        // the handful of URIs both stacks shared were already decided by load
        // order (the closures in routes/auth.php won every one).
        //
        // This has to run before FortifyServiceProvider::boot() calls
        // configureRoutes(), so it belongs in register(), not boot().
        Fortify::ignoreRoutes();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Schema::defaultStringLength(191);
        \App\Models\Review::observe(\App\Observers\ReviewObserver::class);

        ResetPassword::createUrlUsing(function ($user, string $token) {
            $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');

            return $base.'/reset-password?'.http_build_query([
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ]);
        });
    }
}
