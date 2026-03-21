<?php

namespace App\Observers;

use App\Models\Review;
use App\Models\Provider;

class ReviewObserver
{
    /**
     * Handle the Review "saved" event (created or updated).
     */
    public function saved(Review $review)
    {
        $this->updateProviderStats($review->provider_id);
    }

    /**
     * Handle the Review "deleted" event.
     */
    public function deleted(Review $review)
    {
        $this->updateProviderStats($review->provider_id);
    }

    /**
     * Recalculate and update provider rating average and review count.
     */
    protected function updateProviderStats($providerId)
    {
        $provider = Provider::find($providerId);
        if ($provider) {
            $avg = Review::where('provider_id', $providerId)->avg('rating');
            $count = Review::where('provider_id', $providerId)->count();

            $provider->update([
                'rating_avg' => round($avg ?: 0, 1),
                'review_count' => $count,
            ]);
        }
    }
}
