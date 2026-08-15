<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

test('all migrations run successfully', function () {
    // RefreshDatabase trait already runs migrations before each test.
    // If it didn't crash, the 'up' migrations work.
    // We assert a key table exists as proof.
    $this->assertTrue(Schema::hasTable('users'));
    $this->assertTrue(Schema::hasTable('providers'));
    $this->assertTrue(Schema::hasTable('bookings'));
});

test('migrations can be rolled back', function () {
    // Run rollback
    $exitCode = Artisan::call('migrate:rollback');
    
    // Assert successful rollback (exit code 0)
    $this->assertEquals(0, $exitCode);
    
    // The safest check is to verify we can re-migrate successfully
    Artisan::call('migrate');
    $this->assertTrue(Schema::hasTable('users'));
    $this->assertTrue(Schema::hasTable('providers'));
    $this->assertTrue(Schema::hasTable('bookings'));
});
