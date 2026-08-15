<?php

use App\Models\SiteSetting;

test('admin can view site settings', function () {
    $admin = createAdmin();
    SiteSetting::factory()->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/settings');

    $response->assertOk();
});

test('admin can update site settings', function () {
    $admin = createAdmin();
    $setting = SiteSetting::factory()->create(['key' => 'site_name', 'value' => 'Old Kuba']);
    
    $response = $this->actingAs($admin)->postJson('/api/admin/settings', [
        'settings' => [
            ['id' => $setting->id, 'value' => 'New Kuba'],
        ]
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('site_settings', [
        'key' => 'site_name',
        'value' => 'New Kuba'
    ]);
});
