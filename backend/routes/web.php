<?php

use Illuminate\Support\Facades\Route;

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


// /cms-assets/* used to be a PHP proxy that streamed files through Laravel;
// each image spawned a PHP worker and blew through the cPanel entry-process
// limit under any load (HTTP 508). Front end now hits /storage/* directly
// (served as static files by LiteSpeed via the storage symlink).

require __DIR__.'/auth.php';
