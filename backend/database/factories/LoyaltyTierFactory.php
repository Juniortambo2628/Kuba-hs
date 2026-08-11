<?php

namespace Database\Factories;

use App\Models\LoyaltyTier;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoyaltyTierFactory extends Factory
{
    protected $model = LoyaltyTier::class;

    public function definition(): array
    {
        return [
            'name' => fake()->word() . ' Tier',
            'min_points' => fake()->numberBetween(0, 1000),
            'benefits' => [fake()->sentence(), fake()->sentence()],
            'icon' => 'Star',
            'is_active' => true,
        ];
    }
}
