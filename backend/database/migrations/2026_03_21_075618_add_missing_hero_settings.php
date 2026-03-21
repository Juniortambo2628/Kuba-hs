<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Rename existing 'hero_bg' to 'hero_bg_image' for consistency
        // If 'hero_bg_image' already exists, we might need to merge or delete the old placeholder
        if (DB::table('site_settings')->where('key', 'hero_bg_image')->exists()) {
            DB::table('site_settings')->where('key', 'hero_bg_image')->delete();
        }

        DB::table('site_settings')
            ->where('key', 'hero_bg')
            ->update(['key' => 'hero_bg_image', 'label' => 'Landing Page Hero Image']);

        // 2. Add missing Hero Background settings
        $newSettings = [
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'key' => 'about_hero_image',
                'value' => '',
                'type' => 'image',
                'group' => 'about',
                'label' => 'About Page Hero',
                'description' => 'Background image for the About Us page hero section.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'key' => 'contact_hero_image',
                'value' => '',
                'type' => 'image',
                'group' => 'contact',
                'label' => 'Contact Page Hero',
                'description' => 'Background image for the Contact page hero section.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'key' => 'investors_hero_image',
                'value' => '',
                'type' => 'image',
                'group' => 'sections',
                'label' => 'Investors Page Hero',
                'description' => 'Background image for the Investors page hero section.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'key' => 'commercial_hero_image',
                'value' => '',
                'type' => 'image',
                'group' => 'sections',
                'label' => 'Commercial Page Hero',
                'description' => 'Background image for the Commercial page hero section.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'key' => 'cooperatives_hero_image',
                'value' => '',
                'type' => 'image',
                'group' => 'sections',
                'label' => 'Cooperatives Page Hero',
                'description' => 'Background image for the Cooperatives page hero section.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($newSettings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('site_settings')
            ->where('key', 'hero_bg_image')
            ->update(['key' => 'hero_bg', 'label' => 'Hero Background Image']);

        DB::table('site_settings')
            ->whereIn('key', [
                'about_hero_image',
                'contact_hero_image',
                'investors_hero_image',
                'commercial_hero_image',
                'cooperatives_hero_image'
            ])
            ->delete();
    }
};
