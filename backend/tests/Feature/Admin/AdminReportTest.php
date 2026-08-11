<?php

test('admin can generate reports', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->postJson('/api/admin/reports/generate', [
        'type' => 'financial',
        'date_range' => 'last_30_days',
        'format' => 'pdf'
    ]);

    $response->assertOk(); // Might be accepted or created depending on async handling
});

test('admin can view report history', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/reports/history');

    $response->assertOk();
});
