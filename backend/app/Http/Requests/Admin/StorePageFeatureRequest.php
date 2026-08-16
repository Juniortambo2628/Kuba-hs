<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePageFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'page_name' => 'sometimes|required|string',
            'section_name' => 'sometimes|required|string',
            'title' => 'sometimes|required|string',
            'subtitle' => 'nullable|string',
            'description' => 'sometimes|required|string',
            'icon' => 'nullable|string',
            'image_url' => 'nullable|string',
            'metadata' => 'nullable|array',
            'order_index' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
