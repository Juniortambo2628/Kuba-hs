<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

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
        if ($user->role === 'admin') return true;
        if ($user->role === 'provider' && $booking->provider_id === ($user->provider->id ?? null)) return true;
        if ($user->role === 'client' && $booking->customer_id === $user->id) return true;
        
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        if ($user->role === 'admin') return true;

        if ($user->role === 'provider' && $booking->provider_id === ($user->provider->id ?? null)) {
            return true;
        }

        if ($user->role === 'client' && $booking->customer_id === $user->id) {
            // Clients can only cancel
            return request('status') === 'cancelled';
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
