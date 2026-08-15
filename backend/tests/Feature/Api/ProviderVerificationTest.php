<?php

use App\Models\VerificationDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('provider can view verification status', function () {
    $providerUser = createProviderUser();
    VerificationDocument::factory()->create(['provider_id' => $providerUser->provider->id]);

    $response = $this->actingAs($providerUser)->getJson('/api/provider/verification');

    $response->assertOk();
});

test('provider can upload verification documents', function () {
    Storage::fake('public');
    $providerUser = createProviderUser();
    
    $file = UploadedFile::fake()->image('id.jpg');

    $response = $this->actingAs($providerUser)->postJson('/api/provider/verification', [
        'document_type' => 'id_card',
        'file' => $file,
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('verification_documents', [
        'provider_id' => $providerUser->provider->id,
        'document_type' => 'id_card',
    ]);
});
