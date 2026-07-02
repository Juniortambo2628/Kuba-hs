<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminChatController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Conversation::with(['customer', 'provider.user', 'booking.service', 'latestMessage'])
            ->orderByDesc('last_message_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', function ($sq) use ($search) {
                    $sq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('provider', function ($sq) use ($search) {
                    $sq->where('business_name', 'like', "%{$search}%");
                })->orWhereHas('booking', function ($sq) use ($search) {
                    $sq->where('booking_number', 'like', "%{$search}%");
                });
            });
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Conversation $conversation): JsonResponse
    {
        return response()->json([
            'data' => $conversation->load([
                'messages.sender',
                'customer',
                'provider.user',
                'booking.service',
            ]),
        ]);
    }

    public function destroyMessage(Message $message): JsonResponse
    {
        $message->delete();

        return response()->json(['message' => 'Message removed from conversation.']);
    }
}
