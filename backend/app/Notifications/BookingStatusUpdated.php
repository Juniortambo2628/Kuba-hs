<?php

namespace App\Notifications;

use App\Enums\UserRole;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BookingStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Booking $booking)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];

        if (config('mail.default') !== 'log' && config('mail.default') !== 'array') {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): \App\Mail\DynamicMail
    {
        // Check if user is unsubscribed
        if ($notifiable instanceof \App\Models\User && $notifiable->unsubscribed_from_emails) {
            return (new \App\Mail\DynamicMail('empty')) // This is a bit hacky, but better to handle in DynamicMail or Mailer
                ->to($notifiable->email);
        }

        $templateKey = $notifiable->role === UserRole::Provider ? 'booking_status_updated_provider' : 'booking_status_updated_customer';

        return new \App\Mail\DynamicMail($templateKey, [
            'customer_name' => $this->booking->customer->name,
            'provider_name' => $this->booking->provider->user->name,
            'booking_number' => $this->booking->booking_number,
            'service_name' => $this->booking->service->name,
            'status' => strtoupper($this->booking->status),
            'dashboard_url' => url('/dashboard'),
        ], $notifiable);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $dashboardRole = $notifiable->role === UserRole::Provider ? 'provider' : 'client';

        return [
            'type' => 'booking_status',
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'status' => $this->booking->status,
            'title' => 'Booking Update',
            'message' => "Booking #{$this->booking->booking_number} status updated to {$this->booking->status->value}",
            'url' => "/dashboard/{$dashboardRole}/bookings/{$this->booking->id}",
        ];
    }
}
