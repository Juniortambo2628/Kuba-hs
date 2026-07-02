<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payout;
use App\Models\Provider;
use App\Enums\PayoutStatus;

class PayoutFactory extends Factory
{
    protected $model = Payout::class;

    public function definition(): array
    {
        return [
            'provider_id' => Provider::factory(),
            'amount' => fake()->randomFloat(2, 1000, 100000),
            'status' => PayoutStatus::Pending,
            'payment_method' => fake()->randomElement(['mpesa', 'bank_transfer']),
            'payment_details' => ['account' => fake()->numerify('#######')],
            'reference_number' => fake()->optional()->bothify('???-??????-??????'),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
