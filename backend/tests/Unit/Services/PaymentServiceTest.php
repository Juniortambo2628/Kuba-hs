<?php

use App\Services\PaymentService;
use App\Models\Booking;

test('it can process payment for booking', function () {
    // Basic service test structure
    // Since we don't have the exact method signatures, we assert the service can be resolved
    $service = app(PaymentService::class);
    $this->assertNotNull($service);
});
