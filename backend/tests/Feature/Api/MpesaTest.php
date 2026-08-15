<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

test('client can initiate mpesa stk push', function () {
    Config::set('services.mpesa.consumerKey', 'test_key');
    Config::set('services.mpesa.consumerSecret', 'test_secret');
    Config::set('services.mpesa.shortCode', '174379');
    Config::set('services.mpesa.passkey', 'test_passkey');
    Config::set('services.mpesa.baseUrl', 'https://sandbox.safaricom.co.ke');

    $workflow = createBookingWorkflow(['status' => 'confirmed']);
    
    Http::fake([
        '*oauth/v1/generate*' => Http::response(['access_token' => 'mock_token'], 200),
        '*mpesa/stkpush/v1/processrequest' => Http::response([
            'ResponseCode' => '0',
            'CheckoutRequestID' => 'ws_CO_12345',
            'CustomerMessage' => 'Success'
        ], 200)
    ]);

    $response = $this->actingAs($workflow['customer'])
        ->postJson('/api/payments/mpesa/stk-push', [
            'booking_id' => $workflow['booking']->id,
            'phone_number' => '254712345678',
        ]);

    $response->assertOk()
        ->assertJsonStructure(['checkout_request_id']);
});

test('can check mpesa status', function () {
    $workflow = createBookingWorkflow(['status' => 'confirmed']);

    $response = $this->actingAs($workflow['customer'])
        ->postJson('/api/payments/mpesa/check-status', [
            'booking_id' => $workflow['booking']->id,
        ]);

    $response->assertOk();
});

test('mpesa callback webhook updates payment', function () {
    Config::set('services.safaricom.callback_secret', 'test_secret');

    $workflow = createBookingWorkflow(['status' => 'confirmed']);
    $booking = $workflow['booking'];
    $booking->update(['mpesa_checkout_id' => 'ws_CO_12345']);

    $payload = [
        'Body' => [
            'stkCallback' => [
                'CheckoutRequestID' => 'ws_CO_12345',
                'ResultCode' => 0,
                'CallbackMetadata' => [
                    'Item' => [
                        ['Name' => 'Amount', 'Value' => 500],
                        ['Name' => 'MpesaReceiptNumber', 'Value' => 'NLJ0123456'],
                        ['Name' => 'PhoneNumber', 'Value' => '254712345678'],
                    ]
                ]
            ]
        ]
    ];

    $content = json_encode($payload);
    $signature = hash_hmac('sha256', $content, 'test_secret');

    $response = $this->withHeaders([
        'X-Safaricom-Signature' => $signature,
    ])->postJson('/api/payments/mpesa/callback', $payload);

    $response->assertOk();
});
