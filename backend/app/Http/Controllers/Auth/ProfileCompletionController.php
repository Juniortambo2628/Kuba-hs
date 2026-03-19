<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProfileCompletionController extends Controller
{
    /**
     * Complete the user profile after social login.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => ['required', Rule::in(['customer', 'provider'])],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'google_id' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Create the user if it doesn't exist (though it should have been created or data passed)
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'google_id' => $request->google_id,
                'password' => Hash::make(Str::random(24)),
                'role' => $request->role,
                'phone' => $request->phone,
                'is_active' => true,
                'is_verified' => true,
            ]);
        } else {
            // Update existing user (e.g. if they logged in via Google but role was missing)
            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'role' => $request->role,
                'phone' => $request->phone,
                'google_id' => $request->google_id,
                'is_active' => true,
                'is_verified' => true,
            ]);
        }

        // If it's a provider, we might need to create the provider record
        if ($user->role === 'provider' && !$user->provider) {
            $user->provider()->create([
                'business_name' => $user->name,
                'bio' => 'Professional home service provider.',
                'is_available' => true,
            ]);
        }

        return response()->json([
            'message' => 'Profile completed successfully',
            'user' => $user,
            'redirect' => $user->role === 'admin' ? '/admin' : '/dashboard'
        ]);
    }
}
