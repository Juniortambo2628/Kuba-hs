<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action,
            'description' => $this->description,
            'metadata' => $this->metadata,
            'actor' => $this->when($this->relationLoaded('user') && $this->user, fn () => [
                'id' => $this->user->id,
                'name' => trim($this->user->first_name . ' ' . $this->user->last_name) ?: $this->user->email,
                'role' => $this->user->role,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
