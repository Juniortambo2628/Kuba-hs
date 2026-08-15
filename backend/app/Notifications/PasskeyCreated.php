<?php

namespace App\Notifications;

use App\Mail\DynamicMail;
use App\Models\WebauthnCredential;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PasskeyCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public WebauthnCredential $credential)
    {
    }

    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];

        if (config('mail.default') !== 'log' && config('mail.default') !== 'array') {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): DynamicMail
    {
        if ($notifiable instanceof \App\Models\User && $notifiable->unsubscribed_from_emails) {
            return (new DynamicMail('empty'))->to($notifiable->email);
        }

        return new DynamicMail('passkey_created', [
            'user_name' => $notifiable->name,
            'passkey_name' => $this->credential->name ?? 'New Passkey',
            'created_at' => $this->credential->created_at->format('M d, Y \a\t g:i A'),
            'dashboard_url' => url('/dashboard'),
        ], $notifiable);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'passkey_created',
            'passkey_id' => $this->credential->id,
            'passkey_name' => $this->credential->name,
            'title' => 'New Passkey Added',
            'message' => "A new passkey \"{$this->credential->name}\" was added to your account.",
            'url' => '/dashboard/settings',
        ];
    }
}
