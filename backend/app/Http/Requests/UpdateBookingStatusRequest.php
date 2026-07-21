<?php

namespace App\Http\Requests;

use App\Enums\BookingStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorized via controller policy
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(array_column(BookingStatus::cases(), 'value'))],
            'cancellation_reason' => ['required_if:status,cancelled', 'nullable', 'string', 'max:1000'],
        ];
    }
}
