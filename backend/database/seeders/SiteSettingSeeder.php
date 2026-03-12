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
            ['key' => 'contact_phone', 'value' => '+1 800-567-8990', 'type' => 'text', 'group' => 'general', 'label' => 'Contact Phone'],
            ['key' => 'contact_email', 'value' => 'office@kuba.com', 'type' => 'text', 'group' => 'general', 'label' => 'Contact Email'],
            ['key' => 'contact_address', 'value' => '828 Granville Lights Suite 466', 'type' => 'text', 'group' => 'general', 'label' => 'Contact Address'],
            ['key' => 'opening_hours_short', 'value' => 'MON - FRI: 9:00 - 19:00', 'type' => 'text', 'group' => 'general', 'label' => 'Opening Hours (Short)'],
            ['key' => 'opening_hours_weekday', 'value' => 'Mon - Fri: 8:00am - 08:00pm', 'type' => 'text', 'group' => 'general', 'label' => 'Opening Hours (Weekday)'],
            ['key' => 'opening_hours_weekend', 'value' => 'Sat - Sun: 9:00am - 06:00pm', 'type' => 'text', 'group' => 'general', 'label' => 'Opening Hours (Weekend)'],
            
            // Social
            ['key' => 'social_facebook', 'value' => '#', 'type' => 'link', 'group' => 'social', 'label' => 'Facebook URL'],
            ['key' => 'social_twitter', 'value' => '#', 'type' => 'link', 'group' => 'social', 'label' => 'Twitter URL'],
            ['key' => 'social_instagram', 'value' => '#', 'type' => 'link', 'group' => 'social', 'label' => 'Instagram URL'],
            ['key' => 'social_linkedin', 'value' => '#', 'type' => 'link', 'group' => 'social', 'label' => 'LinkedIn URL'],

            // Hero
            ['key' => 'hero_subtitle', 'value' => 'Welcome to KUBA', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Subtitle'],
            ['key' => 'hero_title', 'value' => 'What hurts today makes you stronger tomorrow', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Title'],
            ['key' => 'hero_bg', 'value' => '/assets/zogin/img/hero/hero-1.jpg', 'type' => 'image', 'group' => 'hero', 'label' => 'Hero Background Image'],

            // About
            ['key' => 'about_title', 'value' => 'Welcome to KUBA', 'type' => 'text', 'group' => 'about', 'label' => 'About Title'],
            ['key' => 'about_subtitle', 'value' => '"Your Home, Perfectly Managed."', 'type' => 'text', 'group' => 'about', 'label' => 'About Subtitle'],
            ['key' => 'about_description_1', 'value' => 'KUBA is your premier destination for finding trusted home service professionals. From electrical repairs to deep cleaning, we connect you with experts who care about your home as much as you do.', 'type' => 'textarea', 'group' => 'about', 'label' => 'About Description 1'],
            ['key' => 'about_description_2', 'value' => 'Our platform ensures safety, quality, and convenience. Every provider is vetted, and every service is backed by our KUBA Guarantee. Experience the ease of managing your home services with a single, intuitive platform.', 'type' => 'textarea', 'group' => 'about', 'label' => 'About Description 2'],
            ['key' => 'about_image_1', 'value' => '/assets/zogin/img/about/about-1.jpg', 'type' => 'image', 'group' => 'about', 'label' => 'About Image 1'],
            ['key' => 'about_image_2', 'value' => '/assets/zogin/img/about/about-2.jpg', 'type' => 'image', 'group' => 'about', 'label' => 'About Image 2'],
            ['key' => 'about_image_3', 'value' => '/assets/zogin/img/about/about-3.jpg', 'type' => 'image', 'group' => 'about', 'label' => 'About Image 3'],

            // Sections
            ['key' => 'featured_title', 'value' => 'Featured Services', 'type' => 'text', 'group' => 'sections', 'label' => 'Featured Services Title'],
            ['key' => 'featured_subtitle', 'value' => 'Expertly provided home services to make your life easier.', 'type' => 'text', 'group' => 'sections', 'label' => 'Featured Services Subtitle'],
            ['key' => 'gallery_title', 'value' => 'Our Work Gallery', 'type' => 'text', 'group' => 'sections', 'label' => 'Gallery Title'],
            ['key' => 'gallery_subtitle', 'value' => 'A glimpse into the quality of services we provide through our network of experts.', 'type' => 'text', 'group' => 'sections', 'label' => 'Gallery Subtitle'],
            ['key' => 'provider_title', 'value' => 'Meet Top Providers', 'type' => 'text', 'group' => 'sections', 'label' => 'Providers Title'],
            ['key' => 'provider_subtitle', 'value' => 'Our highly qualified professionals are ready to assist you with precision and care.', 'type' => 'text', 'group' => 'sections', 'label' => 'Providers Subtitle'],

            // Config
            ['key' => 'platform_fee_percentage', 'value' => '10', 'type' => 'text', 'group' => 'config', 'label' => 'Platform Fee Percentage (%)'],
            ['key' => 'min_booking_amount', 'value' => '20', 'type' => 'text', 'group' => 'config', 'label' => 'Minimum Booking Amount ($)'],
        ];

        foreach ($settings as $setting) {
            \App\Models\SiteSetting::create($setting);
        }
    }
}
