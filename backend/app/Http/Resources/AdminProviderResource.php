<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminProviderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'business_name' => $this->business_name,
            'bio' => $this->bio,
            'experience_years' => (int) ($this->experience_years ?? 0),
            'location_name' => $this->location_name,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'service_radius' => $this->service_radius,
            'rating' => (float) ($this->reviews_avg_rating ?? $this->rating_avg ?? 0),
            'review_count' => (int) ($this->reviews_count ?? $this->review_count ?? 0),
            'is_verified' => (bool) $this->is_verified,
            'application_status' => $this->application_status,
            'availability_status' => $this->availability_status,
            'compliance_status' => $this->compliance_status ?? 'pending',
            'quality_score' => (float) ($this->quality_score ?? 0),
            'balance' => (float) ($this->balance ?? 0),
            'total_earned' => (float) ($this->total_earned ?? 0),
            'specialized_skills' => $this->specialized_skills ?? [],
            'logo' => $this->getFirstMediaUrl('logos') ?: null,
            'banner' => $this->getFirstMediaUrl('banners') ?: null,
            'bookings_count' => $this->when(isset($this->bookings_count), (int) $this->bookings_count),
            'services_count' => $this->when(isset($this->provider_services_count), (int) $this->provider_services_count),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'verification_documents' => VerificationDocumentResource::collection(
                $this->whenLoaded('verificationDocuments')
            ),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
