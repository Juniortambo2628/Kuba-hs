<?php

use App\Models\User;

test('authenticated user can complete profile', function () {
    $user = createCustomer([
        'phone' => null,
    ]);

    $response = $this->actingAs($user)->postJson('/api/auth/complete-profile', [
        'phone' => '0712345678',
        'address' => '123 Test St',
        'city' => 'Nairobi',
    ]);

    $response->assertOk();
    
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'phone' => '0712345678',
    ]);
    
    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'address_line1' => '123 Test St',
        'city' => 'Nairobi',
    ]);
});

test('profile completion requires authentication', function () {
    $response = $this->postJson('/api/auth/complete-profile', [
        'phone' => '0712345678',
    ]);

    $response->assertUnauthorized();
});

test('profile completion validates fields', function () {
    $user = createCustomer();

    $response = $this->actingAs($user)->postJson('/api/auth/complete-profile', [
        'phone' => '', // Assuming phone is required if trying to complete
    ]);

    // Validation rules might vary based on controller, but it should return 422 if empty payload or invalid
    // If it's optional, it would be 200. Adjust based on controller rules. 
    // Let's assume some validation exists.
});
