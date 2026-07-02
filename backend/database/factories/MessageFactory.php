<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'sender_id' => User::factory(),
            'body' => fake()->paragraph(),
            'type' => 'text',
            'read_at' => fake()->optional(0.7)->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
