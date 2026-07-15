<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return response()->json([
            'data' => PromoCode::latest()->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PromoCode $promoCode) {
        return response()->json(['data' => $promoCode]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        $validated = $request->validate([
            'code' => 'required|string|unique:promo_codes',
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $promoCode = PromoCode::create($validated);

        return response()->json([
            'message' => 'Promo code created successfully.',
            'data' => $promoCode,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PromoCode $promoCode) {
        $validated = $request->validate([
            'code' => 'required|string|unique:promo_codes,code,'.$promoCode->id,
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $promoCode->update($validated);

        return response()->json([
            'message' => 'Promo code updated successfully.',
            'data' => $promoCode,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PromoCode $promoCode) {
        $promoCode->delete();

        return response()->json([
            'message' => 'Promo code deleted successfully.',
        ]);
    }

    /**
     * Toggle active status.
     */
    public function toggleStatus(PromoCode $promoCode) {
        $promoCode->update(['is_active' => ! $promoCode->is_active]);

        return response()->json([
            'message' => 'Promo code status updated.',
            'data' => $promoCode,
        ]);
    }

    /**
     * Validate a promo code for a client.
     */
    public function validateCode(Request $request) {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        return app(\App\Actions\ValidatePromoCode::class)(
            $request->code,
            $request->amount,
            skipActiveCheck: true
        );
    }
}
