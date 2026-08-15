<?php

use App\Models\Provider;
use App\Models\VerificationDocument;

test('admin can get workforce verification status', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/workforce/verification');

    $response->assertOk();
});

test('admin can update provider verification status', function () {
    $admin = createAdmin();
    $provider = Provider::factory()->create(['is_verified' => false]);
    $document = VerificationDocument::factory()->create([
        'provider_id' => $provider->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->patchJson("/api/admin/workforce/verification/{$document->id}", [
        'status' => 'approved'
    ]);

    $response->assertOk();
});
