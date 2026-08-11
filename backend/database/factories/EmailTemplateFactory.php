<?php

namespace Database\Factories;

use App\Models\EmailTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailTemplateFactory extends Factory
{
    protected $model = EmailTemplate::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(),
            'name' => fake()->words(3, true),
            'subject' => fake()->sentence(),
            'body' => fake()->paragraph(),
            'variables' => ['user_name', 'company_name'],
        ];
    }
}
