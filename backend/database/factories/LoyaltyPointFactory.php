<?php

namespace Database\Factories;

use App\Models\LoyaltyPoint;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoyaltyPointFactory extends Factory
{
    protected $model = LoyaltyPoint::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'points' => fake()->numberBetween(10, 100),
            'description' => fake()->sentence(),
            'transaction_type' => fake()->randomElement(['earned', 'redeemed']),
        ];
    }
}
