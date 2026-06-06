<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Http\Resources\SiteSettingResource;
use App\Services\ImageOptimizationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function index()
    {
        $formattedSettings = \Illuminate\Support\Facades\Cache::rememberForever('cms_settings_global', function () {
            $settings = SiteSetting::orderBy('group')->get()->groupBy('group');

            $formatted = [];
            foreach ($settings as $group => $items) {
                $formatted[$group] = SiteSettingResource::collection($items);
            }
            return $formatted;
        });

        return response()->json([
            'settings' => $formattedSettings,
            'metadata' => [
                'environment' => config('app.env'),
                'version' => '1.2.5-stable',
                'maintenance_mode' => app()->isDownForMaintenance(),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:site_settings,id',
            'settings.*.value' => 'nullable|string|max:50000',
            'settings.*.file' => 'nullable|file|mimes:jpg,jpeg,png,svg,webp|max:20480',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['settings'] as $item) {
                    $setting = SiteSetting::find($item['id']);
                    
                    if ($setting->type === 'image' && isset($item['file'])) {
                        $setting->clearMediaCollection('site_settings');
                        $media = $setting->addMedia($item['file'])->toMediaCollection('site_settings');
                        app(ImageOptimizationService::class)->optimizeMedia(
                            $media,
                            ImageOptimizationService::PRESET_CMS
                        );
                        $setting->update(['value' => $item['value'] ?? $setting->value]);
                    } else {
                        $setting->update(['value' => $item['value'] ?? '']);
                    }
                }
            });

            Cache::forget('cms_settings_global');

            return response()->json([
                'success' => true,
                'message' => 'Platform configurations synchronized successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
