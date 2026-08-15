<?php

namespace App\Notifications;

use App\Mail\DynamicMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SignInLog extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ?string $ip = null,
        public ?string $user_agent = null,
        public ?\Illuminate\Support\Carbon $timestamp = null,
        public string $method = 'password',
    ) {
    }

    public function via(object $notifiable): array
    {
        $channels = ['database'];

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

        $deviceInfo = $this->parseUserAgent($this->user_agent);

        return new DynamicMail('sign_in_log', [
            'user_name' => $notifiable->name,
            'sign_in_method' => ucfirst($this->method),
            'sign_in_time' => $this->timestamp?->format('M d, Y \a\t g:i A T') ?? now()->format('M d, Y \a\t g:i A T'),
            'ip_address' => $this->ip ?? 'Unknown',
            'device' => $deviceInfo,
            'dashboard_url' => url('/dashboard'),
        ], $notifiable);
    }

    public function toArray(object $notifiable): array
    {
        $deviceInfo = $this->parseUserAgent($this->user_agent);

        return [
            'type' => 'sign_in_log',
            'title' => 'New Sign-In',
            'message' => "Signed in via {$this->method} from {$deviceInfo}",
            'ip_address' => $this->ip,
            'user_agent' => $this->user_agent,
            'method' => $this->method,
            'timestamp' => $this->timestamp?->toISOString(),
            'url' => '/dashboard/settings',
        ];
    }

    private function parseUserAgent(?string $ua): string
    {
        if (!$ua) {
            return 'Unknown device';
        }

        // Simple UA parsing
        if (str_contains($ua, 'iPhone')) {
            return 'iPhone';
        }
        if (str_contains($ua, 'iPad')) {
            return 'iPad';
        }
        if (str_contains($ua, 'Android')) {
            return 'Android device';
        }
        if (str_contains($ua, 'Windows')) {
            return 'Windows PC';
        }
        if (str_contains($ua, 'Macintosh') || str_contains($ua, 'Mac OS')) {
            return 'Mac';
        }
        if (str_contains($ua, 'Linux')) {
            return 'Linux device';
        }

        return 'Unknown device';
    }
}
