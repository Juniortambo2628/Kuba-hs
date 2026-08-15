<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebauthnCredential extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'credential_id',
        'public_key',
        'counter',
        'name',
        'authenticator_type',
        'transports',
        'backup_eligible',
        'backup_state',
        'last_used_at',
    ];

    protected $casts = [
        'transports' => 'array',
        'backup_eligible' => 'boolean',
        'backup_state' => 'boolean',
        'counter' => 'integer',
        'last_used_at' => 'datetime',
    ];

    protected $hidden = [
        'public_key',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
