<?php

namespace Database\Factories;

use App\Models\BookingActivityLog;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingActivityLogFactory extends Factory
{
    protected $model = BookingActivityLog::class;

    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'user_id' => User::factory(),
            'action' => fake()->randomElement(['status_updated', 'note_added', 'rescheduled']),
            'description' => fake()->sentence(),
            'metadata' => ['key' => 'value'],
        ];
    }
}
