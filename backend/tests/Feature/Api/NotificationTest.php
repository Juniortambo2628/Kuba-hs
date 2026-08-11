<?php

use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

test('user can list notifications', function () {
    $user = createCustomer();
    
    DatabaseNotification::insert([
        'id' => Str::uuid(),
        'type' => 'App\Notifications\BookingConfirmed',
        'notifiable_type' => 'App\Models\User',
        'notifiable_id' => $user->id,
        'data' => json_encode(['message' => 'Booking Confirmed']),
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($user)->getJson('/api/notifications');

    $response->assertOk()
        ->assertJsonStructure(['data' => [['id', 'data', 'read_at']]]);
});

test('user can mark notification as read', function () {
    $user = createCustomer();
    $notifId = Str::uuid();

    DatabaseNotification::insert([
        'id' => $notifId,
        'type' => 'App\Notifications\BookingConfirmed',
        'notifiable_type' => 'App\Models\User',
        'notifiable_id' => $user->id,
        'data' => json_encode(['message' => 'Booking Confirmed']),
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($user)->postJson("/api/notifications/{$notifId}/read");

    $response->assertOk();
    $this->assertDatabaseHas('notifications', [
        'id' => $notifId,
    ]);
    
    // Check that read_at is not null
    $this->assertNotNull(DatabaseNotification::find($notifId)->read_at);
});

test('user can mark all notifications as read', function () {
    $user = createCustomer();
    
    DatabaseNotification::insert([
        ['id' => Str::uuid(), 'type' => 'Test', 'notifiable_type' => 'App\Models\User', 'notifiable_id' => $user->id, 'data' => '{}', 'read_at' => null, 'created_at' => now(), 'updated_at' => now()],
        ['id' => Str::uuid(), 'type' => 'Test', 'notifiable_type' => 'App\Models\User', 'notifiable_id' => $user->id, 'data' => '{}', 'read_at' => null, 'created_at' => now(), 'updated_at' => now()],
    ]);

    $response = $this->actingAs($user)->postJson('/api/notifications/read-all');

    $response->assertOk();
    
    $unreadCount = DatabaseNotification::where('notifiable_id', $user->id)->whereNull('read_at')->count();
    $this->assertEquals(0, $unreadCount);
});
