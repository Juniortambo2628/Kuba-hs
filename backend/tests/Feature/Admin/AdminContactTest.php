<?php

use App\Models\ContactMessage;

test('admin can manage contact messages', function () {
    $admin = createAdmin();
    $message = ContactMessage::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/contact')->assertOk();

    // Show
    $this->actingAs($admin)->getJson("/api/admin/contact/{$message->id}")->assertOk();

    // Update Status
    $this->actingAs($admin)->patchJson("/api/admin/contact/{$message->id}/status", [
        'status' => 'replied'
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/contact/{$message->id}")->assertOk();
});
