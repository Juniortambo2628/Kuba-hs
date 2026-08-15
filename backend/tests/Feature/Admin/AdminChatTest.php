<?php

use App\Models\Conversation;
use App\Models\Message;

test('admin can list all conversations', function () {
    $admin = createAdmin();
    $workflow = createBookingWorkflow();
    Conversation::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'customer_id' => $workflow['customer']->id,
        'provider_id' => $workflow['provider']->id,
    ]);

    $response = $this->actingAs($admin)->getJson('/api/admin/chat/conversations');

    $response->assertOk();
});

test('admin can view conversation', function () {
    $admin = createAdmin();
    $workflow = createBookingWorkflow();
    $conversation = Conversation::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'customer_id' => $workflow['customer']->id,
        'provider_id' => $workflow['provider']->id,
    ]);

    $response = $this->actingAs($admin)->getJson("/api/admin/chat/conversations/{$conversation->id}");

    $response->assertOk();
});

test('admin can delete inappropriate message', function () {
    $admin = createAdmin();
    $workflow = createBookingWorkflow();
    $conversation = Conversation::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'customer_id' => $workflow['customer']->id,
        'provider_id' => $workflow['provider']->id,
    ]);
    
    $message = Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $workflow['customer']->id,
        'body' => 'Inappropriate content',
    ]);

    $response = $this->actingAs($admin)->deleteJson("/api/admin/chat/messages/{$message->id}");

    $response->assertOk();
    $this->assertSoftDeleted('messages', [
        'id' => $message->id
    ]);
});
