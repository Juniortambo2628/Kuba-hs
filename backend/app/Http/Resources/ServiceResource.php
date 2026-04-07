<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'icon_url' => $this->icon_url,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'starting_price' => (float) ($this->provider_services_min_base_price ?? 0),
            'thumbnail_url' => $this->thumbnail_url,
            'category' => new ServiceCategoryResource($this->whenLoaded('category')),
            'media' => $this->when($this->relationLoaded('media'), function() {
                return $this->getMedia('images')->map(fn($m) => [
                    'id' => $m->id,
                    'url' => $m->getUrl(),
                    'name' => $m->file_name,
                ]);
            }),
        ];
    }
}
