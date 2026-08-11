<?php

use App\Models\CustomQuote;

test('admin can manage custom quotes', function () {
    $admin = createAdmin();
    $quote = CustomQuote::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/quotes')->assertOk();

    // Show
    $this->actingAs($admin)->getJson("/api/admin/quotes/{$quote->id}")->assertOk();

    // Update Status
    $this->actingAs($admin)->patchJson("/api/admin/quotes/{$quote->id}/status", [
        'status' => 'reviewed'
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/quotes/{$quote->id}")->assertOk();
});
