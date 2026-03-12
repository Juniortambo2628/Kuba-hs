<?php

namespace App\Http\Controllers;

use App\Models\ProviderAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Show the provider schedule/availability page.
     */
    public function index()
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return redirect()->route('provider.setup');
        }

        $availability = $provider->availability()
            ->orderBy('day_of_week')
            ->get()
            ->keyBy('day_of_week');

        return Inertia::render('Schedule/Index', [
            'availability' => $availability,
            'dayNames' => ProviderAvailability::dayNames(),
        ]);
    }

    /**
     * Update provider availability (replace all slots).
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return redirect()->route('provider.setup');
        }

        $validated = $request->validate([
            'slots' => 'required|array',
            'slots.*.day_of_week' => 'required|integer|min:0|max:6',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i',
        ]);

        $provider->availability()->delete();

        foreach ($validated['slots'] as $slot) {
            if ($slot['start_time'] === $slot['end_time']) {
                continue;
            }
            ProviderAvailability::create([
                'provider_id' => $provider->id,
                'day_of_week' => (int) $slot['day_of_week'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
            ]);
        }

        return redirect()->route('schedule.index')->with('success', 'Your schedule has been updated.');
    }
}
