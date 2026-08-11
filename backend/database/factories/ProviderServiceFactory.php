<?php

namespace Database\Factories;

use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderServiceFactory extends Factory
{
    protected $model = ProviderService::class;

    public function definition(): array
    {
        return [
            'provider_id' => Provider::factory(),
            'service_id' => Service::factory(),
            'base_price' => fake()->randomFloat(2, 500, 5000),
            'pricing_type' => fake()->randomElement(['fixed', 'hourly']),
            'min_hours' => fake()->numberBetween(1, 4),
            'travel_fee' => fake()->randomFloat(2, 0, 1000),
            'equipment_included' => fake()->boolean(),
            'extra_configs' => [],
            'is_available' => true,
        ];
    }
}
