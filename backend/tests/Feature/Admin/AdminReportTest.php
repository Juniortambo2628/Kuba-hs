<?php

test('admin can generate reports', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/reports/generate', [
        'type' => 'financial',
        'date_range' => 'last_30_days',
        'format' => 'pdf'
    ]);

    $response->assertOk();
});

test('admin can view report history', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/reports/history');

    $response->assertOk();
});
