<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'provider_id' => 'required|exists:providers,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_date' => 'required|date|after_or_equal:today',
            'scheduled_time' => 'nullable|string',
            'description' => 'nullable|string',
            'service_type' => 'required|string|max:64',
            'quantity' => 'required|integer|min:1',
            'quantity_label' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
            'address_id' => 'nullable|exists:addresses,id',
            'new_address' => 'required_without:address_id|array',
            'new_address.street_address' => 'required_with:new_address',
            'new_address.city' => 'required_with:new_address',
            'new_address.state' => 'required_with:new_address',
            'new_address.postal_code' => 'required_with:new_address',
            'promo_code' => 'nullable|string|exists:promo_codes,code',
        ];
    }
}
