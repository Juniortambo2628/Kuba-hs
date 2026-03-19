<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomQuote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'organization_name',
        'contact_person',
        'email',
        'phone',
        'organization_type',
        'service_category',
        'estimated_volume',
        'description',
        'status',
    ];
}
