<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(): JsonResponse
    {
        return BlogPostResource::collection(BlogPost::with('author')->latest()->paginate(10));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'image' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.rand(1000, 9999);
        $validated['author_id'] = auth()->id();

        $post = BlogPost::create($validated);

        return new BlogPostResource($post);
    }

    public function show(BlogPost $blogPost): JsonResponse
    {
        return new BlogPostResource($blogPost->load('author'));
    }

    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'image' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        if ($validated['title'] !== $blogPost->title) {
            $validated['slug'] = Str::slug($validated['title']).'-'.rand(1000, 9999);
        }

        $blogPost->update($validated);

        return new BlogPostResource($blogPost);
    }

    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $blogPost->delete();

        return response()->json(['message' => 'Blog post deleted successfully']);
    }
}
