<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public float $amount
    ) {}

    /**
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

    public function toMail(object $notifiable): \App\Mail\DynamicMail
    {
        if ($notifiable instanceof \App\Models\User && $notifiable->unsubscribed_from_emails) {
            return (new \App\Mail\DynamicMail('empty'))->to($notifiable->email);
        }

        return (new \App\Mail\DynamicMail('payment_received_customer', [
            'customer_name' => $this->booking->customer->name,
            'amount' => '$' . number_format($this->amount, 2),
            'booking_number' => $this->booking->booking_number,
            'service_name' => $this->booking->service->name,
            'invoice_url' => url("/invoices/{$this->booking->id}/download"),
        ], $this->booking->customer));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'message' => "Your payment of \$" . number_format($this->amount, 2) . " for Booking #{$this->booking->booking_number} was successful.",
            'url' => route('dashboard'),
        ];
    }
}
