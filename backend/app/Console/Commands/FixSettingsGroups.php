<?php

namespace App\Console\Commands;

use App\Models\SiteSetting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class FixSettingsGroups extends Command
{
    protected $signature = 'settings:fix-groups';

    protected $description = 'Fix legacy CMS setting groups';

    public function handle()
    {
        $settings = [
            ['key' => 'site_name', 'group' => 'identity'],
            ['key' => 'site_description', 'group' => 'identity'],
            ['key' => 'site_logo', 'group' => 'identity'],
            ['key' => 'site_logo_dark', 'group' => 'identity'],
            ['key' => 'favicon', 'group' => 'identity'],
            ['key' => 'admin_logo_light', 'group' => 'identity'],
            ['key' => 'admin_logo_dark', 'group' => 'identity'],
            ['key' => 'hero_title', 'group' => 'hero_text'],
            ['key' => 'hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'hero_bg_image', 'group' => 'hero_backgrounds'],
            ['key' => 'hero_cta_text', 'group' => 'hero_text'],
            ['key' => 'services_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'providers_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'about_hero_title', 'group' => 'hero_text'],
            ['key' => 'about_hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'about_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'about_content', 'group' => 'about_page'],
            ['key' => 'step_1_image', 'group' => 'about_page'],
            ['key' => 'step_2_image', 'group' => 'about_page'],
            ['key' => 'step_3_image', 'group' => 'about_page'],
            ['key' => 'contact_hero_title', 'group' => 'hero_text'],
            ['key' => 'contact_hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'support_email', 'group' => 'support_info'],
            ['key' => 'support_phone', 'group' => 'support_info'],
            ['key' => 'office_address', 'group' => 'support_info'],
            ['key' => 'investors_hero_title', 'group' => 'hero_text'],
            ['key' => 'investors_hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'investors_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'commercial_hero_title', 'group' => 'hero_text'],
            ['key' => 'commercial_hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'commercial_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'commercial_thesis_title', 'group' => 'market_narratives'],
            ['key' => 'commercial_thesis_body', 'group' => 'market_narratives'],
            ['key' => 'cooperatives_hero_title', 'group' => 'hero_text'],
            ['key' => 'cooperatives_hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'cooperatives_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'cooperatives_thesis_title', 'group' => 'market_narratives'],
            ['key' => 'cooperatives_thesis_body', 'group' => 'market_narratives'],
            ['key' => 'blog_hero_title', 'group' => 'hero_text'],
            ['key' => 'blog_hero_subtitle', 'group' => 'hero_text'],
            ['key' => 'journal_hero_image', 'group' => 'hero_backgrounds'],
            ['key' => 'journal_thesis_title', 'group' => 'market_narratives'],
            ['key' => 'journal_thesis_body', 'group' => 'market_narratives'],
            ['key' => 'terms_of_service_url', 'group' => 'support_info'],
            ['key' => 'privacy_policy_url', 'group' => 'support_info'],
            ['key' => 'platform_fee_percent', 'group' => 'financial_config'],
            ['key' => 'currency_code', 'group' => 'financial_config'],
            ['key' => 'min_payout_amount', 'group' => 'financial_config'],
            ['key' => 'social_facebook', 'group' => 'social_links'],
            ['key' => 'social_instagram', 'group' => 'social_links'],
            ['key' => 'social_twitter', 'group' => 'social_links'],
            ['key' => 'social_linkedin', 'group' => 'social_links'],
            ['key' => 'main_navigation', 'group' => 'navigation_menu'],
        ];

        foreach ($settings as $s) {
            SiteSetting::where('key', $s['key'])->update(['group' => $s['group']]);
        }

        Cache::forget('cms_settings_global');
        $this->info('Settings groups updated successfully and cache cleared.');
    }
}
