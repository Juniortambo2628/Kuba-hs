<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\HasProviderAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderAvailabilityController extends Controller
{
    use HasProviderAuthorization;

    public function index() {
        $provider = $this->getProviderOrFail();

        return response()->json([
            'availability' => $provider->availability,
            'exceptions' => $provider->scheduleExceptions,
        ]);
    }

    public function update(Request $request) {
        $provider = $this->getProviderOrFail();

        $validated = $request->validate([
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|min:0|max:6',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i|after:availability.*.start_time',
            'availability.*.is_available' => 'boolean',
        ]);

        foreach ($validated['availability'] as $item) {
            $provider->availability()->updateOrCreate(
                ['day_of_week' => $item['day_of_week']],
                [
                    'start_time' => $item['start_time'],
                    'end_time' => $item['end_time'],
                    'is_available' => $item['is_available'] ?? true,
                ]
            );
        }

        return response()->json([
            'message' => 'Availability updated successfully',
            'availability' => $provider->availability()->get(),
        ]);
    }

    public function updateExceptions(Request $request) {
        $provider = $this->getProviderOrFail();

        $validated = $request->validate([
            'exceptions' => 'required|array',
            'exceptions.*.date' => 'required|date',
            'exceptions.*.is_closed' => 'required|boolean',
            'exceptions.*.start_time' => 'nullable|required_if:exceptions.*.is_closed,false|date_format:H:i',
            'exceptions.*.end_time' => 'nullable|required_if:exceptions.*.is_closed,false|date_format:H:i|after:exceptions.*.start_time',
            'exceptions.*.reason' => 'nullable|string|max:255',
        ]);

        $provider->scheduleExceptions()->delete();

        foreach ($validated['exceptions'] as $exception) {
            $provider->scheduleExceptions()->create($exception);
        }

        return response()->json([
            'message' => 'Schedule exceptions updated successfully',
            'exceptions' => $provider->scheduleExceptions()->get(),
        ]);
    }
}
