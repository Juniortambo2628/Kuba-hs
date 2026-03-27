<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model implements \Spatie\MediaLibrary\HasMedia
{
    use HasFactory, HasUuids, \Laravel\Scout\Searchable, \Spatie\MediaLibrary\InteractsWithMedia;

    protected $fillable = [
        'id',
        'user_id',
        'business_name',
        'bio',
        'experience_years',
        'location_name',
        'latitude',
        'longitude',
        'service_radius',
        'rating_avg',
        'review_count',
        'is_verified',
        'application_status',
        'verification_documents',
        'availability_status',
        'specialized_skills',
        'quality_score',
        'compliance_status',
        'balance',
        'total_earned',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verification_documents' => 'json',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'specialized_skills' => 'json',
        'quality_score' => 'decimal:2',
        'balance' => 'decimal:2',
        'total_earned' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function providerServices(): HasMany
    {
        return $this->hasMany(ProviderService::class);
    }

    public function availability(): HasMany
    {
        return $this->hasMany(ProviderAvailability::class);
    }

    public function scheduleExceptions(): HasMany
    {
        return $this->hasMany(ProviderScheduleException::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function verificationDocuments(): HasMany
    {
        return $this->hasMany(VerificationDocument::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'business_name' => $this->business_name,
            'bio' => $this->bio,
            'location_name' => $this->location_name,
            'is_verified' => $this->is_verified,
            'user_name' => $this->user?->name,
            'category_ids' => $this->providerServices->pluck('service.category_id')->unique()->values()->all(),
            'service_ids' => $this->providerServices->pluck('service_id')->unique()->values()->all(),
        ];
    }
}
