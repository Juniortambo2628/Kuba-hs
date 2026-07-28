<?php

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Provider;
use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceCategory;

describe('chat API', function () {
    beforeEach(function () {
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->providerUser = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->providerUser->id]);
        $this->category = ServiceCategory::factory()->create();
        $this->service = Service::factory()->create(['category_id' => $this->category->id]);
        $this->booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);
        $this->conversation = Conversation::create([
            'booking_id' => $this->booking->id,
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
        ]);
    });

    it('returns conversations for customer', function () {
        $response = $this->actingAs($this->customer)
            ->getJson('/api/chat/conversations');

        $response->assertOk();
        $response->assertJsonStructure([
            'conversations' => [
                '*' => ['id', 'booking_id', 'customer_id', 'provider_id'],
            ],
        ]);
    });

    it('returns conversations for provider', function () {
        $response = $this->actingAs($this->providerUser)
            ->getJson('/api/chat/conversations');

        $response->assertOk();
    });

    it('returns a specific conversation', function () {
        $response = $this->actingAs($this->customer)
            ->getJson("/api/chat/conversations/{$this->conversation->id}");

        $response->assertOk();
        $response->assertJson([
            'conversation' => ['id' => $this->conversation->id],
        ]);
    });

    it('prevents unauthorized user from accessing conversation', function () {
        $unauthorized = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($unauthorized)
            ->getJson("/api/chat/conversations/{$this->conversation->id}");

        $response->assertForbidden();
    });

    it('returns 404 for non-existent conversation', function () {
        $response = $this->actingAs($this->customer)
            ->getJson('/api/chat/conversations/non-existent-id');

        $response->assertNotFound();
    });

    it('sends a message in a conversation', function () {
        $response = $this->actingAs($this->customer)
            ->postJson("/api/chat/conversations/{$this->conversation->id}/messages", [
                'body' => 'Hello, when will you arrive?',
            ]);

        $response->assertOk();
        expect(Message::where('conversation_id', $this->conversation->id)->count())->toBe(1);
    });

    it('validates message body is required', function () {
        $response = $this->actingAs($this->customer)
            ->postJson("/api/chat/conversations/{$this->conversation->id}/messages", [
                'body' => '',
            ]);

        $response->assertStatus(422);
    });

    it('validates message body max length', function () {
        $response = $this->actingAs($this->customer)
            ->postJson("/api/chat/conversations/{$this->conversation->id}/messages", [
                'body' => str_repeat('a', 5001),
            ]);

        $response->assertStatus(422);
    });

    it('prevents unauthorized user from sending message', function () {
        $unauthorized = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($unauthorized)
            ->postJson("/api/chat/conversations/{$this->conversation->id}/messages", [
                'body' => 'Intrusion attempt',
            ]);

        $response->assertForbidden();
    });

    it('marks messages as read', function () {
        $sender = $this->providerUser;
        Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $sender->id,
            'body' => 'Provider message',
            'type' => 'text',
            'read_at' => null,
        ]);

        $response = $this->actingAs($this->customer)
            ->patchJson("/api/chat/conversations/{$this->conversation->id}/read");

        $response->assertOk();
        $msg = Message::where('conversation_id', $this->conversation->id)
            ->where('sender_id', $sender->id)
            ->first();
        expect($msg->read_at)->not->toBeNull();
    });

    it('creates a conversation for a booking', function () {
        $newBooking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($this->customer)
            ->postJson("/api/chat/bookings/{$newBooking->id}/conversation");

        $response->assertOk();
        expect(Conversation::where('booking_id', $newBooking->id)->count())->toBe(1);
    });

    it('prevents unauthorized user from creating conversation', function () {
        $unauthorized = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($unauthorized)
            ->postJson("/api/chat/bookings/{$this->booking->id}/conversation");

        $response->assertForbidden();
    });
});
