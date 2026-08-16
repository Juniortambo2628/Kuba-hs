<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    private function normalizeAddressPayload(array $validated, ?Address $existing = null): array
    {
        $validated['address_type'] = $validated['address_type']
            ?? $existing?->address_type
            ?? 'home';
        $validated['country'] = filled($validated['country'] ?? null)
            ? $validated['country']
            : ($existing?->country ?? 'Kenya');
        // Empty state becomes null via ConvertEmptyStringsToNull; DB requires a value.
        $validated['state'] = filled($validated['state'] ?? null)
            ? $validated['state']
            : ($validated['city'] ?? $existing?->city ?? 'Kenya');

        return $validated;
    }

    public function index(Request $request) {
        $addresses = Auth::user()->addresses()->latest()->get();

        return response()->json([
            'addresses' => AddressResource::collection($addresses)->resolve(),
        ]);
    }

    public function show(Address $address) {
        if ($address->user_id !== Auth::id()) {
            abort(404);
        }

        return response()->json([
            'address' => new AddressResource($address),
        ]);
    }

    public function store(StoreAddressRequest $request) {
        $validated = $request->validated();

        $validated = $this->normalizeAddressPayload($validated);

        $user = Auth::user();

        if ($validated['is_default'] ?? false) {
            $user->addresses()->update(['is_default' => false]);
        } elseif ($user->addresses()->count() === 0) {
            $validated['is_default'] = true;
        }

        $address = $user->addresses()->create($validated);

        return response()->json([
            'message' => 'Address saved successfully',
            'address' => new AddressResource($address),
        ], 201);
    }

    public function update(StoreAddressRequest $request, Address $address) {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validated();

        $validated = $this->normalizeAddressPayload($validated, $address);

        if ($validated['is_default'] ?? false) {
            Auth::user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => new AddressResource($address->fresh()),
        ]);
    }

    public function destroy(Address $address) {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully',
        ]);
    }

    public function setDefault(Address $address) {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        // Clear all defaults for this user
        Auth::user()->addresses()->update(['is_default' => false]);

        // Set this address as default
        $address->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default address updated.',
            'address' => new AddressResource($address->fresh()),
        ]);
    }
}
