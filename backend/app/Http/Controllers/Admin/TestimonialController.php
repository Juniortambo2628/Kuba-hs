<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(Testimonial::orderBy('order')->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_role' => 'nullable|string|max:255',
            'content' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'image_url' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $testimonial = Testimonial::create($validated);
        return response()->json($testimonial, 201);
    }

    public function show(Testimonial $testimonial)
    {
        return response()->json($testimonial);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'client_name' => 'sometimes|required|string|max:255',
            'client_role' => 'nullable|string|max:255',
            'content' => 'sometimes|required|string',
            'rating' => 'integer|min:1|max:5',
            'image_url' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $testimonial->update($validated);
        return response()->json($testimonial);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:testimonials,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            Testimonial::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }
}
