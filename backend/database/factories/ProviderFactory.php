<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Provider;
use App\Models\User;
use App\Enums\ProviderApplicationStatus;
use App\Enums\ProviderAvailabilityStatus;
use App\Enums\ProviderComplianceStatus;

class ProviderFactory extends Factory
{
    protected $model = Provider::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'business_name' => fake()->company(),
            'bio' => fake()->paragraph(),
            'experience_years' => fake()->numberBetween(1, 20),
            'location_name' => fake()->city(),
            'latitude' => fake()->latitude(-1.5, -1.2),
            'longitude' => fake()->longitude(36.6, 37.0),
            'service_radius' => fake()->numberBetween(5, 50),
            'rating_avg' => fake()->randomFloat(1, 3.0, 5.0),
            'review_count' => fake()->numberBetween(0, 200),
            'is_verified' => fake()->boolean(70),
            'application_status' => ProviderApplicationStatus::Approved,
            'availability_status' => ProviderAvailabilityStatus::Available,
            'specialized_skills' => fake()->randomElements(['plumbing', 'electrical', 'cleaning', 'painting', 'carpentry'], 2),
            'quality_score' => fake()->randomFloat(2, 50, 100),
            'compliance_status' => ProviderComplianceStatus::Compliant,
            'balance' => fake()->randomFloat(2, 0, 50000),
            'total_earned' => fake()->randomFloat(2, 10000, 500000),
        ];
    }
}
