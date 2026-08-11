<?php

namespace Database\Factories;

use App\Models\Provider;
use App\Models\ProviderAvailability;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderAvailabilityFactory extends Factory
{
    protected $model = ProviderAvailability::class;

    public function definition(): array
    {
        return [
            'provider_id' => Provider::factory(),
            'day_of_week' => fake()->numberBetween(0, 6),
            'start_time' => '08:00',
            'end_time' => '17:00',
            'is_available' => true,
        ];
    }
}
