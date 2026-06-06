<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingActivityLog;
use App\Models\User;

class BookingActivityLogService
{
    public function log(
        Booking $booking,
        string $action,
        ?User $user = null,
        ?string $description = null,
        array $metadata = []
    ): BookingActivityLog {
        return BookingActivityLog::create([
            'booking_id' => $booking->id,
            'user_id' => $user?->id,
            'action' => $action,
            'description' => $description,
            'metadata' => $metadata ?: null,
        ]);
    }

    public function logStatusChange(Booking $booking, ?User $user, string $from, string $to): BookingActivityLog
    {
        return $this->log(
            $booking,
            'status_changed',
            $user,
            "Status changed from {$from} to {$to}",
            ['from' => $from, 'to' => $to]
        );
    }
}
