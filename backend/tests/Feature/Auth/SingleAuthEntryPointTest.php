<?php

test('the fortify two-factor challenge route is gone', function () {
    $this->post('/two-factor-challenge', ['code' => '123456'])->assertNotFound();
    $this->get('/two-factor-challenge')->assertNotFound();

    $this->post('/user/two-factor-authentication')->assertNotFound();
    $this->delete('/user/two-factor-authentication')->assertNotFound();
    $this->get('/user/two-factor-qr-code')->assertNotFound();
    $this->get('/user/two-factor-secret-key')->assertNotFound();
    $this->get('/user/two-factor-recovery-codes')->assertNotFound();
});

test('the api two-factor challenge still answers', function () {
    $this->postJson('/api/auth/two-factor/challenge', ['code' => '123456'])
        ->assertStatus(422);
});

test('there is only one endpoint for each session action', function () {
    // 405, not 404: routes/auth.php still owns these URIs for GET (the
    // redirect to the frontend), so only the method is missing - which is
    // the point, nothing in the repo posts to them.
    $this->post('/login', [])->assertStatus(405);
    $this->post('/register', [])->assertStatus(405);
    $this->post('/forgot-password', [])->assertStatus(405);

    $this->post('/logout')->assertNotFound();
    $this->post('/reset-password', [])->assertNotFound();
    $this->put('/user/password', [])->assertNotFound();
    $this->put('/user/profile-information', [])->assertNotFound();
    $this->post('/user/confirm-password', [])->assertNotFound();
    $this->get('/user/confirmed-password-status')->assertNotFound();
});

test('the get entry points still redirect to the frontend', function () {
    $frontend = config('app.frontend_url');

    $this->get('/login')->assertRedirect($frontend . '/login');
    $this->get('/register')->assertRedirect($frontend . '/register/provider');
    $this->get('/forgot-password')->assertRedirect($frontend . '/forgot-password');
});
