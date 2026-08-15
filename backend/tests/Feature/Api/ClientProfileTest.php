<?php

use Illuminate\Support\Facades\Hash;

test('client can view profile', function () {
    $customer = createCustomer();

    $response = $this->actingAs($customer)->getJson('/api/user');

    $response->assertOk()
        ->assertJsonPath('data.email', $customer->email);
});

test('client can update profile', function () {
    $customer = createCustomer();

    $response = $this->actingAs($customer)->putJson('/api/client/profile', [
        'first_name' => 'Updated',
        'last_name' => 'Name',
        'phone' => '0799999999',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('users', [
        'id' => $customer->id,
        'first_name' => 'Updated',
        'phone' => '0799999999',
    ]);
});

test('client can change password', function () {
    $customer = createCustomer(['password' => Hash::make('oldpassword')]);

    $response = $this->actingAs($customer)->patchJson('/api/client/password', [
        'current_password' => 'oldpassword',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertOk();
    
    // Verify password was changed
    $this->assertTrue(Hash::check('newpassword123', $customer->fresh()->password));
});

test('client cannot change password with wrong current password', function () {
    $customer = createCustomer(['password' => Hash::make('oldpassword')]);

    $response = $this->actingAs($customer)->patchJson('/api/client/password', [
        'current_password' => 'wrongpassword',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['current_password']);
});
