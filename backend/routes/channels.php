<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{id}', function ($user, string $id) {
    $conversation = \App\Models\Conversation::where('id', $id)
        ->orWhere('booking_id', $id)
        ->first();
        
    if (!$conversation) {
        return false;
    }
    
    $isCustomer = (string) $user->id === (string) $conversation->customer_id;
    $isProvider = $user->provider && (string) $user->provider->id === (string) $conversation->provider_id;
    
    return $isCustomer || $isProvider;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (string) $user->id === (string) $id;
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (string) $user->id === (string) $id;
});
