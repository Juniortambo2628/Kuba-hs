<?php

use App\Models\User;
use App\Enums\UserRole;

test('registration endpoint responds', function () {
    $response = $this->postJson('/api/auth/register', []);

    $response->assertStatus(422);
});

test('new users can register via API', function () {
    $response = $this->postJson('/api/auth/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'customer',
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'user' => ['id', 'email', 'role'],
            'message',
        ]);
        
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => UserRole::Customer->value,
    ]);
});

test('registration validates required fields', function () {
    $response = $this->postJson('/api/auth/register', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password', 'role']);
});

test('registration prevents duplicate emails', function () {
    $existing = createCustomer(['email' => 'duplicate@example.com']);

    $response = $this->postJson('/api/auth/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'duplicate@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'customer',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('providers can register via specialized endpoint', function () {
    $response = $this->postJson('/api/auth/register-provider', [
        'first_name' => 'Pro',
        'last_name' => 'Fixer',
        'email' => 'pro@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'business_name' => 'Fixer Co',
        'experience_years' => 5,
        'bio' => 'Experienced home service provider with over 5 years of expertise.',
        'category' => 'Cleaning & Maintenance',
    ]);

    $response->assertCreated();
    
    $this->assertDatabaseHas('users', [
        'email' => 'pro@example.com',
        'role' => UserRole::Provider->value,
    ]);
    
    $this->assertDatabaseHas('providers', [
        'business_name' => 'Fixer Co',
    ]);
});
