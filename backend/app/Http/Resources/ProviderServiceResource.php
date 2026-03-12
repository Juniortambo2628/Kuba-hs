<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderServiceResource extends JsonResource
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
            'service_id' => $this->service_id,
            'base_price' => (float) $this->base_price,
            'pricing_type' => $this->pricing_type,
            'is_available' => $this->is_available,
            'name' => $this->service?->name,
            'description' => $this->service?->description,
            'category' => $this->service?->category?->name,
            'image_urls' => $this->image_urls,
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'service' => new ServiceResource($this->whenLoaded('service')),
        ];
    }
}
