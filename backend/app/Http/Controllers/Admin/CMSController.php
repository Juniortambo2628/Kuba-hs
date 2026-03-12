<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Http\Resources\SiteSettingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CMSController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::orderBy('group')->get()->groupBy('group');

        $formattedSettings = [];
        foreach ($settings as $group => $items) {
            $formattedSettings[$group] = SiteSettingResource::collection($items);
        }

        return response()->json([
            'settings' => $formattedSettings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:site_settings,id',
            'settings.*.value' => 'nullable|string|max:10000',
            'settings.*.file' => 'nullable|file|mimes:jpg,jpeg,png,svg,webp|max:10240',
        ]);

        try {
            \Log::info('CMS Update Attempt', ['settings_count' => count($validated['settings'])]);
            
            DB::transaction(function () use ($validated) {
                foreach ($validated['settings'] as $index => $item) {
                    if (!isset($item['value']) && !isset($item['file'])) {
                        \Log::warning("CMS Item at index {$index} missing both value and file", ['item' => $item]);
                    }
                    
                    $setting = SiteSetting::find($item['id']);
                    
                    if ($setting->type === 'image' && isset($item['file'])) {
                        $setting->clearMediaCollection('site_settings');
                        $setting->addMedia($item['file'])->toMediaCollection('site_settings');
                        // For images, we only update the value if provided, otherwise keep existing
                        $setting->update(['value' => $item['value'] ?? $setting->value]);
                    } else {
                        // For other types, use the provided value or default to empty string
                        $setting->update(['value' => $item['value'] ?? '']);
                    }
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Platform environment synchronized successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
