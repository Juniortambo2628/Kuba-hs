<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $updates = [
            'corp_cta_primary' => ['from' => 'Get started', 'to' => 'Request quote', 'label' => 'Landing — Businesses request quote CTA'],
            'corp_video_label' => ['from' => 'Watch how it works', 'to' => 'Read more', 'label' => 'Landing — Businesses read more CTA (legacy key)'],
        ];

        foreach ($updates as $key => $cfg) {
            $row = DB::table('site_settings')->where('key', $key)->first();
            if ($row) {
                $patch = ['label' => $cfg['label'], 'updated_at' => now()];
                if ($row->value === $cfg['from']) {
                    $patch['value'] = $cfg['to'];
                }
                DB::table('site_settings')->where('key', $key)->update($patch);
            }
        }

        $newKeys = [
            [
                'key' => 'corp_cta_secondary',
                'value' => 'Read more',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses read more CTA',
                'type' => 'text',
            ],
            [
                'key' => 'corp_read_more_href',
                'value' => '/commercial',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses read more URL',
                'type' => 'text',
            ],
        ];

        foreach ($newKeys as $row) {
            if (DB::table('site_settings')->where('key', $row['key'])->exists()) {
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
        DB::table('site_settings')->whereIn('key', ['corp_cta_secondary', 'corp_read_more_href'])->delete();
    }
};
