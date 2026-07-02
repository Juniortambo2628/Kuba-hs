<?php

namespace App\Http\Requests\Admin;

use App\Enums\BookingStatus;
use Illuminate\Foundation\Http\FormRequest;

class StoreAdminBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:users,id',
            'provider_id' => 'required|exists:providers,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'nullable|string',
            'description' => 'nullable|string',
            'service_type' => 'required|in:residential,commercial,large_scale',
            'quantity' => 'required|integer|min:1',
            'quantity_label' => 'nullable|string',
            'location_name' => 'nullable|string|max:255',
            'status' => 'nullable|in:'.implode(',', array_column(BookingStatus::cases(), 'value')),
            'promo_code' => 'nullable|string|exists:promo_codes,code',
        ];
    }
}
