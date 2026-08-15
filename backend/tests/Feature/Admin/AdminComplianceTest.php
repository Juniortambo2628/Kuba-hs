<?php

use App\Models\Provider;
use App\Models\VerificationDocument;

test('admin can view compliance overview', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/compliance/overview');

    $response->assertOk();
});

test('admin can list providers for compliance', function () {
    $admin = createAdmin();
    Provider::factory()->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/compliance/providers');

    $response->assertOk();
});

test('admin can list verification documents', function () {
    $admin = createAdmin();
    $provider = Provider::factory()->create();
    VerificationDocument::factory()->create(['provider_id' => $provider->id]);

    $response = $this->actingAs($admin)->getJson("/api/admin/compliance/providers/{$provider->id}/documents");

    $response->assertOk();
});

test('admin can review verification document', function () {
    $admin = createAdmin();
    $document = VerificationDocument::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patchJson("/api/admin/compliance/documents/{$document->id}/review", [
        'status' => 'approved',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('verification_documents', [
        'id' => $document->id,
        'status' => 'approved'
    ]);
});
