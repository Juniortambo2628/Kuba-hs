<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = App\Models\Service::all();
echo "Found " . $services->count() . " services.\n";
foreach ($services as $s) {
    echo "ID: " . $s->id . " | Name: " . $s->name . "\n";
}
echo "\n--- Provider Services for jojwang ---\n";
$user = App\Models\User::where('email', 'jojwang@gmail.com')->first();
if ($user && $user->provider) {
    $psList = $user->provider->providerServices;
    foreach ($psList as $ps) {
        echo "PS ID: {$ps->id} | Service_ID: {$ps->service_id} | Raw DB Service_ID: " . $ps->getRawOriginal('service_id') . "\n";
    }
}
