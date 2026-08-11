<?php

use App\Services\LedgerService;

test('ledger service can be resolved', function () {
    $service = app(LedgerService::class);
    $this->assertNotNull($service);
});
