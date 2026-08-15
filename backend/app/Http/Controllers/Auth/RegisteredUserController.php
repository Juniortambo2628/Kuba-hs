<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => $request->filled('google_id') ? 'nullable' : ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:customer,provider',
            'phone' => 'nullable|string|max:20',
            'google_id' => 'nullable|string',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password ?? \Illuminate\Support\Str::random(24)),
            'role' => $request->role,
            'phone' => $request->phone,
            'google_id' => $request->google_id,
            'two_factor_setup_required' => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
        }

        return redirect(route('dashboard', absolute: false));
    }
}
