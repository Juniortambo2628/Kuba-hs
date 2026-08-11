<?php

namespace Database\Factories;

use App\Models\PromoCode;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromoCodeFactory extends Factory
{
    protected $model = PromoCode::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('PROMO####')),
            'discount_type' => fake()->randomElement(['percentage', 'fixed']),
            'discount_value' => fake()->randomFloat(2, 5, 50),
            'min_booking_amount' => fake()->randomFloat(2, 100, 500),
            'max_discount_amount' => fake()->randomFloat(2, 50, 200),
            'start_date' => fake()->dateTimeBetween('-1 week', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+1 month'),
            'usage_limit' => fake()->numberBetween(10, 100),
            'used_count' => 0,
            'is_active' => true,
        ];
    }
}
