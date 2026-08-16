<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index() {
        return response()->json([
            'categories' => ServiceCategoryResource::collection(
                ServiceCategory::with('services')->orderBy('name')->get()
            ),
        ]);
    }

    public function show(ServiceCategory $category) {
        $category->load('services');

        return response()->json([
            'category' => $category,
        ]);
    }

    public function store(StoreCategoryRequest $request) {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->storeCategoryImage($request->file('image'));
        } elseif (! empty($validated['image_url'])) {
            $validated['image_url'] = $this->normalizeImagePath($validated['image_url']);
        }

        unset($validated['image']);
        $category = ServiceCategory::create($validated);
        $category->load('services');
        Cache::forget('api_categories_all');

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => new ServiceCategoryResource($category),
        ], 201);
    }

    public function update(StoreCategoryRequest $request, ServiceCategory $category) {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $this->deleteCategoryImage($category->image_url);
            $validated['image_url'] = $this->storeCategoryImage($request->file('image'));
        } elseif (array_key_exists('image_url', $validated)) {
            if (empty($validated['image_url'])) {
                $this->deleteCategoryImage($category->image_url);
            } else {
                $validated['image_url'] = $this->normalizeImagePath($validated['image_url']);
            }
        }

        unset($validated['image']);
        $category->update($validated);
        $category->load('services');
        Cache::forget('api_categories_all');

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => new ServiceCategoryResource($category),
        ]);
    }

    private function storeCategoryImage($file): string
    {
        return app(\App\Services\ImageOptimizationService::class)->storeAndOptimize(
            $file,
            'category_images',
            'public',
            \App\Services\ImageOptimizationService::PRESET_CATEGORY
        );
    }

    private function normalizeImagePath(string $value): string
    {
        $value = trim($value);
        if (str_starts_with($value, '/storage/')) {
            return ltrim(str_replace('/storage/', '', $value), '/');
        }

        return $value;
    }

    private function deleteCategoryImage(?string $imageUrl): void
    {
        if (! $imageUrl) {
            return;
        }

        $path = $this->normalizeImagePath($imageUrl);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function destroy(ServiceCategory $category) {
        // Clean up provider_services for all services in this category
        $serviceIds = $category->services()->pluck('id');
        \App\Models\ProviderService::whereIn('service_id', $serviceIds)->delete();

        $category->services()->delete();
        $category->delete();
        Cache::forget('api_categories_all');

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
