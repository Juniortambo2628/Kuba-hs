<?php

namespace Database\Factories;

use App\Models\InvestorInquiry;
use App\Enums\InvestorInquiryStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvestorInquiryFactory extends Factory
{
    protected $model = InvestorInquiry::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'company' => fake()->company(),
            'investment_range' => fake()->randomElement(['$10k - $50k', '$50k - $100k', '$100k+']),
            'message' => fake()->paragraph(),
            'status' => InvestorInquiryStatus::Pending,
        ];
    }
}
