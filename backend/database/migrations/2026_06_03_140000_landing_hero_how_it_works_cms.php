<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            [
                'key' => 'hero_eyebrow',
                'value' => 'Verified professionals across Kenya',
                'group' => 'home_hero',
                'label' => 'Hero eyebrow (line above headline)',
                'type' => 'text',
            ],
            [
                'key' => 'hero_headline',
                'value' => 'Expert services for your home',
                'group' => 'home_hero',
                'label' => 'Hero headline (main title)',
                'type' => 'text',
            ],
            [
                'key' => 'hero_stat_value',
                'value' => '500+',
                'group' => 'home_hero',
                'label' => 'Hero stat value (e.g. provider count)',
                'type' => 'text',
            ],
            [
                'key' => 'hero_stat_label',
                'value' => 'Trusted pros near you',
                'group' => 'home_hero',
                'label' => 'Hero stat label',
                'type' => 'text',
            ],
            [
                'key' => 'hero_search_service_label',
                'value' => 'Service',
                'group' => 'home_hero',
                'label' => 'Search bar — service label',
                'type' => 'text',
            ],
            [
                'key' => 'hero_search_location_label',
                'value' => 'Location',
                'group' => 'home_hero',
                'label' => 'Search bar — location label',
                'type' => 'text',
            ],
            [
                'key' => 'hero_search_date_label',
                'value' => 'Date',
                'group' => 'home_hero',
                'label' => 'Search bar — date label',
                'type' => 'text',
            ],
            [
                'key' => 'how_eyebrow',
                'value' => 'How it works',
                'group' => 'about_page',
                'label' => 'How it works — eyebrow',
                'type' => 'text',
            ],
            [
                'key' => 'how_headline',
                'value' => 'Experience that grows with your scale',
                'group' => 'about_page',
                'label' => 'How it works — main headline',
                'type' => 'text',
            ],
            [
                'key' => 'how_intro',
                'value' => 'Book trusted home professionals in a few taps — from one-off repairs to ongoing care for your property.',
                'group' => 'about_page',
                'label' => 'How it works — side description',
                'type' => 'textarea',
            ],
        ];

        foreach ($settings as $row) {
            if (DB::table('site_settings')->where('key', $row['key'])->exists()) {
                DB::table('site_settings')->where('key', $row['key'])->update([
                    'label' => $row['label'],
                    'group' => $row['group'],
                ]);
                continue;
            }
            DB::table('site_settings')->insert(array_merge($row, [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Keep legacy hero_title in sync for older templates
        $headline = DB::table('site_settings')->where('key', 'hero_headline')->value('value');
        if ($headline && DB::table('site_settings')->where('key', 'hero_title')->exists()) {
            DB::table('site_settings')->where('key', 'hero_title')->update(['value' => $headline]);
        }

    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', [
            'hero_eyebrow',
            'hero_headline',
            'hero_stat_value',
            'hero_stat_label',
            'hero_search_service_label',
            'hero_search_location_label',
            'hero_search_date_label',
            'how_eyebrow',
            'how_headline',
            'how_intro',
        ])->delete();
    }
};
