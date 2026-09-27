<?php

use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;

function createTwoFactorUser(): User
{
    return User::factory()->create([
        'password' => Hash::make('password123'),
        'two_factor_secret' => Crypt::encryptString((new Google2FA())->generateSecretKey()),
        'two_factor_confirmed_at' => now(),
    ]);
}

test('two-factor login parks the session instead of completing it', function () {
    $user = createTwoFactorUser();

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertOk()->assertJsonPath('two_factor_required', true);

    // Auth::attempt has already run by this point, so without the explicit
    // teardown the password alone would be enough to act as the user.
    $this->assertGuest();
    $response->assertSessionHas('2fa_user_id', $user->id);
});

test('the two-factor challenge completes a login the password alone did not', function () {
    $user = createTwoFactorUser();

    $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password123',
    ])->assertJsonPath('two_factor_required', true);

    $code = (new Google2FA())->getCurrentOtp(Crypt::decryptString($user->two_factor_secret));

    $this->postJson('/api/auth/two-factor/challenge', ['code' => $code])
        ->assertOk()
        ->assertJsonPath('user.email', $user->email);
});

test('login without 2FA still authenticates immediately', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertOk()->assertJsonStructure(['message', 'user']);
    $this->assertAuthenticatedAs($user);
});
