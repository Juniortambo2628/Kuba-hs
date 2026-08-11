<?php

use App\Models\ContactMessage;

test('admin can manage contact messages', function () {
    $admin = createAdmin();
    $message = ContactMessage::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/contacts')->assertOk();

    // Show
    $this->actingAs($admin)->getJson("/api/admin/contacts/{$message->id}")->assertOk();

    // Update Status
    $this->actingAs($admin)->patchJson("/api/admin/contacts/{$message->id}/status", [
        'status' => 'resolved'
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/contacts/{$message->id}")->assertOk();
});
