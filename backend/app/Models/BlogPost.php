<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model implements \Spatie\MediaLibrary\HasMedia
{
    use HasUuids, \Spatie\MediaLibrary\InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'image',
        'is_published',
        'author_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('hero') ?: ($this->image ?? 'https://placehold.co/1200x600/1E293B/sky?text=Kuba+Insights');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
