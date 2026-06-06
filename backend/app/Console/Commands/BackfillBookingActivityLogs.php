<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Services\BookingActivityLogService;
use Illuminate\Console\Command;

class BackfillBookingActivityLogs extends Command
{
    protected $signature = 'bookings:backfill-activity {--force : Re-log even if entries exist}';

    protected $description = 'Create initial activity log entries for bookings missing history';

    public function handle(BookingActivityLogService $logger): int
    {
        $query = Booking::query()->with('customer');

        if (!$this->option('force')) {
            $query->whereDoesntHave('activityLogs');
        }

        $count = 0;

        $query->orderBy('created_at')->chunkById(100, function ($bookings) use ($logger, &$count) {
            foreach ($bookings as $booking) {
                $logger->log(
                    $booking,
                    'created',
                    $booking->customer,
                    'Booking created (backfill)',
                    [
                        'status' => $booking->status,
                        'booking_number' => $booking->booking_number,
                        'backfill' => true,
                    ]
                );
                $count++;
            }
        });

        $this->info("Backfilled {$count} booking activity log(s).");

        return self::SUCCESS;
    }
}
