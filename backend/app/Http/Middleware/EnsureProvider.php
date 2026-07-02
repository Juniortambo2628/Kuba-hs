<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProvider
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== UserRole::Provider) {
            abort(403, 'Provider access required.');
        }

        $user->ensureProviderProfile();
        $user->load('provider');

        return $next($request);
    }
}
