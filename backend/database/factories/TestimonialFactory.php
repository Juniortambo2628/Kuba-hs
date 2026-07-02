<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Testimonial;

class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        return [
            'client_name' => fake()->name(),
            'client_role' => fake()->randomElement(['Homeowner', 'Business Owner', 'Property Manager', 'Tenant']),
            'content' => fake()->paragraph(),
            'rating' => fake()->numberBetween(4, 5),
            'image_url' => fake()->optional(0.5)->imageUrl(200, 200),
            'is_active' => true,
            'order' => fake()->numberBetween(1, 20),
        ];
    }
}
