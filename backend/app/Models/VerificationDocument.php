<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'document_type',
        'file_path',
        'status',
        'rejection_reason',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'date',
    ];

    protected $appends = ['is_expired', 'url'];

    public function getUrlAttribute(): string
    {
        if (!$this->file_path) {
            return '';
        }
        return \Illuminate\Support\Facades\Storage::disk('public')->url($this->file_path);
    }

    public function getIsExpiredAttribute(): bool
    {
        if (!$this->expires_at) {
            return false;
        }
        return $this->expires_at->isPast();
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
