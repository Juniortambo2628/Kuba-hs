<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Conversation;
use App\Models\Booking;
use App\Models\User;
use App\Models\Provider;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'customer_id' => User::factory(),
            'provider_id' => Provider::factory(),
            'last_message_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
