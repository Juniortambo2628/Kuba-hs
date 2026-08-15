<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorSetup
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->two_factor_setup_required) {
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'message' => 'Two-factor authentication setup required.',
                    'two_factor_setup_required' => true,
                ], 403);
            }

            return redirect('/auth/two-factor/setup');
        }

        return $next($request);
    }
}
