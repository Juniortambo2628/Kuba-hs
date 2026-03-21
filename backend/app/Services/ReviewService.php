<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Provider;
use App\Notifications\NewReviewReceived;
use Illuminate\Support\Facades\DB;

class ReviewService
{
    /**
     * Create a new review, increment provider statistics, award loyalty points, and notify the provider.
     */
    public function createReview(Booking $booking, $user, array $data): Review
    {
        return DB::transaction(function () use ($data, $booking, $user) {
            $review = Review::create([
                'booking_id' => $booking->id,
                'customer_id' => $user->id,
                'provider_id' => $booking->provider_id,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]);

            // Update Provider stats
            $provider = Provider::find($booking->provider_id);
            $stats = Review::where('provider_id', $provider->id)
                ->selectRaw('count(*) as count, avg(rating) as avg')
                ->first();

            $provider->update([
                'rating_avg' => $stats->avg,
                'review_count' => $stats->count,
            ]);

            // Award loyalty points for leaving a review
            app(\App\Services\LoyaltyService::class)->awardPointsForReview($booking);

            // Notify provider of new review
            $booking->provider->user->notify(new NewReviewReceived($review));

            return $review;
        });
    }
}
