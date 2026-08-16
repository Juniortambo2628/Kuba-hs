<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\DynamicMail;
use App\Models\EmailTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailTestController extends Controller
{
    /**
     * Send a test email to verify email configuration.
     */
    public function sendTest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'template_key' => 'nullable|string|max:120',
            'variables' => 'nullable|array',
            'subject' => 'nullable|string|max:255',
            'body' => 'nullable|string',
        ]);

        $email = $validated['email'];
        $templateKey = $validated['template_key'] ?? null;
        $variables = $validated['variables'] ?? [];

        try {
            if ($templateKey) {
                // Send using an existing template
                $template = EmailTemplate::where('key', $templateKey)->first();

                if (!$template) {
                    return response()->json([
                        'success' => false,
                        'message' => "Template '{$templateKey}' not found.",
                    ], 422);
                }

                // Add default test variables
                $testData = array_merge([
                    'name' => 'Test User',
                    'email' => $email,
                    'booking_id' => 'TEST-001',
                    'service_name' => 'Test Service',
                    'provider_name' => 'Test Provider',
                    'amount' => '0.00',
                    'status' => 'pending',
                    'date' => now()->format('M d, Y'),
                    'time' => now()->format('h:i A'),
                    'code' => '000000',
                    'otp' => '123456',
                    'url' => url('/'),
                ], $variables);

                Mail::to($email)->send(new DynamicMail($templateKey, $testData));
            } else {
                // Send a plain test email
                $subject = $validated['subject'] ?? 'Kuba - Test Email';
                $body = $validated['body'] ?? 'This is a test email from Kuba. If you received this, your email configuration is working correctly.';

                Mail::raw($body, function ($message) use ($email, $subject) {
                    $message->to($email)
                        ->subject($subject)
                        ->from(config('mail.from.address'), config('mail.from.name'));
                });
            }

            return response()->json([
                'success' => true,
                'message' => "Test email sent successfully to {$email}",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List available email templates for the test form.
     */
    public function templates(): JsonResponse
    {
        $templates = EmailTemplate::orderBy('name')
            ->select('key', 'name', 'subject', 'variables')
            ->get();

        return response()->json($templates);
    }
}
