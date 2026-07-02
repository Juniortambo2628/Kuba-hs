<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payment;
use App\Models\Booking;
use App\Models\User;
use App\Models\Provider;
use App\Enums\PaymentStatus;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'customer_id' => User::factory(),
            'provider_id' => Provider::factory(),
            'amount' => fake()->randomFloat(2, 500, 50000),
            'platform_fee' => fake()->randomFloat(2, 50, 5000),
            'provider_amount' => fake()->randomFloat(2, 400, 45000),
            'payment_method' => fake()->randomElement(['mpesa', 'paystack']),
            'transaction_id' => fake()->unique()->bothify('??????-??????-??????'),
            'status' => PaymentStatus::Completed,
            'payment_gateway' => fake()->randomElement(['mpesa', 'paystack']),
        ];
    }
}
