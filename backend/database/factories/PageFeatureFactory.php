<?php

namespace Database\Factories;

use App\Models\PageFeature;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageFeatureFactory extends Factory
{
    protected $model = PageFeature::class;

    public function definition(): array
    {
        return [
            'page_name' => fake()->randomElement(['home', 'about', 'services']),
            'section_name' => fake()->word(),
            'title' => fake()->sentence(),
            'subtitle' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'icon' => 'CheckCircle',
            'image_url' => fake()->imageUrl(),
            'metadata' => [],
            'order_index' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
