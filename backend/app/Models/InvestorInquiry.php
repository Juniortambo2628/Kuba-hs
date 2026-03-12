<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class InvestorInquiry extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'email',
        'company',
        'investment_range',
        'message',
        'status',
    ];
}
