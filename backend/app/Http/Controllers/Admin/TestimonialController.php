<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TestimonialController extends Controller
{
    public function index() {
        $testimonials = Testimonial::orderBy('sort_order')->latest()->paginate(20);

        return response()->json($testimonials);
    }

    public function store(StoreTestimonialRequest $request) {
        $validated = $request->validated();

        $testimonial = Testimonial::create($validated);
        Cache::forget('api_testimonials_all');

        return response()->json($testimonial, 201);

    }

    public function show(Testimonial $testimonial) {
        return response()->json($testimonial);
    }

    public function update(StoreTestimonialRequest $request, Testimonial $testimonial) {
        $validated = $request->validated();

        $testimonial->update($validated);
        Cache::forget('api_testimonials_all');

        return response()->json($testimonial);

    }

    public function destroy(Testimonial $testimonial) {
        $testimonial->delete();
        Cache::forget('api_testimonials_all');

        return response()->json(null, 204);

    }

    public function reorder(Request $request) {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:testimonials,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            Testimonial::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('api_testimonials_all');

        return response()->json(['message' => 'Reordered successfully']);

    }
}
