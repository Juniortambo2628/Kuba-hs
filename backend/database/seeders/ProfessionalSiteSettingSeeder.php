<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class ProfessionalSiteSettingSeeder extends Seeder
{
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

            // About Section
            ['key' => 'about_title', 'value' => 'The smartest way to hire local professionals.', 'group' => 'about', 'label' => 'Section Title', 'type' => 'text'],
            ['key' => 'about_description_1', 'value' => 'Three simple steps to get expert help for your home. No endless phone calls, no uncertainty.', 'group' => 'about', 'label' => 'Summary Paragraph', 'type' => 'textarea'],
            
            // Social Media
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/kuba', 'group' => 'social', 'label' => 'Facebook URL', 'type' => 'text'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/kuba', 'group' => 'social', 'label' => 'Instagram URL', 'type' => 'text'],

            // System Config (The missing ones from screenshot)
            ['key' => 'APP_NAME', 'value' => 'KUBA HOME SERVICES', 'group' => 'system', 'label' => 'App Name', 'type' => 'text'],
            ['key' => 'SUPPORT_EMAIL', 'value' => 'support@kuba.co.ke', 'group' => 'system', 'label' => 'Support Email', 'type' => 'text'],
            ['key' => 'FORCE_TLS', 'value' => '1', 'group' => 'system', 'label' => 'Force SSL/TLS', 'type' => 'text'],
            ['key' => 'DEBUG_MODE', 'value' => '0', 'group' => 'system', 'label' => 'Debug Mode', 'type' => 'text'],
            ['key' => 'PAYSTACK_PUBLIC_KEY', 'value' => '', 'group' => 'payment', 'label' => 'Paystack Public Key', 'type' => 'text'],
            ['key' => 'PAYSTACK_SECRET_KEY', 'value' => '', 'group' => 'payment', 'label' => 'Paystack Secret Key', 'type' => 'text'],
            ['key' => 'PAYSTACK_PAYMENT_URL', 'value' => 'https://api.paystack.co', 'group' => 'payment', 'label' => 'Paystack URL', 'type' => 'text'],

            // How We Operate — Step Images (Landing Page)
            ['key' => 'step_1_image', 'value' => 'https://images.unsplash.com/photo-1590400813936-cefaef6c8ac5?q=80&w=800&auto=format&fit=crop', 'group' => 'about_page', 'label' => 'Step 1 Image — Tell Us What You Need', 'type' => 'image'],
            ['key' => 'step_2_image', 'value' => 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop', 'group' => 'about_page', 'label' => 'Step 2 Image — Choose a Time', 'type' => 'image'],
            ['key' => 'step_3_image', 'value' => 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop', 'group' => 'about_page', 'label' => 'Step 3 Image — We Handle the Rest', 'type' => 'image'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
