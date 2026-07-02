<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Service;
use App\Models\ServiceCategory;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'category_id' => ServiceCategory::factory(),
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->paragraph(),
            'icon_url' => fake()->imageUrl(64, 64),
            'is_active' => true,
            'is_featured' => fake()->boolean(20),
        ];
    }
}
