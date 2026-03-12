<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        return Inertia::render('Blog/Index', [
            'posts' => BlogPost::published()->with('author')->latest()->paginate(9)
        ]);
    }

    public function show($slug)
    {
        $post = BlogPost::published()->with('author')->where('slug', $slug)->firstOrFail();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'recentPosts' => BlogPost::published()->where('id', '!=', $post->id)->latest()->take(3)->get()
        ]);
    }
}
