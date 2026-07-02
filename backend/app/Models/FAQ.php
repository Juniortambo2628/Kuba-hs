<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FAQ extends Model
{
    protected $table = 'faqs';

    protected $fillable = ['question', 'answer', 'avatar', 'category', 'is_active', 'order'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
