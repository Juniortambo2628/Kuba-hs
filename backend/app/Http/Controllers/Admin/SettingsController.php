<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return response()->json([
            'settings' => SiteSetting::all()->pluck('value', 'key'),
            'metadata' => [
                'environment' => config('app.env'),
                'version' => '1.2.0-stable',
                'maintenance_mode' => app()->isDownForMaintenance(),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'System configurations updated successfully']);
    }
}
