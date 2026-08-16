<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_type' => 'nullable|string|in:home,work,other,residential,commercial',
            'street_address' => 'sometimes|required|string|max:255',
            'apartment' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'sometimes|required|string|max:20',
            'country' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_default' => 'sometimes|boolean',
        ];
    }
}
