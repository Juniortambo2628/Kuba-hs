<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Booking;
use App\Models\User;
use App\Models\Provider;
use App\Models\Service;
use App\Models\Address;
use App\Enums\BookingStatus;
use App\Enums\BookingPaymentStatus;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'provider_id' => Provider::factory(),
            'service_id' => \App\Models\Service::factory(),
            'booking_number' => 'BK-' . strtoupper(fake()->unique()->bothify('????????')),
            'scheduled_date' => fake()->dateTimeBetween('+1 week', '+1 month'),
            'scheduled_time' => fake()->time('H:i'),
            'status' => BookingStatus::Pending,
            'address_id' => Address::factory(),
            'description' => fake()->sentence(),
            'service_type' => fake()->randomElement(['residential', 'commercial']),
            'quantity' => fake()->numberBetween(1, 5),
            'estimated_price' => fake()->randomFloat(2, 500, 50000),
            'final_price' => null,
            'payment_status' => BookingPaymentStatus::Pending,
            'payment_method' => null,
        ];
    }
}
