<?php

use App\Models\Provider;

test('admin can get workforce verification status', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/verification');

    $response->assertOk();
});

test('admin can update provider verification status', function () {
    $admin = createAdmin();
    $provider = Provider::factory()->create(['is_verified' => false]);

    $response = $this->actingAs($admin)->patchJson("/api/admin/verification/{$provider->id}", [
        'is_verified' => true
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('providers', [
        'id' => $provider->id,
        'is_verified' => true
    ]);
});
