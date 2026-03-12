<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['customer', 'booking.service', 'booking.provider.user']);

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($sub) use ($search) {
                      $sub->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json([
            'data' => ReviewResource::collection($query->latest()->paginate(15)->withQueryString()),
            'stats' => [
                'total' => Review::count(),
                'avg' => round(Review::avg('rating') ?: 0, 1),
                'poor_ratings' => Review::where('rating', '<=', 2)->count(),
            ]
        ]);
    }
}
