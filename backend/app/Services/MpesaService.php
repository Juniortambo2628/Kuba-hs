<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    private $consumerKey;

    private $consumerSecret;

    private $shortCode;

    private $passkey;

    private $baseUrl;

    private $callbackUrl;

    public function __construct()
    {
        $this->consumerKey = config('services.mpesa.consumerKey');
        $this->consumerSecret = config('services.mpesa.consumerSecret');
        $this->shortCode = config('services.mpesa.shortCode');
        $this->passkey = config('services.mpesa.passkey');
        $this->baseUrl = config('services.mpesa.baseUrl');
        $this->callbackUrl = config('services.mpesa.callbackUrl');
    }

    /**
     * Generate Access Token from Daraja
     */
    public function generateToken()
    {
        $url = $this->baseUrl.'/oauth/v1/generate?grant_type=client_credentials';

        $response = Http::withoutVerifying()
            ->withBasicAuth($this->consumerKey, $this->consumerSecret)
            ->get($url);

        if ($response->successful()) {
            return $response->json('access_token');
        }

        Log::error('Mpesa Token Generation Failed', $response->json());
        throw new \Exception('Failed to generate M-Pesa token');
    }

    /**
     * Trigger STK Push (Lipa na M-Pesa Online)
     */
    public function stkPush(Booking $booking, string $phoneNumber)
    {
        $token = $this->generateToken();
        $timestamp = Carbon::now()->format('YmdHis');
        $password = base64_encode($this->shortCode.$this->passkey.$timestamp);

        $amount = (int) ($booking->final_price ?? $booking->estimated_price);
        // Standard platform fee 10%
        $platformFee = round($amount * 0.10, 2);
        $totalAmount = (int) round($amount + $platformFee);

        // Sanitize phone number (remove +, ensures 254...)
        $phoneNumber = preg_replace('/[^0-9]/', '', $phoneNumber);
        if (str_starts_with($phoneNumber, '0')) {
            $phoneNumber = '254'.substr($phoneNumber, 1);
        } elseif (str_starts_with($phoneNumber, '7') || str_starts_with($phoneNumber, '1')) {
            $phoneNumber = '254'.$phoneNumber;
        }

        $url = $this->baseUrl.'/mpesa/stkpush/v1/processrequest';

        $body = [
            'BusinessShortCode' => $this->shortCode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => $totalAmount,
            'PartyA' => $phoneNumber,
            'PartyB' => $this->shortCode,
            'PhoneNumber' => $phoneNumber,
            'CallBackURL' => $this->callbackUrl,
            'AccountReference' => 'KUBA-'.$booking->booking_number,
            'TransactionDesc' => 'Payment for Home Service: '.$booking->service->name,
        ];

        $response = Http::withoutVerifying()->withToken($token)->post($url, $body);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Mpesa STK Push Failed', $response->json());
        throw new \Exception('Failed to trigger M-Pesa STK Push');
    }
}
