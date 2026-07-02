<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('user.'.$this->booking->customer_id),
        ];

        if ($this->booking->provider) {
            $channels[] = new PrivateChannel('user.'.$this->booking->provider->user_id);
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'booking.updated';
    }
}
