<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Laravel\Scout\Searchable;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids, HasRoles, InteractsWithMedia, Searchable;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatars')->singleFile();
    }

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'name',
        'avatar_url',
        'total_points',
        'membership_tier',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'role',
        'avatar_url',
        'google_id',
        'is_verified',
        'is_active',
        'unsubscribed_from_emails',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user's full name.
     */
    public function getNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Uploaded avatar only — no auto-generated placeholder URLs in API responses.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        $media = $this->getFirstMediaUrl('avatars');
        if ($media) {
            return $media;
        }

        $stored = $this->attributes['avatar_url'] ?? null;
        if ($stored && !self::isPlaceholderAvatarUrl($stored)) {
            return $stored;
        }

        return null;
    }

    public static function isPlaceholderAvatarUrl(?string $url): bool
    {
        if (! $url) {
            return true;
        }

        return str_contains($url, 'ui-avatars.com')
            || str_contains($url, 'dicebear.com')
            || str_contains($url, '/placeholders/');
    }

    /**
     * Role checks.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isProvider(): bool
    {
        return $this->role === 'provider';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    /**
     * Relationships.
     */
    public function provider()
    {
        return $this->hasOne(Provider::class);
    }

    /**
     * Ensure a providers row exists for provider-role users (onboarding / legacy accounts).
     */
    public function ensureProviderProfile(): ?Provider
    {
        if ($this->role !== 'provider') {
            return null;
        }

        $existing = $this->provider()->first();
        if ($existing) {
            return $existing;
        }

        return Provider::create([
            'user_id' => $this->id,
            'business_name' => trim($this->name) !== '' ? $this->name : 'My Business',
            'is_verified' => false,
            'application_status' => 'pending',
            'availability_status' => 'available',
            'experience_years' => 0,
            'service_radius' => 10,
        ]);
    }

    public function loyaltyPoints()
    {
        return $this->hasMany(LoyaltyPoint::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    public function favoriteProviders()
    {
        return $this->belongsToMany(Provider::class, 'user_favorites')->withTimestamps();
    }

    /**
     * Get the user's total loyalty points.
     */
    public function getTotalPointsAttribute(): int
    {
        return (int) $this->loyaltyPoints()
            ->selectRaw('SUM(CASE WHEN transaction_type = "earn" THEN points ELSE -points END) as total')
            ->value('total') ?? 0;
    }

    /**
     * Get the user's current loyalty tier.
     */
    public function getMembershipTierAttribute()
    {
        return LoyaltyTier::where('min_points', '<=', $this->total_points)
            ->where('is_active', true)
            ->orderByDesc('min_points')
            ->first();
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
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
        ];
    }
}
