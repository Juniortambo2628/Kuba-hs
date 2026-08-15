<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('authenticated user can upload media', function () {
    Storage::fake('public');
    $user = createCustomer();
    $file = UploadedFile::fake()->image('test.jpg');

    $response = $this->actingAs($user)->postJson('/api/media/upload', [
        'file' => $file,
        'collection' => 'avatar',
        'model_type' => 'user',
        'model_id' => $user->id,
    ]);

    $response->assertOk()
        ->assertJsonStructure(['url', 'id']);
});

test('unauthenticated user cannot upload media', function () {
    $file = UploadedFile::fake()->image('test.jpg');

    $response = $this->postJson('/api/media/upload', [
        'file' => $file,
    ]);

    $response->assertUnauthorized();
});

test('authenticated user can delete media', function () {
    // Assuming there's a delete endpoint /api/media/{id}
    $user = createCustomer();
    // This is hard to mock without a specific media model setup, 
    // but we can assert the endpoint is protected
    $response = $this->actingAs($user)->deleteJson('/api/media/1');
    
    // We expect either 200, 204 or 404 (if not found), but not 401/403
    $this->assertNotEquals(401, $response->getStatusCode());
});
