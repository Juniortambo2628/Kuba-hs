<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;

class ProviderApplicationController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'experience_years' => 'required|numeric|min:0',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'bio' => 'required|string|min:20',
            'category' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->business_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'provider',
            ]);

            $provider = Provider::create([
                'user_id' => $user->id,
                'business_name' => $request->business_name,
                'experience_years' => $request->experience_years,
                'bio' => $request->bio,
                'application_status' => 'pending',
                'is_verified' => false,
            ]);

            return response()->json([
                'message' => 'Provider application submitted successfully.',
                'user' => $user,
                'provider' => $provider
            ], 201);
        });
    }
}
