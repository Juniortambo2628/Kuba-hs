<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'categories' => ServiceCategory::with('services')->orderBy('name')->get()
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
            $validated['image_url'] = $request->file('image')->store('category_images', 'public');
        }

        $category = ServiceCategory::create($validated);
        $category->load('services');

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category
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
            // Optionally delete old image
            if ($category->image_url && \Storage::disk('public')->exists($category->image_url)) {
                \Storage::disk('public')->delete($category->image_url);
            }
            $validated['image_url'] = $request->file('image')->store('category_images', 'public');
        }

        $category->update($validated);
        $category->load('services');

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category
        ]);
    }

    public function destroy(ServiceCategory $category)
    {
        $category->services()->delete(); // Clean up orphans
        $category->delete();
        
        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
