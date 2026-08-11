<?php

use App\Services\ReviewService;

test('review service can be resolved', function () {
    $service = app(ReviewService::class);
    $this->assertNotNull($service);
});
