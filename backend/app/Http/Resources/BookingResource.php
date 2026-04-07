<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'booking_number' => $this->booking_number,
            'scheduled_date' => $this->scheduled_date->toISOString(),
            'scheduled_time' => $this->scheduled_time,
            'scheduled_end_date' => $this->scheduled_end_date?->toISOString(),
            'started_at' => $this->started_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'elapsed_seconds' => $this->elapsed_seconds,
            'status' => $this->status,
            'estimated_price' => (float) $this->estimated_price,
            'final_price' => (float) $this->final_price,
            'total_price' => (float) $this->total_price,
            'payment_status' => $this->payment_status,
            'service_type' => $this->service_type,
            'quantity' => (int) $this->quantity,
            'description' => $this->description,
            'image_urls' => $this->image_urls,
            'customer' => new UserResource($this->whenLoaded('customer')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'address' => $this->whenLoaded('address'),
        ];
    }
}
