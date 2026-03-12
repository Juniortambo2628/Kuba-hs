<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Show all conversations for the authenticated user.
     */
    public function index()
    {
        $user = Auth::user();

        $conversations = Conversation::where('customer_id', $user->id)
            ->orWhereHas('provider', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with([
                'booking.service',
                'customer:id,first_name,last_name',
                'provider.user:id,first_name,last_name',
                'latestMessage',
            ])
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function (Conversation $conversation) use ($user) {
                $conversation->unread_count = $conversation->unreadCountFor($user->id);
                return $conversation;
            });

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Show a specific conversation and its messages.
     */
    public function show(Conversation $conversation)
    {
        $user = Auth::user();
        $this->authorizeConversation($conversation, $user);

        // Mark messages as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $conversation->load([
            'messages.sender:id,first_name,last_name',
            'booking.service',
            'customer:id,first_name,last_name',
            'provider.user:id,first_name,last_name',
        ]);

        return Inertia::render('Chat/Show', [
            'conversation' => $conversation,
            'currentUserId' => $user->id,
        ]);
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(Request $request, Conversation $conversation)
    {
        $user = Auth::user();
        $this->authorizeConversation($conversation, $user);

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $validated['body'],
            'type' => 'text',
        ]);

        $conversation->update(['last_message_at' => now()]);

        $message->load('sender:id,first_name,last_name');

        // Broadcast for real-time chat (when Reverb/Pusher is configured)
        \App\Events\MessageSent::dispatch($message);

        return response()->json(['message' => $message]);
    }

    /**
     * Fetch new messages since a given timestamp (for polling).
     */
    public function poll(Request $request, Conversation $conversation)
    {
        $user = Auth::user();
        $this->authorizeConversation($conversation, $user);

        $since = $request->query('since', now()->subMinutes(1)->toISOString());

        $messages = $conversation->messages()
            ->where('created_at', '>', $since)
            ->with('sender:id,first_name,last_name')
            ->get();

        // Mark incoming messages as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['messages' => $messages]);
    }

    /**
     * Start or resume a conversation for a booking.
     */
    public function startConversation(Booking $booking)
    {
        $user = Auth::user();

        // Must be customer or provider on this booking
        if ($user->id !== $booking->customer_id) {
            $provider = $user->provider;
            if (!$provider || $provider->id !== $booking->provider_id) {
                abort(403, 'Unauthorized.');
            }
        }

        $conversation = Conversation::firstOrCreate(
            ['booking_id' => $booking->id],
            [
                'customer_id' => $booking->customer_id,
                'provider_id' => $booking->provider_id,
                'last_message_at' => now(),
            ]
        );

        return redirect()->route('chat.show', $conversation->id);
    }

    /**
     * Authorize that the user belongs to this conversation.
     */
    private function authorizeConversation(Conversation $conversation, $user)
    {
        $isCustomer = $user->id === $conversation->customer_id;
        $isProvider = $user->provider && $user->provider->id === $conversation->provider_id;

        if (!$isCustomer && !$isProvider) {
            abort(403, 'You do not have access to this conversation.');
        }
    }
}
