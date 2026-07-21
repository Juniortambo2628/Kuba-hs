<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RescheduleBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorized via controller policy
    }

    public function rules(): array
    {
        return [
            'scheduled_date' => ['required', 'date', 'after:now'],
        ];
    }
}
