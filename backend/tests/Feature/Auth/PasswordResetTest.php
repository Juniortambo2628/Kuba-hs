<?php

test('reset password link endpoint responds', function () {
    $response = $this->postJson('/api/auth/forgot-password', [
        'email' => 'nonexistent@example.com',
    ]);

    // Controller returns validation error for nonexistent email
    $response->assertStatus(422);
});

test('reset password requires email field', function () {
    $response = $this->postJson('/api/auth/forgot-password', []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});
