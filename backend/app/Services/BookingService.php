<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\ProviderService;
use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Str;

class BookingService
{
    /**
     * Create a new booking transaction, handling address creation,
     * price calculation, media attachment, and notifications.
     */
    public function createBooking(User $user, array $data, $images = null): Booking
    {
        // Handle Address
        $addressId = $data['address_id'] ?? null;
        if (!$addressId && isset($data['new_address'])) {
            $address = Address::create([
                'user_id' => $user->id,
                'address_type' => $data['service_type'] === 'residential' ? 'residential' : 'business',
                'street_address' => $data['new_address']['street_address'],
                'city' => $data['new_address']['city'],
                'state' => $data['new_address']['state'],
                'postal_code' => $data['new_address']['postal_code'],
                'country' => 'USA', // default for now
                'is_default' => true,
            ]);
            $addressId = $address->id;
        }

        // Get Service Price
        $providerService = ProviderService::where('provider_id', $data['provider_id'])
            ->where('service_id', $data['service_id'])
            ->firstOrFail();

        // Combine date and time if scheduled_time is present
        $scheduledDate = $data['scheduled_date'];
        if (isset($data['scheduled_time'])) {
            $scheduledDate .= ' ' . $data['scheduled_time'] . ':00';
        }

        // Calculate Price based on advanced rules
        $price = 0;
        if (isset($providerService->pricing_type) && $providerService->pricing_type === 'hourly') {
            $effectiveHours = max($data['quantity'], (int) ($providerService->min_hours ?? 1));
            $price = ($providerService->base_price * $effectiveHours);
        } else {
            $price = ($providerService->base_price * $data['quantity']);
        }

        // Handle Promo Code
        $promoCode = null;
        $discountAmount = 0;
        if (isset($data['promo_code'])) {
            $promoCode = \App\Models\PromoCode::where('code', $data['promo_code'])->first();
            if ($promoCode && $promoCode->isValid($price)) {
                $discountAmount = $promoCode->calculateDiscount($price);
                $price = max(0, $price - $discountAmount);
            }
        }

        $booking = Booking::create([
            'customer_id' => $user->id,
            'provider_id' => $data['provider_id'],
            'service_id' => $data['service_id'],
            'booking_number' => 'BK-' . strtoupper(Str::random(8)),
            'scheduled_date' => $scheduledDate,
            'status' => 'pending',
            'payment_status' => 'pending',
            'address_id' => $addressId,
            'description' => $data['description'] ?? null,
            'service_type' => $data['service_type'],
            'quantity' => $data['quantity'],
            'quantity_label' => $data['quantity_label'] ?? null,
            'estimated_price' => $price,
            'promo_code_id' => $promoCode?->id,
            'discount_amount' => $discountAmount,
        ]);

        // Increment Promo Code Usage
        if ($promoCode) {
            $promoCode->increment('used_count');
        }

        // Handle Images
        if ($images) {
            foreach ($images as $image) {
                $booking->addMedia($image)->toMediaCollection('issue_images');
            }
        }

        // Notify Provider
        if (isset($booking->provider->user)) {
             $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
        }

        // Notify Customer (Confirmation)
        $user->notify(new \App\Notifications\BookingStatusUpdated($booking));

        return $booking;
    }

    /**
     * Update Booking Status safely and notify relevant parties.
     */
    public function updateBookingStatus(Booking $booking, User $user, string $status): Booking
    {
        // Authorization check logic mapped to the service layer natively
        if ($user->id !== $booking->provider_id && $user->id !== $booking->customer_id) {
            abort(403, 'Unauthorized action.');
        }

        // Customer can only cancel
        if ($user->id === $booking->customer_id && $status !== 'cancelled') {
            abort(403, 'Customers can only cancel bookings.');
        }

        $booking->update([
            'status' => $status,
        ]);

        // Notify the OTHER party
        if ($user->id === $booking->provider_id && $booking->customer) {
            $booking->customer->notify(new \App\Notifications\BookingStatusUpdated($booking));
        } elseif ($user->id === $booking->customer_id && isset($booking->provider->user)) {
            $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
        }

        return $booking;
    }
}
