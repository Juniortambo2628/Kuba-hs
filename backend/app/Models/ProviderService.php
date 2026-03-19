<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderService extends Model implements \Spatie\MediaLibrary\HasMedia
{
    use HasFactory, HasUuids, \Spatie\MediaLibrary\InteractsWithMedia;

    protected $fillable = [
        'provider_id',
        'service_id',
        'base_price',
        'pricing_type',
        'min_hours',
        'travel_fee',
        'equipment_included',
        'extra_configs',
        'is_available',
    ];

    protected $appends = ['image_urls'];

    protected $casts = [
        'is_available' => 'boolean',
        'base_price' => 'decimal:2',
        'travel_fee' => 'decimal:2',
        'min_hours' => 'integer',
        'equipment_included' => 'boolean',
        'extra_configs' => 'array',
    ];

    public function getImageUrlsAttribute(): array
    {
        $media = $this->getMedia('services');
        
        if ($media->isEmpty() && $this->service) {
            $media = $this->service->getMedia('images');
        }

        return $media->map(fn($m) => [
            'id' => $m->id,
            'url' => $m->getFullUrl(),
        ])->toArray();
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
