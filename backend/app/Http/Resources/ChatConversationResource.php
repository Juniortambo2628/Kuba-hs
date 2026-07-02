<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatConversationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'customer_id' => $this->customer_id,
            'provider_id' => $this->provider_id,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'unread_count' => (int) ($this->unread_count ?? 0),
            'customer' => $this->whenLoaded('customer', fn () => new ChatUserResource($this->customer)),
            'provider' => $this->whenLoaded('provider', function () {
                if (! $this->provider) {
                    return null;
                }

                return [
                    'id' => $this->provider->id,
                    'business_name' => $this->provider->business_name,
                    'user' => $this->provider->relationLoaded('user') && $this->provider->user
                        ? new ChatUserResource($this->provider->user)
                        : null,
                ];
            }),
            'booking' => $this->whenLoaded('booking', function () {
                if (! $this->booking) {
                    return null;
                }

                return [
                    'id' => $this->booking->id,
                    'booking_number' => $this->booking->booking_number,
                    'status' => $this->booking->status,
                    'service' => $this->booking->relationLoaded('service') && $this->booking->service
                        ? ['id' => $this->booking->service->id, 'name' => $this->booking->service->name]
                        : null,
                ];
            }),
            'latestMessage' => $this->whenLoaded('latestMessage', fn () => $this->latestMessage
                ? new ChatMessageResource($this->latestMessage)
                : null),
            'messages' => $this->whenLoaded('messages', fn () => ChatMessageResource::collection($this->messages)),
        ];
    }
}
