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
    
    $response = $this->actingAs($admin)->postJson('/api/admin/settings', [
        'settings' => [
            'site_name' => 'New Kuba',
            'contact_email' => 'support@newkuba.com'
        ]
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('site_settings', [
        'key' => 'site_name',
        'value' => 'New Kuba'
    ]);
});
