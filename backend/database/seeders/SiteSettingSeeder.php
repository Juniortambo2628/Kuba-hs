<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'KUBA', 'type' => 'text', 'group' => 'general', 'label' => 'Site Name'],
            ['key' => 'site_description', 'value' => 'Premier Home Services Marketplace', 'type' => 'textarea', 'group' => 'general', 'label' => 'Site Description'],
            ['key' => 'site_logo', 'value' => null, 'type' => 'image', 'group' => 'general', 'label' => 'Primary Logo'],
            ['key' => 'contact_phone', 'value' => '+254 700 000 000', 'type' => 'text', 'group' => 'general', 'label' => 'Contact Phone'],
            ['key' => 'contact_email', 'value' => 'support@kuba.co.ke', 'type' => 'text', 'group' => 'general', 'label' => 'Contact Email'],
            ['key' => 'contact_address', 'value' => 'Kuba Plaza, Westlands, Nairobi, Kenya', 'type' => 'text', 'group' => 'general', 'label' => 'Contact Address'],
            ['key' => 'opening_hours_short', 'value' => 'MON - FRI: 8:00 - 18:00', 'type' => 'text', 'group' => 'general', 'label' => 'Opening Hours (Short)'],
            ['key' => 'opening_hours_weekday', 'value' => 'Mon - Fri: 8:00am - 06:00pm', 'type' => 'text', 'group' => 'general', 'label' => 'Opening Hours (Weekday)'],
            ['key' => 'opening_hours_weekend', 'value' => 'Sat - Sun: 9:00am - 04:00pm', 'type' => 'text', 'group' => 'general', 'label' => 'Opening Hours (Weekend)'],
            
            // Social
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/kuba_kenya', 'type' => 'link', 'group' => 'social', 'label' => 'Facebook URL'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/kuba_kenya', 'type' => 'link', 'group' => 'social', 'label' => 'Twitter URL'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/kuba_kenya', 'type' => 'link', 'group' => 'social', 'label' => 'Instagram URL'],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/kuba_kenya', 'type' => 'link', 'group' => 'social', 'label' => 'LinkedIn URL'],

            // Hero
            ['key' => 'hero_subtitle', 'value' => 'Welcome to KUBA Kenya', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Subtitle'],
            ['key' => 'hero_title', 'value' => 'The #1 Professional Home Services Marketplace in Nairobi', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Title'],
            ['key' => 'hero_button_text', 'value' => 'Get Started', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Button Text'],
            ['key' => 'hero_bg', 'value' => '/assets/zogin/img/hero/hero-1.jpg', 'type' => 'image', 'group' => 'hero', 'label' => 'Hero Background Image'],

            // About
            ['key' => 'about_title', 'value' => 'Connecting Nairobi to Trusted Pros', 'type' => 'text', 'group' => 'about', 'label' => 'About Title'],
            ['key' => 'about_subtitle', 'value' => '"Your Home, Kenya\'s Pride."', 'type' => 'text', 'group' => 'about', 'label' => 'About Subtitle'],
            ['key' => 'about_description_1', 'value' => 'KUBA is Nairobi\'s premier destination for finding trusted home service professionals. From electrical repairs to deep cleaning, we connect you with local experts who care about your home as much as you do.', 'type' => 'textarea', 'group' => 'about', 'label' => 'About Description 1'],
            ['key' => 'about_description_2', 'value' => 'Our platform ensures safety, quality, and convenience. Every provider in Kenya is vetted, and every service is backed by our KUBA Guarantee. Experience the ease of managing your home services with a single, intuitive platform.', 'type' => 'textarea', 'group' => 'about', 'label' => 'About Description 2'],
            ['key' => 'about_image_1', 'value' => '/assets/zogin/img/about/about-1.jpg', 'type' => 'image', 'group' => 'about', 'label' => 'About Image 1'],
            ['key' => 'about_image_2', 'value' => '/assets/zogin/img/about/about-2.jpg', 'type' => 'image', 'group' => 'about', 'label' => 'About Image 2'],
            ['key' => 'about_image_3', 'value' => '/assets/zogin/img/about/about-3.jpg', 'type' => 'image', 'group' => 'about', 'label' => 'About Image 3'],

            ['key' => 'featured_title', 'value' => 'Featured Nairobi Services', 'type' => 'text', 'group' => 'sections', 'label' => 'Featured Services Title'],
            ['key' => 'featured_subtitle', 'value' => 'Expertly provided home services across Nairobi.', 'type' => 'text', 'group' => 'sections', 'label' => 'Featured Services Subtitle'],
            ['key' => 'provider_title', 'value' => 'Meet Nairobi\'s Top Pros', 'type' => 'text', 'group' => 'sections', 'label' => 'Providers Title'],
            ['key' => 'provider_subtitle', 'value' => 'Our highly qualified Kenyan professionals are ready to assist you with precision and care.', 'type' => 'text', 'group' => 'sections', 'label' => 'Providers Subtitle'],

            // Config
            ['key' => 'platform_fee_percentage', 'value' => '10', 'type' => 'text', 'group' => 'config', 'label' => 'Platform Fee Percentage (%)'],
            ['key' => 'min_booking_amount', 'value' => '500', 'type' => 'text', 'group' => 'config', 'label' => 'Minimum Booking Amount (KES)'],

            // Landing Page Stats
            ['key' => 'stat_1_label', 'value' => 'Verified Professionals', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 1 Label'],
            ['key' => 'stat_1_value', 'value' => '500+', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 1 Value'],
            ['key' => 'stat_2_label', 'value' => 'Nairobi Neighborhoods', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 2 Label'],
            ['key' => 'stat_2_value', 'value' => '25+', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 2 Value'],
            ['key' => 'stat_3_label', 'value' => '24/7 Premium Support', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 3 Label'],
            ['key' => 'stat_3_value', 'value' => 'Always Online', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 3 Value'],
            ['key' => 'stat_4_label', 'value' => 'Positive Reviews', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 4 Label'],
            ['key' => 'stat_4_value', 'value' => '12k+', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 4 Value'],
        ];

        foreach ($settings as $setting) {
            \App\Models\SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
