<?php

use App\Models\Provider;

test('admin can list providers', function () {
    $admin = createAdmin();
    Provider::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/providers');

    $response->assertOk();
});

test('admin can view provider details', function () {
    $admin = createAdmin();
    $provider = Provider::factory()->create();

    $response = $this->actingAs($admin)->getJson("/api/admin/providers/{$provider->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $provider->id);
});

test('admin can update provider status', function () {
    $admin = createAdmin();
    $provider = Provider::factory()->create(['application_status' => 'pending']);

    $response = $this->actingAs($admin)->patchJson("/api/admin/providers/{$provider->id}/status", [
        'application_status' => 'approved',
        'is_verified' => true
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('providers', [
        'id' => $provider->id,
        'application_status' => 'approved',
        'is_verified' => true
    ]);
});
