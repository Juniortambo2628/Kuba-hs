<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Booking;
use App\Models\ProviderService;
use App\Models\User;
use Illuminate\Support\Str;

class BookingService
{
    /**
     * Create a new booking transaction, handling address creation,
     * price calculation, media attachment, and notifications.
     *
     * @param  array{status?: string, actor?: User, location_name?: string, images?: mixed}  $options
     */
    public function createBooking(User $user, array $data, array $options = []): Booking
    {
        $status = $options['status'] ?? 'pending';
        $actor = $options['actor'] ?? $user;

        // Handle Address
        $addressId = $data['address_id'] ?? null;
        if (! $addressId && isset($data['new_address'])) {
            $address = Address::create([
                'user_id' => $user->id,
                'address_type' => $this->resolveAddressType($data['service_type']),
                'street_address' => $data['new_address']['street_address'],
                'city' => $data['new_address']['city'],
                'state' => $data['new_address']['state'],
                'postal_code' => $data['new_address']['postal_code'],
                'country' => 'Kenya',
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
        if (! empty($data['scheduled_time'])) {
            $scheduledDate .= ' '.$data['scheduled_time'].':00';
        }

        // Calculate Price based on advanced rules
        $price = 0;
        if (isset($providerService->pricing_type) && $providerService->pricing_type === 'hourly') {
            $effectiveHours = max($data['quantity'], (int) ($providerService->min_hours ?? 1));
            $price = $providerService->base_price * $effectiveHours;
        } else {
            $price = $providerService->base_price * $data['quantity'];
        }

        // Handle Promo Code
        $promoCode = null;
        $discountAmount = 0;
        if (! empty($data['promo_code'])) {
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
            'booking_number' => 'BK-'.strtoupper(Str::random(8)),
            'scheduled_date' => $scheduledDate,
            'scheduled_time' => $data['scheduled_time'] ?? null,
            'status' => $status,
            'payment_status' => 'pending',
            'address_id' => $addressId,
            'location_name' => $data['location_name'] ?? null,
            'description' => $data['description'] ?? null,
            'service_type' => $data['service_type'],
            'quantity' => $data['quantity'],
            'quantity_label' => $data['quantity_label'] ?? null,
            'estimated_price' => $price,
            'promo_code_id' => $promoCode?->id,
            'discount_amount' => $discountAmount,
        ]);

        // Create conversation for chat
        \App\Models\Conversation::create([
            'booking_id' => $booking->id,
            'customer_id' => $booking->customer_id,
            'provider_id' => $booking->provider_id,
        ]);

        // Increment Promo Code Usage
        if ($promoCode) {
            $promoCode->increment('used_count');
        }

        // Handle Images
        if (! empty($options['images'])) {
            $optimizer = app(\App\Services\ImageOptimizationService::class);
            foreach ($options['images'] as $image) {
                $media = $booking->addMedia($image)->toMediaCollection('issue_images');
                $optimizer->optimizeMedia($media, \App\Services\ImageOptimizationService::PRESET_BOOKING);
            }
        }

        // Eager load relations for notifications
        $booking->load(['customer', 'provider.user', 'service']);

        // Notify Provider
        if (isset($booking->provider->user)) {
            $booking->provider->user->notify(new \App\Notifications\NewBookingReceived($booking));
        }

        // Notify Customer
        $user->notify(new \App\Notifications\BookingConfirmation($booking));

        app(BookingActivityLogService::class)->log(
            $booking,
            'created',
            $actor,
            $actor->id === $user->id ? 'Booking created' : 'Booking created by administrator',
            ['status' => $status, 'booking_number' => $booking->booking_number]
        );

        return $booking;
    }

    /**
     * Create a booking on behalf of a customer (admin operations).
     */
    public function createAdminBooking(User $customer, array $data, string $status = 'pending'): Booking
    {
        return $this->createBooking($customer, $data, [
            'status' => $status,
            'actor' => auth()->user(),
        ]);
    }

    /**
     * Update Booking Status safely and notify relevant parties.
     */
    public function updateBookingStatus(Booking $booking, User $user, string $status, string $cancellationReason = null): Booking
    {
        $isProvider = $user->role === UserRole::Provider
            && $user->provider
            && $user->provider->id === $booking->provider_id;
        $isCustomer = $user->id === $booking->customer_id;

        if (! $isProvider && ! $isCustomer && $user->role !== UserRole::Admin) {
            abort(403, 'Unauthorized action.');
        }

        if ($isCustomer && $status !== 'cancelled') {
            abort(403, 'Customers can only cancel bookings.');
        }

        $previousStatus = is_string($booking->status) ? $booking->status : $booking->status->value;
        $updateData = ['status' => $status];

        if ($cancellationReason) {
            $updateData['cancellation_reason'] = $cancellationReason;
        }

        // Record started_at when service begins
        if ($status === 'in_progress' && ! $booking->started_at) {
            $updateData['started_at'] = now();
        }

        // Record completed_at and calculate final price when service finishes
        if ($status === 'completed') {
            $updateData['completed_at'] = now();

            if ($booking->started_at) {
                $providerService = ProviderService::where('provider_id', $booking->provider_id)
                    ->where('service_id', $booking->service_id)
                    ->first();

                if ($providerService && $providerService->pricing_type === 'hourly') {
                    $elapsedSeconds = $booking->started_at->diffInSeconds(now());
                    $elapsedHours = max(1, ceil($elapsedSeconds / 3600));
                    $updateData['final_price'] = $providerService->base_price * $elapsedHours;
                } else {
                    $updateData['final_price'] = $booking->estimated_price;
                }
            }
        }

        $booking->update($updateData);

        if ($previousStatus !== $status) {
            app(BookingActivityLogService::class)->logStatusChange($booking, $user, $previousStatus, $status);
        }

        // Dispatch the legacy event for backward compatibility (real-time updates in dashboard layout)
        event(new \App\Events\BookingStatusUpdated($booking));

        // Notify the OTHER party with a persisted database notification
        if ($user->id === $booking->provider_id && $booking->customer) {
            $booking->customer->notify(new \App\Notifications\BookingStatusUpdated($booking));
        } elseif ($user->id === $booking->customer_id && isset($booking->provider->user)) {
            $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
        }

        return $booking;
    }

    /**
     * Map booking form "service_type" option ids to address classification.
     */
    private function resolveAddressType(string $serviceType): string
    {
        $businessTypes = [
            'commercial',
            'large_scale',
            'office',
            'retail',
            'industrial',
            'delivery',
            'security',
            'operation',
            'audit',
            'sacco',
            'consulting',
            'admin',
            'compliance',
            'project',
            'staffing',
            'payroll',
            'recruitment',
            'large_event',
            'litigation',
            'conveyancing',
            'legal_advice',
        ];

        return in_array($serviceType, $businessTypes, true) ? 'business' : 'residential';
    }
}
