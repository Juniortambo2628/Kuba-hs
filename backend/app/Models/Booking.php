<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Booking extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory, HasUuids, Searchable, InteractsWithMedia;

    protected $fillable = [
        'customer_id',
        'provider_id',
        'service_id',
        'booking_number',
        'scheduled_date',
        'scheduled_time',
        'scheduled_end_date',
        'status',
        'address_id',
        'description',
        'service_type',
        'quantity',
        'quantity_label',
        'estimated_price',
        'final_price',
        'payment_status',
        'cancellation_reason',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'scheduled_end_date' => 'datetime',
        'estimated_price' => 'decimal:2',
        'final_price' => 'decimal:2',
    ];

    protected $appends = ['image_urls', 'total_price'];

    /**
     * Get the standardized total price (final or estimated).
     */
    public function getTotalPriceAttribute(): float
    {
        return (float) ($this->final_price ?? $this->estimated_price ?? 0);
    }

    public function getImageUrlsAttribute(): array
    {
        return $this->getMedia('issue_images')->map(fn($media) => [
            'id' => $media->id,
            'url' => $media->getFullUrl(),
        ])->toArray();
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function payment(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Payment::class);
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
            'booking_number' => $this->booking_number,
            'customer_name' => $this->customer?->name,
            'service_name' => $this->service?->name,
            'status' => $this->status,
        ];
    }
}
