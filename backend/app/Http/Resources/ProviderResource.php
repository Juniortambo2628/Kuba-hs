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
            'slug' => $this->slug,
            'business_name' => $this->business_name,
            'bio' => $this->bio,
            'experience_years' => $this->experience_years,
            'location_name' => $this->location_name,
            'specialized_skills' => $this->specialized_skills,
            'rating' => (float) ($this->reviews_avg_rating ?? $this->rating_avg ?? 0),
            'review_count' => (int) ($this->reviews_count ?? $this->review_count ?? 0),
            'is_verified' => (bool) $this->is_verified,
            'logo' => $this->getFirstMediaUrl('logos') ?: null,
            'banner' => $this->getFirstMediaUrl('banners') ?: null,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'service_radius' => $this->service_radius,
            'starting_price' => $this->starting_price ?? ($this->relationLoaded('providerServices')
                ? $this->providerServices->min('base_price')
                : null),
            'user' => new UserResource($this->whenLoaded('user')),
            'services' => ProviderServiceResource::collection($this->whenLoaded('providerServices')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'availability' => $this->whenLoaded('availability'),
            'exceptions' => $this->whenLoaded('scheduleExceptions'),
        ];
    }
}
