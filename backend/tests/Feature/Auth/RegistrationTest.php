<?php

test('registration endpoint responds', function () {
    $response = $this->postJson('/api/auth/register', []);

    $response->assertStatus(422);
});

test('new users can register via API', function () {
    $response = $this->postJson('/api/auth/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'customer',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
});

test('registration validates required fields', function () {
    $response = $this->postJson('/api/auth/register', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password', 'role']);
});
