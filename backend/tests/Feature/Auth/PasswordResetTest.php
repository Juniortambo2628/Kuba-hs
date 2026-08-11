<?php

use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\PasswordReset;

test('reset password link endpoint responds', function () {
    $response = $this->postJson('/api/auth/forgot-password', [
        'email' => 'nonexistent@example.com',
    ]);

    $response->assertStatus(422);
});

test('reset password requires email field', function () {
    $response = $this->postJson('/api/auth/forgot-password', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});

test('can request password reset link for valid email', function () {
    $user = createCustomer(['email' => 'reset@example.com']);

    $response = $this->postJson('/api/auth/forgot-password', [
        'email' => 'reset@example.com',
    ]);

    // Validation passes, standard Laravel message returned
    $response->assertOk();
    $this->assertDatabaseHas('password_reset_tokens', [
        'email' => 'reset@example.com',
    ]);
});

test('can reset password with valid token', function () {
    Event::fake([PasswordReset::class]);
    
    $user = createCustomer(['email' => 'newpass@example.com']);
    $token = Password::broker()->createToken($user);

    $response = $this->postJson('/api/auth/reset-password', [
        'token' => $token,
        'email' => 'newpass@example.com',
        'password' => 'NewPassword123!',
        'password_confirmation' => 'NewPassword123!',
    ]);

    $response->assertOk();
    Event::assertDispatched(PasswordReset::class);
});

test('cannot reset password with invalid token', function () {
    $user = createCustomer(['email' => 'badtoken@example.com']);

    $response = $this->postJson('/api/auth/reset-password', [
        'token' => 'invalid-token-123',
        'email' => 'badtoken@example.com',
        'password' => 'NewPassword123!',
        'password_confirmation' => 'NewPassword123!',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']); // Laravel maps token error to email field
});
