<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'body' => $this->body,
            'type' => $this->type,
            'created_at' => $this->created_at?->toIso8601String(),
            'read_at' => $this->read_at?->toIso8601String(),
            'sender' => $this->whenLoaded('sender', fn () => new ChatUserResource($this->sender)),
        ];
    }
}
