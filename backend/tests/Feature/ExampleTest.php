<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    // SPA app — root redirects to frontend
    $response->assertStatus(302);
});
