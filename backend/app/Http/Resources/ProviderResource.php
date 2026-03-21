<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
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
            'business_name' => $this->business_name,
            'bio' => $this->bio,
            'experience_years' => $this->experience_years,
            'location_name' => $this->location_name,
            'rating' => (float) ($this->reviews_avg_rating ?? $this->rating_avg ?? 0),
            'review_count' => (int) ($this->reviews_count ?? $this->review_count ?? 0),
            'is_verified' => (bool) $this->is_verified,
            'logo' => $this->getFirstMediaUrl('logos') ?: $this->user?->avatar_url,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'service_radius' => $this->service_radius,
            'starting_price' => $this->whenLoaded('providerServices', function() {
                return $this->providerServices->min('base_price');
            }),
            'user' => new UserResource($this->whenLoaded('user')),
            'services' => ProviderServiceResource::collection($this->whenLoaded('providerServices')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'availability' => $this->whenLoaded('availability'),
            'exceptions' => $this->whenLoaded('scheduleExceptions'),
        ];
    }
}
