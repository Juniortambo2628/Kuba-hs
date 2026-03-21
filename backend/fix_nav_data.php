<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$navItems = [
    ['id' => 'nav_1', 'label' => 'Services', 'url' => '/services'],
    ['id' => 'nav_2', 'label' => 'Providers', 'url' => '/providers'],
    ['id' => 'nav_3', 'label' => 'About', 'url' => '/about'],
    ['id' => 'nav_4', 'label' => 'Journal', 'url' => '/blog'],
    ['id' => 'nav_5', 'label' => 'Contact', 'url' => '/contact'],
    ['id' => 'nav_6', 'label' => 'Investors', 'url' => '/investors'],
    ['id' => 'nav_7', 'label' => 'Commercial', 'url' => '/commercial'],
    ['id' => 'nav_8', 'label' => 'Cooperatives', 'url' => '/cooperatives']
];

$json = json_encode($navItems);

$affected = DB::table('site_settings')
    ->where('key', 'navigation_menu')
    ->update(['value' => $json]);

echo "AFFECTED: $affected\n";
echo "NEW_VALUE: $json\n";
