<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromoCode extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_booking_amount',
        'max_discount_amount',
        'start_date',
        'end_date',
        'usage_limit',
        'used_count',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'discount_value' => 'decimal:2',
        'min_booking_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Check if the promo code is valid for a given amount.
     */
    public function isValid(?float $amount = null): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $now = now();
        if ($now->lt($this->start_date) || $now->gt($this->end_date)) {
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        if ($amount !== null && $this->min_booking_amount !== null && $amount < $this->min_booking_amount) {
            return false;
        }

        return true;
    }

    /**
     * Calculate the discount amount for a given total.
     */
    public function calculateDiscount(float $total): float
    {
        if ($this->discount_type === 'percentage') {
            $discount = $total * ($this->discount_value / 100);
            if ($this->max_discount_amount !== null) {
                $discount = min($discount, (float) $this->max_discount_amount);
            }

            return $discount;
        }

        return min((float) $this->discount_value, $total);
    }

    public function bookings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
