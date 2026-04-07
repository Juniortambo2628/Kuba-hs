<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'addresses' => Auth::user()->addresses()->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_type' => 'nullable|string|in:home,work,other',
            'street_address' => 'required|string|max:255',
            'apartment' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_default' => 'boolean',
        ]);

        $validated['address_type'] = $validated['address_type'] ?? 'home';

        $user = Auth::user();

        if ($validated['is_default'] ?? false) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($validated);

        return response()->json([
            'message' => 'Address saved successfully',
            'address' => $address
        ]);
    }

    public function update(Request $request, Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'address_type' => 'nullable|string|in:home,work,other',
            'street_address' => 'string|max:255',
            'apartment' => 'nullable|string|max:255',
            'city' => 'string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'string|max:20',
            'country' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            Auth::user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => $address
        ]);
    }

    public function destroy(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully'
        ]);
    }

    public function setDefault(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        // Clear all defaults for this user
        Auth::user()->addresses()->update(['is_default' => false]);

        // Set this address as default
        $address->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default address updated.',
            'address' => $address->fresh(),
        ]);
    }
}
