<?php

use App\Services\ImageOptimizationService;

test('image optimization service can be resolved', function () {
    $service = app(ImageOptimizationService::class);
    $this->assertNotNull($service);
});
