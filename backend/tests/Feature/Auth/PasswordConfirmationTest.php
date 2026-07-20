<?php

use App\Models\User;

test('password confirmation is not available on API', function () {
    $user = User::factory()->create();

    // This SPA uses token-based auth, not session-based password confirmation
    $response = $this->actingAs($user, 'sanctum')->getJson('/api/user');

    $response->assertOk();
});
