<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageFeature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PageFeatureController extends Controller
{
    public function index() {
        return response()->json(PageFeature::orderBy('order_index')->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'page_name' => 'required|string',
            'section_name' => 'required|string',
            'title' => 'required|string',
            'subtitle' => 'nullable|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'image_url' => 'nullable|string',
            'metadata' => 'nullable|array',
            'order_index' => 'integer',
            'is_active' => 'boolean',
        ]);

        $feature = PageFeature::create($validated);
        Cache::forget('api_page_features_all');

        return response()->json($feature, 201);

    }

    public function show(PageFeature $pageFeature) {
        return response()->json($pageFeature);
    }

    public function update(Request $request, PageFeature $pageFeature) {
        $validated = $request->validate([
            'page_name' => 'sometimes|required|string',
            'section_name' => 'sometimes|required|string',
            'title' => 'sometimes|required|string',
            'subtitle' => 'nullable|string',
            'description' => 'sometimes|required|string',
            'icon' => 'nullable|string',
            'image_url' => 'nullable|string',
            'metadata' => 'nullable|array',
            'order_index' => 'integer',
            'is_active' => 'boolean',
        ]);

        $pageFeature->update($validated);
        Cache::forget('api_page_features_all');

        return response()->json($pageFeature);

    }

    public function destroy(PageFeature $pageFeature) {
        $pageFeature->delete();
        Cache::forget('api_page_features_all');

        return response()->json(['message' => 'Feature deleted successfully.']);
    }
}
