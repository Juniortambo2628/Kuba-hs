<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$settings = \App\Models\SiteSetting::get();
file_put_contents(__DIR__ . '/public/settings_debug.json', json_encode($settings->groupBy('group')));
echo "Done.";
