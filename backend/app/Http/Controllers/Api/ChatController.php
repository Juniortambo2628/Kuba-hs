<?php

namespace App\Http\Controllers\Api;

use App\Events\ChatMessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * List all conversations for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $conversations = Conversation::where('customer_id', $user->id)
            ->orWhereHas('provider', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['customer', 'provider.user', 'booking.service', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get();
            
        // Add unread count for each conversation
        $conversations->each(function ($conv) use ($user) {
            $conv->unread_count = $conv->unreadCountFor($user->id);
        });

        return response()->json(['conversations' => $conversations]);
    }

    /**
     * Get or create a conversation for a booking.
     */
    public function getConversation(Request $request, $id)
    {
        $user = $request->user();
        
        $conversation = Conversation::where('id', $id)
            ->orWhere('booking_id', $id)
            ->with(['messages.sender', 'booking.customer', 'booking.provider.user'])
            ->first();

        if (!$conversation) {
            // This shouldn't normally happen if we trigger it from a booking, 
            // but let's be safe.
            return response()->json(['message' => 'Conversation not found'], 404);
        }

        // Authorization check
        if ($user->id !== $conversation->customer_id && ($conversation->provider && $user->id !== $conversation->provider->user_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($conversation);
    }

    /**
     * Create or find a conversation for a booking.
     */
    public function createConversation(Request $request, $bookingId)
    {
        $user = $request->user();
        $booking = Booking::with('provider')->findOrFail($bookingId);

        // Verify the user is either the customer or the provider of this booking
        $isCustomer = $user->id === $booking->customer_id;
        $isProvider = $booking->provider && $user->id === $booking->provider->user_id;

        if (!$isCustomer && !$isProvider) {
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

        return response()->json($conversation->load(['customer', 'provider.user', 'booking.service']));
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(Request $request, $conversationId = null)
    {
        $id = $conversationId ?: $request->conversation_id;

        $request->merge(['conversation_id' => $id]);
        
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body' => 'required|string',
        ]);

        $user = $request->user();
        $conversation = Conversation::findOrFail($id);

        // Authorization check
        if ($user->id !== $conversation->customer_id && ($conversation->provider && $user->id !== $conversation->provider->user_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $request->body,
            'type' => 'text',
        ]);

        $conversation->update(['last_message_at' => now()]);

        // Broadcast the message
        broadcast(new ChatMessageSent($message))->toOthers();

        // Notify the recipient
        $recipientId = ($user->id === $conversation->customer_id) 
            ? ($conversation->provider->user_id ?? null) 
            : $conversation->customer_id;
            
        if ($recipientId) {
            $recipient = \App\Models\User::find($recipientId);
            if ($recipient) {
                $recipient->notify(new \App\Notifications\NewMessageReceived($message));
            }
        }

        return response()->json($message->load('sender'));
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Request $request, $conversationId)
    {
        $user = $request->user();
        
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Messages marked as read']);
    }
}
