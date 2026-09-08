<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProfileCompletionController extends Controller
{
    /**
     * Complete the user profile after social login.
     */
    public function store(Request $request) {
        $request->validate([
            'role' => ['required', Rule::in(['customer', 'provider'])],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Use the authenticated user rather than trusting the request payload —
        // the Google callback logs the user in before redirecting here.
        $user = $request->user();

        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'role' => $request->role,
            'phone' => $request->phone,
            'is_active' => true,
            'is_verified' => true,
        ]);

        if ($user->role === UserRole::Provider) {
            $user->ensureProviderProfile();
        }

        return response()->json([
            'message' => 'Profile completed successfully',
            'user' => new \App\Http\Resources\UserResource($user->fresh()),
            'redirect' => $user->role === UserRole::Admin ? '/admin' : '/dashboard',
        ]);
    }
}
