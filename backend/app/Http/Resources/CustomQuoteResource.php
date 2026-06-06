<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomQuoteResource extends JsonResource
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
            'organization_name' => $this->organization_name,
            'contact_person' => $this->contact_person,
            'email' => $this->email,
            'phone' => $this->phone,
            'organization_type' => $this->organization_type,
            'source' => $this->source,
            'service_category' => $this->service_category,
            'description' => $this->description,
            'status' => $this->status ?? 'pending',
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
