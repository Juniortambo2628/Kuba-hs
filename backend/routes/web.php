<?php

use App\Http\Controllers\Admin\Auth\AdminLoginController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/test-cors', function () {
    return response('CORS Test', 200)->header('Access-Control-Allow-Origin', '*');
});

Route::get('/storage-test', function () {
    return response('Storage Route Test', 200)->header('Access-Control-Allow-Origin', '*');
});

Route::get('/', function () {
    return redirect(config('app.frontend_url', env('FRONTEND_URL', 'https://kuba.co.ke')));
});

// Legacy Inertia routes have been removed.
// All admin/provider/client UI is now served by the Next.js frontend.
// Backend operates strictly as a headless API (api.php).


// Local Development Storage Proxy for CORS (Artisan serve compatibility)
if (app()->isLocal()) {
    Route::get('/cms-assets/{path}', function ($path) {
        \Log::info("CMS Assets Proxy hit: " . $path);
        $fullPath = storage_path('app/public/' . $path);
        if (!file_exists($fullPath)) {
            \Log::warning("CMS Assets Proxy file not found: " . $fullPath);
            abort(404);
        }
        
        $file = file_get_contents($fullPath);
        $type = mime_content_type($fullPath);
        
        return response($file, 200)
            ->header('Content-Type', $type)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET')
            ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    })->where('path', '.*');
}

require __DIR__.'/auth.php';
