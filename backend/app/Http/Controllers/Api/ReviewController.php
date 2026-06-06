<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Provider;
use App\Services\ImageOptimizationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    /**
     * Store a new review for a booking.
     */
    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images.*' => 'nullable|image|max:5120', // 5MB limit
        ]);

        $booking = Booking::findOrFail($request->booking_id);
        $user = $request->user();

        // Authorization: Only the customer who made the booking can review
        if ($booking->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. Only the booking owner can leave a review.'], 403);
        }

        // Must be completed to review
        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'You can only review completed services.'], 422);
        }

        // Check if already reviewed
        if (Review::where('booking_id', $booking->id)->exists()) {
            return response()->json(['message' => 'You have already reviewed this service.'], 422);
        }

        return DB::transaction(function () use ($request, $booking, $user) {
            $review = Review::create([
                'booking_id' => $booking->id,
                'user_id' => $user->id,
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

            return new ReviewResource($review->load(['user', 'media']));
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
            'rating' => round($stats->avg_rating, 1),
            'review_count' => $stats->count,
        ]);
    }

    /**
     * Get reviews for a provider.
     */
    public function providerReviews($providerId)
    {
        $reviews = Review::with(['user', 'media'])
            ->where('provider_id', $providerId)
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }
}
