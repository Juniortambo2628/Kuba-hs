<?php

use App\Services\ProviderSearchService;

test('provider search service can be resolved', function () {
    $service = app(ProviderSearchService::class);
    $this->assertNotNull($service);
});
