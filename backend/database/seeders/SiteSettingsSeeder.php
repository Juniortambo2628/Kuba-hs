<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Branding
            ['key' => 'site_name', 'value' => 'Kuba', 'group' => 'branding', 'label' => 'Site Name', 'type' => 'text'],
            ['key' => 'site_description', 'value' => 'Premier Home Services Marketplace', 'group' => 'branding', 'label' => 'Site Description', 'type' => 'textarea'],
            ['key' => 'site_logo', 'value' => null, 'group' => 'branding', 'label' => 'Primary Logo', 'type' => 'image'],

            // Hero Section
            ['key' => 'hero_title', 'value' => 'Expert Services for Your Home, Simply Delivered', 'group' => 'hero', 'label' => 'Hero Title', 'type' => 'text'],
            ['key' => 'hero_subtitle', 'value' => 'Find trusted professionals for cleaning, repair, and more. Quality guaranteed.', 'group' => 'hero', 'label' => 'Hero Subtitle', 'type' => 'textarea'],
            ['key' => 'hero_button_text', 'value' => 'Get Started', 'group' => 'hero', 'label' => 'Button Text', 'type' => 'text'],
            ['key' => 'hero_bg', 'value' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', 'group' => 'hero', 'label' => 'Hero Background', 'type' => 'image'],

            // About Section (How It Works)
            ['key' => 'about_title', 'value' => 'The smartest way to hire local professionals.', 'group' => 'about', 'label' => 'Section Title', 'type' => 'text'],
            ['key' => 'about_description_1', 'value' => 'Three simple steps to get expert help for your home. No endless phone calls, no uncertainty.', 'group' => 'about', 'label' => 'Summary Paragraph', 'type' => 'textarea'],
            
            // Social Media
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/kuba', 'group' => 'social', 'label' => 'Facebook URL', 'type' => 'text'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/kuba', 'group' => 'social', 'label' => 'Instagram URL', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
