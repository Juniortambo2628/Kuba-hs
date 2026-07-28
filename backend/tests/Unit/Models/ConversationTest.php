<?php

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $conversation = new Conversation;
    expect($conversation->getFillable())->toContain(
        'booking_id', 'customer_id', 'provider_id', 'last_message_at'
    );
});

it('belongs to a booking', function () {
    $conversation = Conversation::factory()->create();
    expect($conversation->booking)->not->toBeNull();
});

it('belongs to a customer', function () {
    $conversation = Conversation::factory()->create();
    expect($conversation->customer)->not->toBeNull();
});

it('belongs to a provider', function () {
    $conversation = Conversation::factory()->create();
    expect($conversation->provider)->not->toBeNull();
});

it('has messages relationship ordered ascending', function () {
    $conversation = Conversation::factory()->create();
    $sender = \App\Models\User::factory()->create();
    $msg1 = Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $sender->id,
        'body' => 'First message',
        'type' => 'text',
    ]);
    $msg2 = Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $sender->id,
        'body' => 'Second message',
        'type' => 'text',
    ]);
    expect($conversation->messages)->toHaveCount(2);
    expect($conversation->messages->first()->body)->toBe('First message');
});

it('has latestMessage relationship', function () {
    $conversation = Conversation::factory()->create();
    $sender = \App\Models\User::factory()->create();
    Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $sender->id,
        'body' => 'Hello',
        'type' => 'text',
    ]);
    expect($conversation->latestMessage)->not->toBeNull();
    expect($conversation->latestMessage->body)->toBe('Hello');
});

it('counts unread messages for a user', function () {
    $conversation = Conversation::factory()->create();
    $sender = \App\Models\User::factory()->create();
    Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $sender->id,
        'body' => 'Unread message',
        'type' => 'text',
        'read_at' => null,
    ]);
    expect($conversation->unreadCountFor($sender->id))->toBe(0);
    $otherUser = \App\Models\User::factory()->create();
    expect($conversation->unreadCountFor($otherUser->id))->toBe(1);
});

it('uses uuid as primary key', function () {
    $conversation = Conversation::factory()->create();
    expect(strlen($conversation->id))->toBe(36);
});

it('uses soft deletes', function () {
    $conversation = Conversation::factory()->create();
    $conversationId = $conversation->id;
    $conversation->delete();
    expect(Conversation::withTrashed()->find($conversationId))->not->toBeNull();
    expect(Conversation::find($conversationId))->toBeNull();
});
