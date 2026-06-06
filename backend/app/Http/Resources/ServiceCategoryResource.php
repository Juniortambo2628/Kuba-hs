<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryResource extends JsonResource
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
            'type' => $this->type ?? 'residential',
            'sort_order' => (int) ($this->sort_order ?? 0),
            'description' => $this->description,
            'slug' => $this->slug,
            'icon' => $this->icon_url,
            'icon_url' => $this->icon_url,
            'image_url' => $this->image_url,
            'dynamic_icon_url' => $this->dynamic_icon_url,
            'services_count' => (int) ($this->services_count ?? 0),
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
