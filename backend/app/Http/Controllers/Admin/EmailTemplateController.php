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
        'investor_inquiry_admin_alert',
    ];

    public function index() {
        return response()->json(EmailTemplate::orderBy('name')->get());
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
