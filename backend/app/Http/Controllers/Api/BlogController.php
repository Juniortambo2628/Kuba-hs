<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of published blog posts.
     */
    public function index(Request $request) {
        $query = BlogPost::where('is_published', true)
            ->with(['author:id,name,avatar_url'])
            ->orderByDesc('created_at');

        // Optional search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Display the specified published blog post by slug.
     */
    public function show($slug) {
        $post = BlogPost::where('slug', $slug)
            ->where('is_published', true)
            ->with(['author:id,name,avatar_url'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $post,
        ]);
    }
}
