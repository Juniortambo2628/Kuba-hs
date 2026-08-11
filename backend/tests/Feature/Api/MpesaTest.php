<?php

use Illuminate\Support\Facades\Http;

test('client can initiate mpesa stk push', function () {
    $workflow = createBookingWorkflow(['status' => 'confirmed']);
    
    // Mock Daraja API response
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
            'phone' => '254712345678',
            'amount' => 5000,
        ]);

    $response->assertOk()
        ->assertJsonStructure(['CheckoutRequestID']);
});

test('can check mpesa status', function () {
    $workflow = createBookingWorkflow(['status' => 'confirmed']);
    
    Http::fake([
        '*oauth/v1/generate*' => Http::response(['access_token' => 'mock_token'], 200),
        '*mpesa/stkpushquery/v1/query' => Http::response([
            'ResponseCode' => '0',
            'ResultCode' => '0',
            'ResultDesc' => 'The service request is processed successfully.'
        ], 200)
    ]);

    $response = $this->actingAs($workflow['customer'])
        ->postJson('/api/payments/mpesa/check-status', [
            'CheckoutRequestID' => 'ws_CO_12345'
        ]);

    $response->assertOk();
});

test('mpesa callback webhook updates payment', function () {
    $payment = \App\Models\Payment::factory()->create([
        'reference_number' => 'ws_CO_12345',
        'status' => 'pending',
        'provider' => 'mpesa'
    ]);

    $payload = [
        'Body' => [
            'stkCallback' => [
                'CheckoutRequestID' => 'ws_CO_12345',
                'ResultCode' => 0,
                'CallbackMetadata' => [
                    'Item' => [
                        ['Name' => 'MpesaReceiptNumber', 'Value' => 'NLJ0123456']
                    ]
                ]
            ]
        ]
    ];

    $response = $this->postJson('/api/payments/mpesa/callback', $payload);

    $response->assertOk();
    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'status' => 'successful'
    ]);
});
