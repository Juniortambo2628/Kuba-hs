<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'categories' => ServiceCategoryResource::collection(
                ServiceCategory::with('services')->orderBy('name')->get()
            ),
        ]);
    }

    public function show(ServiceCategory $category)
    {
        $category->load('services');

        return response()->json([
            'category' => $category,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string',
        ]);

        
        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->storeCategoryImage($request->file('image'));
        } elseif (!empty($validated['image_url'])) {
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

    public function update(Request $request, ServiceCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string',
        ]);

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
        if (!$imageUrl) {
            return;
        }

        $path = $this->normalizeImagePath($imageUrl);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function destroy(ServiceCategory $category)
    {
        $category->services()->delete(); // Clean up orphans
        $category->delete();
        Cache::forget('api_categories_all');

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
