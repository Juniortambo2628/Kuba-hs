<?php

use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $message = new Message;
    expect($message->getFillable())->toContain(
        'conversation_id', 'sender_id', 'body', 'type', 'read_at'
    );
});

it('casts read_at to datetime', function () {
    $message = Message::factory()->create(['read_at' => now()]);
    expect($message->read_at)->toBeInstanceOf(\Carbon\Carbon::class);
});

it('belongs to a conversation', function () {
    $message = Message::factory()->create();
    expect($message->conversation)->not->toBeNull();
});

it('belongs to a sender', function () {
    $message = Message::factory()->create();
    expect($message->sender)->not->toBeNull();
});

it('returns true when message is read', function () {
    $message = Message::factory()->create(['read_at' => now()]);
    expect($message->isRead())->toBeTrue();
});

it('returns false when message is not read', function () {
    $message = Message::factory()->create(['read_at' => null]);
    expect($message->isRead())->toBeFalse();
});

it('uses uuid as primary key', function () {
    $message = Message::factory()->create();
    expect(strlen($message->id))->toBe(36);
});

it('uses soft deletes', function () {
    $message = Message::factory()->create();
    $messageId = $message->id;
    $message->delete();
    expect(Message::withTrashed()->find($messageId))->not->toBeNull();
    expect(Message::find($messageId))->toBeNull();
});
