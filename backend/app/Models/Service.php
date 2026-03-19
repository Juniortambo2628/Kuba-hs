<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Laravel\Scout\Searchable;

class Service extends Model implements HasMedia
{
    use HasFactory, HasUuids, InteractsWithMedia, Searchable;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'icon_url',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = ['thumbnail_url'];

    public function getThumbnailUrlAttribute()
    {
        $media = $this->getFirstMediaUrl('thumbnail');
        if ($media) return $media;

        // Fallback to placeholders based on branding
        // We'll use the ones copied to public/placeholders/
        return '/placeholders/service-light.png';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    public function providerServices(): HasMany
    {
        return $this->hasMany(ProviderService::class);
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
            'description' => $this->description,
            'category' => $this->category?->name,
        ];
    }
}
