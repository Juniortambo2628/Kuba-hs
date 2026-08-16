<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string',
        ];
    }
}
