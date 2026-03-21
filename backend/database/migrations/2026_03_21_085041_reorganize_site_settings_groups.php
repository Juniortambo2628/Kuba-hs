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
        $mappings = [
            'branding' => 'identity',
            'hero' => 'home_hero',
            'config' => 'support_info',
            'contact' => 'support_info',
            'payment' => 'financial_config',
            'sections' => 'market_narratives',
            'social' => 'social_links',
            'stats' => 'site_stats',
            'about' => 'about_page',
        ];

        foreach ($mappings as $old => $new) {
            DB::table('site_settings')->where('group', $old)->update(['group' => $new]);
        }

        // Move all hero-specific image assets to a dedicated 'hero_media' group
        DB::table('site_settings')
            ->where('type', 'image')
            ->where('key', 'like', '%_hero_image%')
            ->orWhere('key', 'hero_bg_image')
            ->update(['group' => 'hero_media']);

        // Explicitly move financial settings that might have been in 'config'
        DB::table('site_settings')
            ->whereIn('key', ['platform_fee_percentage', 'min_booking_amount', 'platform_fee_percent', 'currency_code', 'min_payout_amount'])
            ->update(['group' => 'financial_config']);
            
        // Move common site info to 'support_info'
        DB::table('site_settings')
            ->whereIn('key', ['support_email', 'support_phone', 'office_address'])
            ->update(['group' => 'support_info']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No simple way to reverse dynamic remapping perfectly without hardcoding every ID,
        // but we can restore the main ones if needed.
    }
};
