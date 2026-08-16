<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;
    protected $fillable = ['client_name', 'client_role', 'content', 'rating', 'image_url', 'is_active', 'sort_order'];

    protected $casts = [
        'is_active' => 'boolean',
        'rating' => 'integer',
    ];
}
