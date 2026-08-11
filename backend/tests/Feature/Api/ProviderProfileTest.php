<?php

test('provider can update profile', function () {
    $providerUser = createProviderUser();

    $response = $this->actingAs($providerUser)->postJson('/api/provider/profile', [
        'business_name' => 'New Biz Name',
        'bio' => 'New bio',
        'experience_years' => 5,
        'service_radius' => 25,
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('providers', [
        'id' => $providerUser->provider->id,
        'business_name' => 'New Biz Name',
        'experience_years' => 5,
    ]);
});

test('customer cannot update provider profile', function () {
    $customer = createCustomer();

    $response = $this->actingAs($customer)->postJson('/api/provider/profile', [
        'business_name' => 'Should fail',
    ]);

    $response->assertForbidden();
});
