<?php

namespace App\Notifications;

use App\Enums\UserRole;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewMessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Message $message) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        // Load relationships if not loaded
        $this->message->loadMissing(['sender', 'conversation.booking.service']);

        $senderName = $this->message->sender->first_name;
        $serviceName = $this->message->conversation->booking->service->name ?? 'Service';
        $dashboardRole = $notifiable->role === UserRole::Provider ? 'provider' : 'client';

        return [
            'type' => 'new_message',
            'conversation_id' => $this->message->conversation_id,
            'title' => 'New Message',
            'message' => "{$senderName} sent you a message regarding {$serviceName}",
            'url' => "/dashboard/{$dashboardRole}/messages",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'notification' => $this->toArray($notifiable),
        ]);
    }
}
