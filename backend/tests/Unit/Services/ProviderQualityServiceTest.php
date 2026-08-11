<?php

use App\Services\ProviderQualityService;

test('provider quality service can be resolved', function () {
    $service = app(ProviderQualityService::class);
    $this->assertNotNull($service);
});
