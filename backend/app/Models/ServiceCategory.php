<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ServiceCategory extends Model implements HasMedia
{
    use HasFactory, HasUuids, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'parent_category_id',
        'description',
        'icon_url',
        'image_url',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    protected $appends = ['dynamic_icon_url', 'slug'];

    public function getSlugAttribute()
    {
        return \Illuminate\Support\Str::slug($this->name);
    }

    public function getDynamicIconUrlAttribute(): ?string
    {
        $media = $this->getFirstMediaUrl('icons');
        if ($media) {
            return $media;
        }

        if ($this->icon_url && self::isMediaPathOrUrl($this->icon_url)) {
            return $this->icon_url;
        }

        return null;
    }

    public static function isMediaPathOrUrl(?string $value): bool
    {
        if (! $value) {
            return false;
        }
        $value = trim($value);
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return true;
        }
        if (str_starts_with($value, '/')) {
            return true;
        }

        return str_contains($value, '/') || str_contains($value, '.');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'parent_category_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(ServiceCategory::class, 'parent_category_id')->orderBy('sort_order');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'category_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('icons')->singleFile();
    }
}
