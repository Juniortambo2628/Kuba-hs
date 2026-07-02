<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContactMessageStatus;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(ContactMessage::latest()->paginate(10));
    }

    public function show(ContactMessage $contactMessage): JsonResponse
    {
        if ($contactMessage->status === ContactMessageStatus::New) {
            $contactMessage->update(['status' => ContactMessageStatus::Read]);
        }

        return response()->json($contactMessage);
    }

    public function updateStatus(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:'.implode(',', array_column(ContactMessageStatus::cases(), 'value')),
        ]);

        $contactMessage->update($validated);

        return response()->json([
            'message' => 'Message status updated.',
            'contactMessage' => $contactMessage,
        ]);
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
