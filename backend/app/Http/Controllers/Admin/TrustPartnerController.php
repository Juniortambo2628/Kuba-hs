<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrustPartner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TrustPartnerController extends Controller
{
    public function index() {
        $partners = TrustPartner::latest()->paginate(20);

        return response()->json($partners);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_path' => 'required|string', // URL or path
            'is_active' => 'boolean',
        ]);

        $partner = TrustPartner::create($validated);
        Cache::forget('api_trust_partners');

        return response()->json($partner, 201);

    }

    public function show(TrustPartner $trustPartner) {
        return response()->json($trustPartner);
    }

    public function update(Request $request, TrustPartner $trustPartner) {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'logo_path' => 'sometimes|required|string',
            'is_active' => 'boolean',
        ]);

        $trustPartner->update($validated);
        Cache::forget('api_trust_partners');

        return response()->json($trustPartner);

    }

    public function destroy(TrustPartner $trustPartner) {
        $trustPartner->delete();
        Cache::forget('api_trust_partners');

        return response()->json(['message' => 'Partner removed successfully.']);
    }
}
