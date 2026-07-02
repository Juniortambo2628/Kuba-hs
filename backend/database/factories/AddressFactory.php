<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Address;
use App\Models\User;

class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'address_type' => fake()->randomElement(['home', 'work', 'other']),
            'street_address' => fake()->streetAddress(),
            'apartment' => fake()->optional()->buildingNumber(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'country' => 'Kenya',
            'latitude' => fake()->latitude(-1.5, -1.2),
            'longitude' => fake()->longitude(36.6, 37.0),
            'is_default' => false,
        ];
    }
}
