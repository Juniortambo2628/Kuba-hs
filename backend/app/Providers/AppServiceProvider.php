<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);
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
