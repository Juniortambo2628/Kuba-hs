<?php

namespace App\Http\Controllers\Api;

use App\Events\ChatMessageSent;
use App\Http\Controllers\Controller;
use App\Http\Resources\ChatConversationResource;
use App\Http\Resources\ChatMessageResource;
use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * List all conversations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->where(function ($query) use ($user) {
                $query->where('customer_id', $user->id)
                    ->orWhereHas('provider', fn ($q) => $q->where('user_id', $user->id));
            })
            ->with(['customer', 'provider.user', 'booking.service', 'latestMessage'])
            ->orderByDesc('last_message_at')
            ->get();

        $conversations->each(function ($conv) use ($user) {
            $conv->unread_count = $conv->unreadCountFor($user->id);
        });

        return response()->json([
            'conversations' => ChatConversationResource::collection($conversations),
        ]);
    }

    /**
     * Get a conversation and its messages (marks unread messages as read).
     */
    public function getConversation(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::query()
            ->where('id', $id)
            ->orWhere('booking_id', $id)
            ->with(['messages.sender', 'customer', 'provider.user', 'booking.service', 'latestMessage'])
            ->first();

        if (! $conversation) {
            return response()->json(['message' => 'Conversation not found'], 404);
        }

        if (! $this->userCanAccessConversation($user->id, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $conversation->load(['messages.sender']);
        $conversation->unread_count = 0;

        return response()->json([
            'conversation' => new ChatConversationResource($conversation),
        ]);
    }

    /**
     * Create or find a conversation for a booking.
     */
    public function createConversation(Request $request, $bookingId): JsonResponse
    {
        $user = $request->user();
        $booking = Booking::with('provider')->findOrFail($bookingId);

        $isCustomer = $user->id === $booking->customer_id;
        $isProvider = $booking->provider && $user->id === $booking->provider->user_id;

        if (! $isCustomer && ! $isProvider) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversation = Conversation::firstOrCreate(
            ['booking_id' => $bookingId],
            [
                'customer_id' => $booking->customer_id,
                'provider_id' => $booking->provider_id,
                'last_message_at' => now(),
            ]
        );

        $conversation->load(['customer', 'provider.user', 'booking.service', 'latestMessage']);

        return response()->json([
            'conversation' => new ChatConversationResource($conversation),
        ]);
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(Request $request, $conversationId = null): JsonResponse
    {
        $id = $conversationId ?: $request->conversation_id;
        $request->merge(['conversation_id' => $id]);

        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body' => 'required|string|max:5000',
        ]);

        $user = $request->user();
        $conversation = Conversation::findOrFail($id);

        if (! $this->userCanAccessConversation($user->id, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $request->body,
            'type' => 'text',
        ]);

        $conversation->update(['last_message_at' => now()]);

        broadcast(new ChatMessageSent($message))->toOthers();

        $recipientId = $user->id === $conversation->customer_id
            ? ($conversation->provider?->user_id)
            : $conversation->customer_id;

        if ($recipientId) {
            $recipient = \App\Models\User::find($recipientId);
            if ($recipient) {
                $recipient->notify(new \App\Notifications\NewMessageReceived($message));
            }
        }

        return response()->json(new ChatMessageResource($message->load('sender')));
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Request $request, $conversationId): JsonResponse
    {
        $user = $request->user();
        $conversation = Conversation::findOrFail($conversationId);

        if (! $this->userCanAccessConversation($user->id, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Messages marked as read']);
    }

    private function userCanAccessConversation(string $userId, Conversation $conversation): bool
    {
        if ($userId === $conversation->customer_id) {
            return true;
        }

        return $conversation->provider && $userId === $conversation->provider->user_id;
    }
}
