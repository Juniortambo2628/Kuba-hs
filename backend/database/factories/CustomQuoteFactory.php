<?php

namespace Database\Factories;

use App\Models\CustomQuote;
use App\Enums\CustomQuoteStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomQuoteFactory extends Factory
{
    protected $model = CustomQuote::class;

    public function definition(): array
    {
        return [
            'organization_name' => fake()->company(),
            'contact_person' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'organization_type' => fake()->randomElement(['commercial', 'cooperative']),
            'source' => fake()->url(),
            'service_category' => fake()->word(),
            'estimated_volume' => fake()->numberBetween(10, 100),
            'description' => fake()->paragraph(),
            'status' => CustomQuoteStatus::Pending,
        ];
    }
}
