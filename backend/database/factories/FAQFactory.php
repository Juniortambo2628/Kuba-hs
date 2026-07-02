<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\FAQ;

class FAQFactory extends Factory
{
    protected $model = FAQ::class;

    public function definition(): array
    {
        return [
            'question' => fake()->unique()->sentence(),
            'answer' => fake()->paragraph(),
            'avatar' => null,
            'category' => fake()->randomElement(['general', 'booking', 'payment', 'provider']),
            'is_active' => true,
            'order' => fake()->numberBetween(1, 50),
        ];
    }
}
