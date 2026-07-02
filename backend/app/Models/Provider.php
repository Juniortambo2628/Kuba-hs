<?php

namespace App\Models;

use App\Enums\ProviderApplicationStatus;
use App\Enums\ProviderAvailabilityStatus;
use App\Enums\ProviderComplianceStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model implements \Spatie\MediaLibrary\HasMedia
{
    use HasFactory, HasUuids, \Laravel\Scout\Searchable, SoftDeletes, \Spatie\MediaLibrary\InteractsWithMedia;

    protected $fillable = [
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
        'availability_status',
        'specialized_skills',
        'quality_score',
        'compliance_status',
        'balance',
        'total_earned',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'specialized_skills' => 'json',
        'quality_score' => 'decimal:2',
        'balance' => 'decimal:2',
        'total_earned' => 'decimal:2',
        'application_status' => ProviderApplicationStatus::class,
        'availability_status' => ProviderAvailabilityStatus::class,
        'compliance_status' => ProviderComplianceStatus::class,
    ];

    public function getSlugAttribute(): string
    {
        return \Illuminate\Support\Str::slug($this->business_name ?? '');
    }

    public function resolveRouteBinding($value, $field = null)
    {
        if (\Illuminate\Support\Str::isUuid($value)) {
            return $this->where($this->getRouteKeyName(), $value)->first();
        }

        return $this->whereRaw('LOWER(REPLACE(business_name, " ", "-")) = ?', [\Illuminate\Support\Str::slug($value)])->first();
    }

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

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logos')->singleFile();
        $this->addMediaCollection('banners')->singleFile();
    }

    /**
     * Provider dashboard / profile editor payload (keeps API shape in one place).
     *
     * @return array<string, mixed>
     */
    public function toProfileEditorArray(?User $user = null): array
    {
        $user = $user ?? $this->user;

        return [
            'id' => $this->id,
            'business_name' => $this->business_name,
            'bio' => $this->bio,
            'location_name' => $this->location_name,
            'phone' => $user?->phone,
            'experience_years' => (int) ($this->experience_years ?? 0),
            'service_radius' => (int) ($this->service_radius ?? 10),
            'is_verified' => (bool) $this->is_verified,
            'latitude' => $this->latitude !== null ? (float) $this->latitude : null,
            'longitude' => $this->longitude !== null ? (float) $this->longitude : null,
            'specialized_skills' => $this->specialized_skills ?? [],
            'logo' => $this->getFirstMediaUrl('logos') ?: null,
            'banner' => $this->getFirstMediaUrl('banners') ?: null,
        ];
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing('providerServices.service.category');

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
