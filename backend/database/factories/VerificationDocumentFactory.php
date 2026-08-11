<?php

namespace Database\Factories;

use App\Models\VerificationDocument;
use App\Models\Provider;
use App\Enums\VerificationDocumentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class VerificationDocumentFactory extends Factory
{
    protected $model = VerificationDocument::class;

    public function definition(): array
    {
        return [
            'provider_id' => Provider::factory(),
            'document_type' => fake()->randomElement(['id_card', 'business_license', 'insurance']),
            'file_path' => fake()->filePath(),
            'status' => VerificationDocumentStatus::Pending,
            'rejection_reason' => null,
            'expires_at' => fake()->dateTimeBetween('+1 year', '+2 years')->format('Y-m-d'),
        ];
    }
}
