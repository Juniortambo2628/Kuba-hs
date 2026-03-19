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
        $provider = $user->provider;

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'location_name' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'experience_years' => 'nullable|integer|min:0',
            'service_radius' => 'nullable|integer|min:0',
            'specialized_skills' => 'nullable|array',
            'specialized_skills.*' => 'string|max:50',
        ]);

        $provider->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $provider,
        ]);
    }
}
