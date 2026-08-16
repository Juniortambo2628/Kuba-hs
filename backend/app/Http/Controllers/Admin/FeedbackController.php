<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request) {
        $query = Review::with(['customer', 'booking.service', 'booking.provider.user']);

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($sub) use ($search) {
                        $sub->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        $paginated = $query->latest()->paginate(15)->withQueryString();

        return response()->json([
            'data' => ReviewResource::collection($paginated->items())->resolve(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'stats' => [
                'total' => Review::count(),
                'avg' => round(Review::avg('rating') ?: 0, 1),
                'poor_ratings' => Review::where('rating', '<=', 2)->count(),
            ],
        ]);
    }

    public function show($id) {
        $feedback = Review::with(['customer', 'booking.service', 'booking.provider.user'])->findOrFail($id);

        return response()->json([
            'data' => new ReviewResource($feedback),
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'status' => 'required|in:'.implode(',', array_column(ReviewStatus::cases(), 'value')),
        ]);

        $feedback = Review::findOrFail($id);
        $feedback->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Feedback status updated successfully',
            'data' => new ReviewResource($feedback),
        ]);
    }

    public function destroy($id) {
        $feedback = Review::findOrFail($id);
        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully',
        ]);
    }
}
