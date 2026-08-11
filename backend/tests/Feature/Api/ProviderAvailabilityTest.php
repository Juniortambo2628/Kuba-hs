<?php

use App\Models\ProviderAvailability;
use App\Models\ProviderScheduleException;

test('provider can get availability', function () {
    $providerUser = createProviderUser();

    $response = $this->actingAs($providerUser)->getJson('/api/provider/availability');

    $response->assertOk();
});

test('provider can update availability', function () {
    $providerUser = createProviderUser();

    $response = $this->actingAs($providerUser)->putJson('/api/provider/availability', [
        'availability' => [
            [
                'day_of_week' => 1,
                'is_available' => true,
                'start_time' => '08:00',
                'end_time' => '17:00'
            ]
        ]
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('provider_availability', [
        'provider_id' => $providerUser->provider->id,
        'day_of_week' => 1,
    ]);
});

test('provider can set schedule exceptions', function () {
    $providerUser = createProviderUser();
    $date = now()->addDays(5)->format('Y-m-d');

    $response = $this->actingAs($providerUser)->postJson('/api/provider/availability/exceptions', [
        'date' => $date,
        'is_closed' => true,
        'reason' => 'Holiday'
    ]);

    $response->assertOk(); // Might be 201 Created depending on controller
    $this->assertDatabaseHas('provider_schedule_exceptions', [
        'provider_id' => $providerUser->provider->id,
        'date' => $date,
    ]);
});
