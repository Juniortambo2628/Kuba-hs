<?php

use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;

$frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'https://kuba.co.ke'));

// Session-state entry points (login, register, password reset, logout) live
// under /api/auth - the Next.js client only speaks JSON to them, and having a
// second set here meant the same controller answered two different contracts.
// What is kept below is either a redirect to the frontend or an OAuth/signed
// GET flow that cannot be an API call.
Route::middleware('guest')->group(function () use ($frontendUrl) {
    Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

    // Redirect headless GET requests to the Next.js frontend
    Route::get('register', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/register/provider');
    })->name('register');

    Route::get('login', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/login');
    })->name('login');

    Route::get('forgot-password', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/forgot-password');
    })->name('password.request');

    Route::get('reset-password/{token}', function (string $token) use ($frontendUrl) {
        $query = http_build_query([
            'token' => $token,
            'email' => request()->query('email', ''),
        ]);

        return redirect($frontendUrl . '/reset-password?' . $query);
    })->name('password.reset');
});

Route::middleware('auth')->group(function () use ($frontendUrl) {
    Route::get('verify-email', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/dashboard');
    })->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Kept: PasswordUpdateTest exercises it, and it is a session form endpoint
    // with no /api equivalent (Fortify's twin lives at PUT /user/password).
    // Left unnamed: Fortify already claims password.update for its own
    // POST /reset-password, and two routes answering to one name means
    // route('password.update') resolves to whichever registered first.
    Route::put('password', [PasswordController::class, 'update']);
});
