<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DynamicMail extends Mailable
{
    use Queueable, SerializesModels;

    public $content;
    public $templateSubject;

    public function __construct(string $templateKey, array $data = [], ?\App\Models\User $user = null)
    {
        if ($templateKey === 'empty') {
            $this->templateSubject = 'Notification';
            $this->content = '';
            return;
        }

        $template = \App\Models\EmailTemplate::where('key', $templateKey)->first();
        
        // Global variables for all templates
        $data['app_name'] = 'South Ring';
        $data['logo_url'] = url('/logo.png'); // South Ring logo
        $data['year'] = date('Y');
        
        if ($user) {
            $data['unsubscribe_url'] = route('api.unsubscribe', ['email' => $user->email]);
        }

        if ($template) {
            $this->templateSubject = $this->replaceVariables($template->subject, $data);
            $this->content = $this->replaceVariables($template->body, $data);
        } else {
            // Fallback
            $this->templateSubject = 'South Ring Notification';
            $this->content = "This is a notification from South Ring regarding your account.\n\nTrigger: " . str_replace('_', ' ', $templateKey);
        }
    }

    private function replaceVariables($text, $data)
    {
        foreach ($data as $key => $value) {
            $text = str_replace('{{' . $key . '}}', $value, $text);
        }
        return $text;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->templateSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.dynamic',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
