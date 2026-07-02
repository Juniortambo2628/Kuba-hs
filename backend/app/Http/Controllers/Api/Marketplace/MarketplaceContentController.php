<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Resources\FAQResource;
use App\Http\Resources\TestimonialResource;
use App\Models\FAQ;
use App\Models\Testimonial;
use App\Models\TrustPartner;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class MarketplaceContentController extends Controller
{
    public function faqs(): JsonResponse
    {
        return FAQResource::collection(
            Cache::remember('api_faqs_all', 86400, function () {
                return FAQ::where('is_active', true)->orderBy('order', 'asc')->get();
            })
        )->response();
    }

    public function testimonials(): JsonResponse
    {
        return TestimonialResource::collection(
            Cache::remember('api_testimonials_all', 86400, function () {
                return Testimonial::where('is_active', true)->orderBy('order', 'asc')->get();
            })
        )->response();
    }

    public function trustPartners(): JsonResponse
    {
        return response()->json(
            Cache::remember('api_trust_partners', 86400, function () {
                return TrustPartner::where('is_active', true)->latest()->get();
            })
        );
    }
}
