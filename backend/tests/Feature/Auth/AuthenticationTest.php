<?php

use App\Models\User;

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
