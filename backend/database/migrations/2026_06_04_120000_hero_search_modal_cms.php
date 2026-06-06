<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            [
                'key' => 'search_modal_title',
                'value' => 'Find Professionals',
                'group' => 'home_hero',
                'label' => 'Search modal — title (screen reader)',
                'type' => 'text',
            ],
            [
                'key' => 'search_modal_description',
                'value' => 'Search verified experts and book the right pro for your home.',
                'group' => 'home_hero',
                'label' => 'Search modal — description',
                'type' => 'textarea',
            ],
            [
                'key' => 'search_modal_query_placeholder',
                'value' => 'What service do you need?',
                'group' => 'home_hero',
                'label' => 'Search modal — main search placeholder',
                'type' => 'text',
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
                'id' => (string) Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', [
            'search_modal_title',
            'search_modal_description',
            'search_modal_query_placeholder',
        ])->delete();
    }
};
