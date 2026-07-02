<?php

namespace App\Actions;

use App\Models\PromoCode;
use Illuminate\Http\JsonResponse;

class ValidatePromoCode
{
    /**
     * Validate a promo code and return discount details.
     *
     * @param  bool  $skipActiveCheck  Allow validating inactive codes (admin use)
     * @return array{valid: true, discount_amount: float, promo_code: PromoCode}|JsonResponse
     */
    public function __invoke(string $code, float $amount, bool $skipActiveCheck = false): array|JsonResponse
    {
        $query = PromoCode::where('code', $code);

        if (! $skipActiveCheck) {
            $query->where('is_active', true);
        }

        $promoCode = $query->first();

        if (! $promoCode) {
            return response()->json(['message' => 'Invalid promo code.'], 404);
        }

        if (! $promoCode->isValid($amount)) {
            return response()->json(['message' => 'Promo code is not applicable or has expired.'], 422);
        }

        return [
            'valid' => true,
            'discount_amount' => $promoCode->calculateDiscount($amount),
            'promo_code' => $promoCode,
        ];
    }
}
