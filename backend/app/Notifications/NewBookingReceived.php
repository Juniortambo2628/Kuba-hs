<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewBookingReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];
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

        return new \App\Mail\DynamicMail('new_booking_request_provider', [
            'provider_name' => $notifiable->name,
            'customer_name' => $this->booking->customer->name,
            'service_name' => $this->booking->service->name,
            'booking_number' => $this->booking->booking_number,
            'scheduled_date' => $this->booking->scheduled_date->format('M d, Y'),
            'scheduled_time' => $this->booking->scheduled_time ?? 'TBD',
            'amount' => '$'.number_format((float) $this->booking->estimated_price, 2),
            'dashboard_url' => url('/dashboard/provider/bookings/'.$this->booking->id),
        ], $notifiable);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_booking',
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'title' => 'New Service Request',
            'message' => "{$this->booking->customer->first_name} requested your service: {$this->booking->service->name}",
            'url' => url('/dashboard/provider/bookings/'.$this->booking->id),
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'notification' => $this->toArray($notifiable),
        ]);
    }
}
