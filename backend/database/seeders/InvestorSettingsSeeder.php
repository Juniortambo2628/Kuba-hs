<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvestorSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'investor_hero_title',
                'value' => 'Scaling the Future of Home Services.',
                'label' => 'Investor Hero Title',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Main headline on the investor page'
            ],
            [
                'key' => 'investor_hero_subtitle',
                'value' => 'Join us in transforming how millions of homeowners connect with verified professionals. Kuba is building the digital infrastructure for the global service economy.',
                'label' => 'Investor Hero Subtitle',
                'type' => 'textarea',
                'group' => 'investor_page',
                'description' => 'Sub-headline on the investor page'
            ],
            [
                'key' => 'investor_thesis_title',
                'value' => 'Our Investment Thesis',
                'label' => 'Thesis Title',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Title for the investment thesis section'
            ],
            [
                'key' => 'investor_thesis_body',
                'value' => "The home service industry remains one of the last analog frontiers. With over \$600B in annual spend in the US alone, the shift toward verified, on-demand marketplaces is accelerating.",
                'label' => 'Thesis Body',
                'type' => 'textarea',
                'group' => 'investor_page',
                'description' => 'Body text for the investment thesis'
            ],
            [
                'key' => 'investor_bg_image',
                'value' => '',
                'label' => 'Investor Page BG',
                'type' => 'image',
                'group' => 'investor_page',
                'description' => 'Background image for the investor hero section'
            ],
            [
                'key' => 'investor_metric_users',
                'value' => '250K+',
                'label' => 'Metric: Active Users',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Value for active users metric'
            ],
            [
                'key' => 'investor_metric_revenue',
                'value' => '$1.2M',
                'label' => 'Metric: Monthly Revenue',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Value for monthly revenue metric'
            ],
            [
                'key' => 'investor_metric_reach',
                'value' => '12 Countries',
                'label' => 'Metric: Market Reach',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Value for market reach metric'
            ],
            [
                'key' => 'investor_metric_growth',
                'value' => '340%',
                'label' => 'Metric: YoY Growth',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Value for Year-over-Year growth metric'
            ],
            [
                'key' => 'investor_thesis_points',
                'value' => "Verified professional network using proprietary trust scoring\nAutomated dispatching and dynamic pricing engines\nUnified financial layer for payments and escrow\nHyper-local expansion model with high operational efficiency",
                'label' => 'Thesis Points',
                'type' => 'textarea',
                'group' => 'investor_page',
                'description' => 'Newline-separated list of investment thesis points'
            ],
            [
                'key' => 'investor_series_b_title',
                'value' => 'Series B in Progress',
                'label' => 'Series B Title',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Title for the investment stage box'
            ],
            [
                'key' => 'investor_series_b_body',
                'value' => 'We are currently entertaining interest for our Series B funding round. Focusing on market expansion and AI-driven service matching.',
                'label' => 'Series B Body',
                'type' => 'textarea',
                'group' => 'investor_page',
                'description' => 'Body text for the investment stage box'
            ],
            [
                'key' => 'investor_series_b_footer',
                'value' => 'Quarterly Report 2024 Available',
                'label' => 'Series B Footer Link',
                'type' => 'text',
                'group' => 'investor_page',
                'description' => 'Text for the call to action in the investment stage box'
            ],
        ];

        foreach ($settings as $setting) {
            \App\Models\SiteSetting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
