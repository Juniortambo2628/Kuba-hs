<?php

namespace App\Traits;

use App\Models\Provider;

trait HasProviderAuthorization
{
    /**
     * Get the authenticated user's provider profile, or abort with 404.
     * Use this in controllers behind the 'provider' middleware.
     */
    protected function getProviderOrFail(): Provider
    {
        $user = auth()->user();
        $provider = $user->provider ?? $user->ensureProviderProfile();
        
        if (! $provider) {
            abort(404, 'Provider profile not found.');
        }
        
        return $provider;
    }
}
