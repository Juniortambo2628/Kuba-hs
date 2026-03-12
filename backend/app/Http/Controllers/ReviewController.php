<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Provider;
use App\Notifications\NewReviewReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * List reviews for the current user (as customer or provider).
     */
    public function index()
    {
        $user = Auth::user();

        $query = Review::where('customer_id', $user->id);
        if ($user->provider) {
            $query->orWhere('provider_id', $user->provider->id);
        }
        $reviews = $query
            ->with(['booking.service', 'customer:id,first_name,last_name', 'provider.user:id,first_name,last_name'])
            ->latest()
            ->get()
            ->map(function ($review) use ($user) {
                $review->is_from_me = $review->customer_id === $user->id;
                return $review;
            });

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);
        $user = Auth::user();

        // Authorization: Only the customer of the booking can leave a review
        if ($booking->customer_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Only completed bookings can be reviewed
        if ($booking->status !== 'completed') {
            abort(422, 'Only completed bookings can be reviewed.');
        }

        // Cannot review same booking twice
        if ($booking->review()->exists()) {
            abort(422, 'You have already reviewed this booking.');
        }

        DB::transaction(function () use ($validated, $booking, $user) {
            $review = Review::create([
                'booking_id' => $booking->id,
                'customer_id' => $user->id,
                'provider_id' => $booking->provider_id,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
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
        });

        // Notify provider of new review (after transaction)
        $review = Review::where('booking_id', $booking->id)->first();
        if ($review) {
            $booking->provider->user->notify(new NewReviewReceived($review));
        }

        return back()->with('success', 'Thank you for your review!');
    }
}
