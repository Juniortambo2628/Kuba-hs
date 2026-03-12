<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TrustPartner extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'logo_path',
        'is_active',
    ];
}
