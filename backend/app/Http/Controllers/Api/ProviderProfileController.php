<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProviderProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();
        $provider = $user->ensureProviderProfile();

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'location_name' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'experience_years' => 'nullable|integer|min:0',
            'service_radius' => 'nullable|integer|min:0',
            'specialized_skills' => 'nullable|array',
            'specialized_skills.*' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Profile Update Validation failed', [
                'errors' => $validator->errors()->toArray(),
                'payload' => $request->all()
            ]);
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        if (isset($validated['specialized_skills']) && is_array($validated['specialized_skills'])) {
            $validated['specialized_skills'] = array_values(array_filter(array_map('trim', $validated['specialized_skills'])));
        }

        $provider->update($validated);

        if ($request->has('phone')) {
            $user->update(['phone' => $request->phone]);
        }

        $provider->refresh();
        $user->refresh();

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $provider->toProfileEditorArray($user),
        ]);
    }
}
