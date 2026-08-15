<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageFeature extends Model
{
    use HasFactory;
    protected $fillable = [
        'page_name',
        'section_name',
        'title',
        'subtitle',
        'description',
        'icon',
        'image_url',
        'metadata',
        'order_index',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];
}
