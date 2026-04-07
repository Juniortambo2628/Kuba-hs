<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReviewReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Review $review) {}

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

        return (new \App\Mail\DynamicMail('new_review_received_provider', [
            'provider_name' => $this->review->booking->provider->user->name,
            'rating' => $this->review->rating,
            'booking_number' => $this->review->booking->booking_number,
            'reviews_url' => url('/dashboard/reviews'),
            'comment' => $this->review->comment ?? 'No comment provided.',
        ], $notifiable));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'review_id' => $this->review->id,
            'booking_id' => $this->review->booking_id,
            'rating' => $this->review->rating,
            'message' => "You received a new {$this->review->rating}/5 review.",
            'url' => url('/dashboard/reviews'),
        ];
    }
}
