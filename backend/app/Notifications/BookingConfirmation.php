<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BookingConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];
        // Enable mail if not in local log mode
        if (config('mail.default') !== 'log' && config('mail.default') !== 'array') {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): \App\Mail\DynamicMail
    {
        if ($notifiable instanceof \App\Models\User && $notifiable->unsubscribed_from_emails) {
            return (new \App\Mail\DynamicMail('empty'))->to($notifiable->email);
        }

        return new \App\Mail\DynamicMail('booking_confirmation_customer', [
            'customer_name' => $this->booking->customer->first_name ?? $notifiable->name,
            'booking_number' => $this->booking->booking_number,
            'service_name' => $this->booking->service->name,
            'scheduled_date' => $this->booking->scheduled_date->format('M d, Y'),
            'scheduled_time' => $this->booking->scheduled_time ?? 'TBD',
            'amount' => '$'.number_format((float) $this->booking->estimated_price, 2),
            'dashboard_url' => url('/dashboard/client/bookings/'.$this->booking->id),
        ], $notifiable);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_confirmation',
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'title' => 'Booking Confirmed',
            'message' => "Your booking #{$this->booking->booking_number} for {$this->booking->service->name} has been received.",
            'url' => url('/dashboard/client/bookings/'.$this->booking->id),
        ];
    }
}
