<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$value = DB::table('site_settings')->where('key', 'navigation_menu')->value('value');
echo "VALUE_START\n";
echo $value;
echo "\nVALUE_END\n";
