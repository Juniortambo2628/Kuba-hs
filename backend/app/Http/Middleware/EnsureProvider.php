<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProvider
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== 'provider') {
            abort(403, 'Provider access required.');
        }

        $user->ensureProviderProfile();
        $user->load('provider');

        return $next($request);
    }
}
