<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Provider;
use Inertia\Inertia;
use App\Http\Requests\StoreReviewRequest;
use App\Services\ReviewService;

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
    public function store(StoreReviewRequest $request)
    {
        $validated = $request->validated();

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

        app(ReviewService::class)->createReview($booking, $user, $validated);

        return back()->with('success', 'Thank you for your review!');
    }
}
