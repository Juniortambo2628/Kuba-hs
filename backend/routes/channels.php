<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{conversationId}', function ($user, string $conversationId) {
    $conversation = \App\Models\Conversation::find($conversationId);
    if (!$conversation) {
        return false;
    }
    $isCustomer = $user->id === $conversation->customer_id;
    $isProvider = $user->provider && $user->provider->id === $conversation->provider_id;
    return $isCustomer || $isProvider;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (string) $user->id === (string) $id;
});
