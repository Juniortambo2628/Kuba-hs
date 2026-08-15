<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\Review;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Store a new review for a booking.
     */
    public function store(StoreReviewRequest $request) {
        $booking = Booking::findOrFail($request->booking_id);
        $user = $request->user();

        // Authorization: Only the customer who made the booking can review
        if ($booking->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. Only the booking owner can leave a review.'], 403);
        }

        // Must be completed to review
        if ($booking->status !== BookingStatus::Completed) {
            return response()->json(['message' => 'You can only review completed services.'], 422);
        }

        // Check if already reviewed
        if (Review::where('booking_id', $booking->id)->exists()) {
            return response()->json(['message' => 'You have already reviewed this service.'], 422);
        }

        return DB::transaction(function () use ($request, $booking, $user) {
            $review = Review::create([
                'booking_id' => $booking->id,
                'customer_id' => $user->id,
                'provider_id' => $booking->provider_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            if ($request->hasFile('images')) {
                $images = app(ImageOptimizationService::class);
                foreach ($request->file('images') as $image) {
                    $media = $review->addMedia($image)->toMediaCollection('review_images');
                    $images->optimizeMedia($media, ImageOptimizationService::PRESET_REVIEW);
                }
            }

            // Update Provider stats
            $this->updateProviderStats($booking->provider_id);

            return new ReviewResource($review->load(['customer', 'media']));
        });
    }

    /**
     * Update Provider average rating and review count.
     */
    protected function updateProviderStats($providerId)
    {
        $stats = Review::where('provider_id', $providerId)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as count')
            ->first();

        Provider::where('id', $providerId)->update([
            'rating_avg' => round($stats->avg_rating, 1),
            'review_count' => $stats->count,
        ]);
    }

    /**
     * Get reviews for a provider.
     */
    public function providerReviews($providerId) {
        $reviews = Review::with(['customer', 'media'])
            ->where('provider_id', $providerId)
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }
}
