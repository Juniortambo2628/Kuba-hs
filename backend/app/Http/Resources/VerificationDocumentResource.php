<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_type' => $this->document_type,
            'file_path' => $this->file_path,
            'url' => $this->url,
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'expires_at' => $this->expires_at?->toDateString(),
            'is_expired' => $this->is_expired,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
