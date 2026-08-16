<?php

namespace App\Traits;

use App\Enums\UserRole;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\JsonResponse;

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

    /**
     * Check if the authenticated user owns the given booking.
     */
    protected function userOwnsBooking($booking): bool
    {
        $user = auth()->user();
        
        return $user->role === UserRole::Provider
            && $user->provider
            && $user->provider->id === $booking->provider_id;
    }

    /**
     * Assert the authenticated user owns the given booking, or abort 403.
     */
    protected function assertOwnsBooking($booking): void
    {
        if (! $this->userOwnsBooking($booking)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
