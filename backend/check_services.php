<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'jojwang@gmail.com')->first();
if (!$user || !$user->provider) {
    echo "User or provider not found\n";
    exit;
}

$services = $user->provider->providerServices()->get();
echo "Found " . $services->count() . " provider services.\n";
foreach ($services as $ps) {
    $service = App\Models\Service::find($ps->service_id);
    echo "PS ID: {$ps->id}\n";
    echo "Service ID in DB: " . $ps->service_id . " (Type: " . gettype($ps->service_id) . ")\n";
    echo "Matching Service Name: " . ($service ? $service->name : "NOT FOUND") . "\n";
    echo "-------------------\n";
}
