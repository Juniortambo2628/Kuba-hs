<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('custom_quotes', 'source')) {
            Schema::table('custom_quotes', function (Blueprint $table) {
                $table->string('source', 64)->nullable()->after('organization_type');
            });
        }

        $settings = [
            [
                'key' => 'corp_banner_headline',
                'value' => 'One platform for every service your business needs',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses banner headline',
                'type' => 'text',
            ],
            [
                'key' => 'corp_banner_body',
                'value' => 'Consolidated billing, dedicated account support, and vetted professionals for offices, retail, and multi-site teams.',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses banner description',
                'type' => 'textarea',
            ],
            [
                'key' => 'corp_cta_primary',
                'value' => 'Get started',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses primary CTA label',
                'type' => 'text',
            ],
            [
                'key' => 'corp_video_label',
                'value' => 'Watch how it works',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses secondary link label',
                'type' => 'text',
            ],
            [
                'key' => 'corp_video_href',
                'value' => '/commercial',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses secondary link URL',
                'type' => 'text',
            ],
            [
                'key' => 'corp_request_modal_title',
                'value' => 'Request a business plan',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses request modal title',
                'type' => 'text',
            ],
            [
                'key' => 'corp_request_modal_desc',
                'value' => 'Tell us about your organization and we will design a service package with consolidated billing and dedicated support.',
                'group' => 'market_narratives',
                'label' => 'Landing — Businesses request modal description',
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
                'id' => (string) Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('custom_quotes', 'source')) {
            Schema::table('custom_quotes', function (Blueprint $table) {
                $table->dropColumn('source');
            });
        }

        DB::table('site_settings')->whereIn('key', [
            'corp_banner_headline',
            'corp_banner_body',
            'corp_cta_primary',
            'corp_video_label',
            'corp_video_href',
            'corp_request_modal_title',
            'corp_request_modal_desc',
        ])->delete();
    }
};
