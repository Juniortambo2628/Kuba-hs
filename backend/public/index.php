<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
} elseif (file_exists($maintenance = __DIR__.'/../../kuba_backend/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
$autoload = __DIR__.'/../vendor/autoload.php';
if (!file_exists($autoload)) {
    // Check production path (moved to public_html/api) relative to /home/ycpixrti/kuba_backend
    $autoload = __DIR__.'/../../kuba_backend/vendor/autoload.php';
}
require $autoload;

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$bootstrap = __DIR__.'/../bootstrap/app.php';
if (!file_exists($bootstrap)) {
    $bootstrap = __DIR__.'/../../kuba_backend/bootstrap/app.php';
}
$app = require_once $bootstrap;

$app->handleRequest(Request::capture());
