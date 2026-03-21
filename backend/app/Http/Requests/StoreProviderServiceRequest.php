<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProviderServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_id' => 'required|exists:services,id',
            'base_price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'pricing_type' => 'nullable|string|in:fixed,hourly,quote',
            'min_hours' => 'nullable|integer|min:1',
            'travel_fee' => 'nullable|numeric|min:0',
            'equipment_included' => 'nullable|boolean',
            'extra_configs' => 'nullable|array',
        ];
    }
}
