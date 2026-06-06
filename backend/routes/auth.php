<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;

$frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'https://kuba.co.ke'));

Route::middleware('guest')->group(function () use ($frontendUrl) {
    Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

    // Redirect headless GET requests to the Next.js frontend
    Route::get('register', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/register/provider');
    })->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/login');
    })->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', function () use ($frontendUrl) {
        return redirect($frontendUrl . '/forgot-password');
    })->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', function (string $token) use ($frontendUrl) {
        $query = http_build_query([
            'token' => $token,
            'email' => request()->query('email', ''),
        ]);

        return redirect($frontendUrl . '/reset-password?' . $query);
    })->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
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

    /*
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
    */

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
