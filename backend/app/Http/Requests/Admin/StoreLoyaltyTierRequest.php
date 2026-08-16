<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoyaltyTierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'min_points' => 'required|integer|min:0',
            'benefits' => 'nullable|array',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
