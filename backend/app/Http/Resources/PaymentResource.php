<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ProviderResource;
use App\Http\Resources\BookingResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'amount' => $this->amount,
            'platform_fee' => $this->platform_fee,
            'provider_amount' => $this->provider_amount,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'payment_gateway' => $this->payment_gateway,
            'transaction_id' => $this->transaction_id,
            'customer' => new UserResource($this->whenLoaded('customer')),
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'booking_number' => $this->whenLoaded('booking', fn() => $this->booking->booking_number),
            'service_name' => $this->whenLoaded('booking', fn() => $this->booking->service ? $this->booking->service->name : null),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
