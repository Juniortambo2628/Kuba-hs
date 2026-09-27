<?php

namespace Database\Factories;

use App\Models\TrustPartner;
use Illuminate\Database\Eloquent\Factories\Factory;

class TrustPartnerFactory extends Factory
{
    protected $model = TrustPartner::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'image_url' => fake()->filePath(),
            'is_active' => true,
        ];
    }
}
