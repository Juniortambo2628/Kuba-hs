<?php

test('email verification is not a web route', function () {
    // This SPA handles email verification differently
    $response = $this->get('/verify-email');

    // Expect redirect since this is an API-only backend
    $response->assertStatus(302);
});
