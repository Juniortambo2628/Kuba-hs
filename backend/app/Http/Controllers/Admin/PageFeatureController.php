<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageFeatureRequest;
use App\Models\PageFeature;

class PageFeatureController extends Controller
{
    public function index() {
        return response()->json(PageFeature::orderBy('sort_order')->get());
    }

    public function store(StorePageFeatureRequest $request) {
        $validated = $request->validated();

        $feature = PageFeature::create($validated);

        return response()->json($feature, 201);

    }

    public function show(PageFeature $pageFeature) {
        return response()->json($pageFeature);
    }

    public function update(StorePageFeatureRequest $request, PageFeature $pageFeature) {
        $validated = $request->validated();

        $pageFeature->update($validated);

        return response()->json($pageFeature);

    }

    public function destroy(PageFeature $pageFeature) {
        $pageFeature->delete();

        return response()->json(['message' => 'Feature deleted successfully.']);
    }
}
