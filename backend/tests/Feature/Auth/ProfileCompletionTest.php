<?php

use App\Models\User;

test('authenticated user can complete profile', function () {
    $user = createCustomer([
        'phone' => null,
    ]);

    $response = $this->actingAs($user)->postJson('/api/auth/complete-profile', [
        'email' => $user->email,
        'role' => 'customer',
        'first_name' => 'Test',
        'last_name' => 'User',
        'phone' => '0712345678',
        'google_id' => 'google-12345',
    ]);

    $response->assertOk();
    
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'phone' => '0712345678',
    ]);
});

test('profile completion requires authentication', function () {
    $response = $this->postJson('/api/auth/complete-profile', [
        'phone' => '0712345678',
    ]);

    $response->assertUnauthorized();
});

test('profile completion validates required fields', function () {
    $user = createCustomer();

    $response = $this->actingAs($user)->postJson('/api/auth/complete-profile', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['role', 'first_name', 'last_name']);
});

test('profile completion rejects invalid role', function () {
    $user = createCustomer();

    $response = $this->actingAs($user)->postJson('/api/auth/complete-profile', [
        'role' => 'superuser',
        'first_name' => 'Test',
        'last_name' => 'User',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['role']);
});
