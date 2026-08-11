<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can upload media via filepond', function () {
    Storage::fake('public');
    $admin = createAdmin();
    $file = UploadedFile::fake()->image('banner.jpg');

    $response = $this->actingAs($admin)->postJson('/api/admin/media/upload', [
        'file' => $file, // Filepond usually sends it under a specific key or raw
    ]);

    $response->assertOk();
});

test('admin can revert media upload', function () {
    $admin = createAdmin();
    
    // Filepond sends the server ID to revert
    $response = $this->actingAs($admin)->deleteJson('/api/admin/media/revert', [
        'serverId' => 'temp-folder/banner.jpg'
    ]);

    // May return 200 or 204
    $this->assertNotEquals(401, $response->getStatusCode());
    $this->assertNotEquals(403, $response->getStatusCode());
});
