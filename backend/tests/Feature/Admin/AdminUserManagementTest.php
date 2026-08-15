<?php

use App\Models\User;

test('admin can list users', function () {
    $admin = createAdmin();
    User::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/users');

    $response->assertOk();
});

test('admin can view user details', function () {
    $admin = createAdmin();
    $user = createCustomer();

    $response = $this->actingAs($admin)->getJson("/api/admin/users/{$user->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $user->id);
});

test('admin can toggle user status', function () {
    $admin = createAdmin();
    $user = createCustomer(['is_active' => true]);

    $response = $this->actingAs($admin)->patchJson("/api/admin/users/{$user->id}/toggle-status", [
        'is_active' => false
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'is_active' => false
    ]);
});
