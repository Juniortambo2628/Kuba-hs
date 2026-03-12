<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service created successfully.',
            'service' => $service
        ], 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service updated successfully.',
            'service' => $service
        ]);
    }

    public function destroy(Service $service)
    {
        // Prevent deleting if providers are offering it in the real world
        if ($service->providers()->exists()) {
            return response()->json(['message' => 'Cannot delete service that is currently offered by providers.'], 400);
        }

        $service->delete();
        
        return response()->json(['message' => 'Service deleted successfully.']);
    }
}
