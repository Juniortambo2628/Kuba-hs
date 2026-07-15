<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProviderProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProviderProfileController extends Controller
{
    public function update(UpdateProviderProfileRequest $request) {
        $user = Auth::user();
        $provider = $user->ensureProviderProfile();

        if (! $provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $validated = $request->validated();

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
