<?php

use App\Models\InvestorInquiry;

test('admin can manage investor inquiries', function () {
    $admin = createAdmin();
    $inquiry = InvestorInquiry::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/investors')->assertOk();

    // Show
    $this->actingAs($admin)->getJson("/api/admin/investors/{$inquiry->id}")->assertOk();

    // Update Status
    $this->actingAs($admin)->patchJson("/api/admin/investors/{$inquiry->id}/status", [
        'status' => 'reviewed'
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/investors/{$inquiry->id}")->assertOk();
});
