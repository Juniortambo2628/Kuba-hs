<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    /** System templates seeded by EmailTemplateSeeder — cannot be deleted */
    private const PROTECTED_KEYS = [
        'booking_confirmation_customer',
        'booking_confirmation_provider',
        'booking_status_updated_customer',
        'booking_status_updated_provider',
        'payment_received_customer',
        'new_review_received_provider',
        'new_booking_request_provider',
        'investor_inquiry_admin_alert',
        'passkey_created',
        'sign_in_log',
    ];

    /** All available template keys used by the notification system */
    private const AVAILABLE_TEMPLATE_KEYS = [
        ['key' => 'booking_confirmation_customer', 'label' => 'Booking Confirmation (Customer)', 'description' => 'Sent when a customer creates a booking'],
        ['key' => 'booking_confirmation_provider', 'label' => 'Booking Confirmation (Provider)', 'description' => 'Sent when a provider receives a new booking'],
        ['key' => 'booking_status_updated_customer', 'label' => 'Status Update (Customer)', 'description' => 'Sent when a booking status changes for the customer'],
        ['key' => 'booking_status_updated_provider', 'label' => 'Status Update (Provider)', 'description' => 'Sent when a booking status changes for the provider'],
        ['key' => 'payment_received_customer', 'label' => 'Payment Receipt (Customer)', 'description' => 'Sent after a successful payment'],
        ['key' => 'new_review_received_provider', 'label' => 'New Review (Provider)', 'description' => 'Sent when a provider receives a new review'],
        ['key' => 'investor_inquiry_admin_alert', 'label' => 'Investor Inquiry (Admin)', 'description' => 'Admin alert for new investor inquiries'],
        ['key' => 'passkey_created', 'label' => 'Passkey Created', 'description' => 'Sent when a new passkey is added to an account'],
        ['key' => 'sign_in_log', 'label' => 'Sign-In Log', 'description' => 'Sent when a new sign-in is detected'],
    ];

    public function index() {
        return response()->json(EmailTemplate::orderBy('name')->get());
    }

    public function availableKeys() {
        $existingKeys = EmailTemplate::pluck('key')->toArray();
        $keys = collect(self::AVAILABLE_TEMPLATE_KEYS)->map(function ($item) use ($existingKeys) {
            $item['exists'] = in_array($item['key'], $existingKeys, true);
            return $item;
        });
        return response()->json($keys);
    }

    public function show(EmailTemplate $emailTemplate) {
        return response()->json($emailTemplate);
    }

    public function update(Request $request, EmailTemplate $emailTemplate) {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $emailTemplate->update($validated);

        return response()->json([
            'message' => 'Email template updated successfully',
            'template' => $emailTemplate,
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:120', 'regex:/^[a-z0-9_]+$/', 'unique:email_templates,key'],
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'variables.*' => 'string|max:80',
        ]);

        $template = EmailTemplate::create([
            'key' => $validated['key'],
            'name' => $validated['name'],
            'subject' => $validated['subject'],
            'body' => $validated['body'],
            'variables' => $validated['variables'] ?? [],
        ]);

        return response()->json([
            'message' => 'Email template created successfully',
            'template' => $template,
        ], 201);
    }

    public function destroy(EmailTemplate $emailTemplate) {
        if (in_array($emailTemplate->key, self::PROTECTED_KEYS, true)) {
            return response()->json([
                'message' => 'This system template cannot be deleted. You may edit its content instead.',
            ], 422);
        }

        $emailTemplate->delete();

        return response()->json([
            'message' => 'Email template deleted successfully',
        ]);
    }
}
