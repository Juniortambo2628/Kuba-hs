<?php

namespace Database\Factories;

use App\Models\Provider;
use App\Models\ProviderScheduleException;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderScheduleExceptionFactory extends Factory
{
    protected $model = ProviderScheduleException::class;

    public function definition(): array
    {
        return [
            'provider_id' => Provider::factory(),
            'date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '17:00',
            'is_closed' => fake()->boolean(),
            'reason' => fake()->sentence(),
        ];
    }
}
