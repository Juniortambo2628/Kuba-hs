<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ServiceCategory extends Model implements HasMedia
{
    use HasFactory, HasUuids, InteractsWithMedia;

    protected $fillable = [
        'name',
        'type',
        'parent_category_id',
        'description',
        'icon_url',
        'image_url',
        'sort_order',
    ];

    protected $appends = ['dynamic_icon_url', 'slug'];

    public function getSlugAttribute()
    {
        return \Illuminate\Support\Str::slug($this->name);
    }

    public function getDynamicIconUrlAttribute()
    {
        return $this->getFirstMediaUrl('icons') ?: ($this->icon_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'parent_category_id');
    }

    /**
     * @return HasMany
     */
    public function children(): HasMany
    {
        return $this->hasMany(ServiceCategory::class, 'parent_category_id')->orderBy('sort_order');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'category_id');
    }
}
