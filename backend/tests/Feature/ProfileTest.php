<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user, 'sanctum')
        ->getJson('/api/user');

    $response->assertOk();
});

test('user can be retrieved via API', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user, 'sanctum')
        ->getJson('/api/user');

    $response->assertOk();
    $response->assertJsonFragment(['email' => $user->email]);
});
