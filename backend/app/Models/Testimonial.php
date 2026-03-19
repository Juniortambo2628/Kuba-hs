<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['client_name', 'client_role', 'content', 'rating', 'image_url', 'is_active', 'order'];
}
