<?php

use Illuminate\Support\Facades\Artisan;
use App\Models\User;

test('database seeder runs successfully', function () {
    // Run the main seeder
    $exitCode = Artisan::call('db:seed');
    
    $this->assertEquals(0, $exitCode, 'Database seeder failed to run.');
    
    // Assert some core data exists that the seeder should have created
    // The exact assertion depends on what your DatabaseSeeder does.
    // For now we just verify it runs without crashing.
    $this->assertTrue(true); 
});
