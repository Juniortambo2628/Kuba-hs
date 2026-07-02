<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ServiceCategory;

class ServiceCategoryFactory extends Factory
{
    protected $model = ServiceCategory::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'type' => fake()->randomElement(['residential', 'commercial']),
            'description' => fake()->sentence(),
            'icon_url' => fake()->imageUrl(64, 64),
            'image_url' => fake()->imageUrl(400, 300),
            'sort_order' => fake()->numberBetween(1, 50),
        ];
    }
}
