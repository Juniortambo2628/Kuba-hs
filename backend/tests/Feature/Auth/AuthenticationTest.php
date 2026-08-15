<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserRole;

test('login endpoint responds to invalid credentials', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(422);
});

test('login endpoint requires email and password', function () {
    $response = $this->postJson('/api/auth/login', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email', 'password']);
});

test('successful login returns token and user', function () {
    $user = createCustomer(['password' => Hash::make('password123')]);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'user' => ['id', 'email', 'role'],
        ]);
});

test('authenticated user can fetch profile', function () {
    $user = createCustomer();

    $response = $this->actingAs($user)->getJson('/api/user');

    $response->assertOk()
        ->assertJsonPath('data.email', $user->email);
});

test('user can logout', function () {
    $user = createCustomer();

    // The endpoint expects a Sanctum token or session, we just need to ensure the route works
    $response = $this->actingAs($user)->postJson('/api/auth/logout');

    $response->assertOk();
});

test('login endpoint rate limits after too many attempts', function () {
    // Generate 11 failed requests to trigger rate limit (10,1 in routes)
    for ($i = 0; $i < 10; $i++) {
        $this->postJson('/api/auth/login', [
            'email' => 'spam@example.com',
            'password' => 'wrong',
        ]);
    }

    $response = $this->postJson('/api/auth/login', [
        'email' => 'spam@example.com',
        'password' => 'wrong',
    ]);

    $response->assertStatus(429);
});
