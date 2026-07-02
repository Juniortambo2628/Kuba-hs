<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Booking $booking): bool
    {
        if ($user->role === UserRole::Admin) {
            return true;
        }
        if ($user->role === UserRole::Provider && $booking->provider_id === ($user->provider->id ?? null)) {
            return true;
        }
        if ($user->role === UserRole::Customer && $booking->customer_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        if ($user->role === UserRole::Admin) {
            return true;
        }

        if ($user->role === UserRole::Provider && $booking->provider_id === ($user->provider->id ?? null)) {
            return true;
        }

        if ($user->role === UserRole::Customer && $booking->customer_id === $user->id) {
            // Clients can only cancel through this endpoint
            return request()->input('status') === 'cancelled';
        }

        // Allow in_progress for providers
        if ($user->role === UserRole::Provider && $booking->provider_id === ($user->provider->id ?? null)) {
            return in_array(request()->input('status'), ['confirmed', 'in_progress', 'completed', 'cancelled']);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Booking $booking): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Booking $booking): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Booking $booking): bool
    {
        return false;
    }
}
