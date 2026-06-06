<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Minimal user shape for chat lists (avatars, display names). */
class ChatUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $first = trim((string) ($this->first_name ?? ''));
        $last = trim((string) ($this->last_name ?? ''));
        $full = trim("{$first} {$last}");

        return [
            'id' => $this->id,
            'first_name' => $first ?: null,
            'last_name' => $last ?: null,
            'name' => $full !== '' ? $full : ($this->email ?? 'User'),
            'avatar_url' => $this->avatar_url,
            'role' => $this->role,
        ];
    }
}
