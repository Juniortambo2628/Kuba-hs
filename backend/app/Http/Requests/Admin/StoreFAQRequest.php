<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFAQRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question' => 'sometimes|required|string|max:255',
            'answer' => 'sometimes|required|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
