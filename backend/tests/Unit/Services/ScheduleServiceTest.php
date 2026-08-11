<?php

use App\Services\ScheduleService;

test('schedule service can be resolved', function () {
    $service = app(ScheduleService::class);
    $this->assertNotNull($service);
});
