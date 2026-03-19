<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class LandingPageSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Stats
            ['key' => 'hero_title', 'value' => 'Everything You Need. One Platform.', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Title'],
            ['key' => 'hero_subtitle', 'value' => 'Kuba connects you with verified service providers for all your home, personal, and professional needs in Nairobi.', 'type' => 'textarea', 'group' => 'hero', 'label' => 'Hero Subtitle'],
            ['key' => 'stat_1_label', 'value' => 'Verified Providers', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 1 Label'],
            ['key' => 'stat_1_value', 'value' => '500+', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 1 Value'],
            ['key' => 'stat_2_label', 'value' => 'Cities Covered', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 2 Label'],
            ['key' => 'stat_2_value', 'value' => '10+', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 2 Value'],
            ['key' => 'stat_3_label', 'value' => 'Support Available', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 3 Label'],
            ['key' => 'stat_3_value', 'value' => '24/7', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 3 Value'],
            ['key' => 'stat_4_label', 'value' => 'Happy Customers', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 4 Label'],
            ['key' => 'stat_4_value', 'value' => '10k+', 'type' => 'text', 'group' => 'stats', 'label' => 'Stat 4 Value'],

            // About Steps
            ['key' => 'step_1_title', 'value' => 'Verified Providers', 'type' => 'text', 'group' => 'about', 'label' => 'Why Kuba 1 Title'],
            ['key' => 'step_1_description', 'value' => 'Every professional on our platform goes through a thorough verification process including identity checks and background screening.', 'type' => 'textarea', 'group' => 'about', 'label' => 'Why Kuba 1 Description'],
            ['key' => 'step_2_title', 'value' => 'Secure Payments', 'type' => 'text', 'group' => 'about', 'label' => 'Why Kuba 2 Title'],
            ['key' => 'step_2_description', 'value' => 'All payments are processed through approved Kuba payment systems, ensuring your money is safe and secure.', 'type' => 'textarea', 'group' => 'about', 'label' => 'Why Kuba 2 Description'],
            ['key' => 'step_3_title', 'value' => 'On-Demand Booking', 'type' => 'text', 'group' => 'about', 'label' => 'Why Kuba 3 Title'],
            ['key' => 'step_3_description', 'value' => 'Select an available time slot and book your service professional directly through our platform in seconds.', 'type' => 'textarea', 'group' => 'about', 'label' => 'Why Kuba 3 Description'],
            ['key' => 'step_4_title', 'value' => 'Transparent Pricing', 'type' => 'text', 'group' => 'about', 'label' => 'Why Kuba 4 Title'],
            ['key' => 'step_4_description', 'value' => 'Know the cost upfront before you commit. No hidden fees or surprises after the job is completed.', 'type' => 'textarea', 'group' => 'about', 'label' => 'Why Kuba 4 Description'],

            // FAQ
            ['key' => 'faq_1_q', 'value' => 'How do I book a service on KUBA?', 'type' => 'text', 'group' => 'faq', 'label' => 'FAQ 1 Question'],
            ['key' => 'faq_1_a', 'value' => 'Simply search for the service you need, browse verified professionals, select a time slot that works for you, and confirm your booking. You\'ll receive an instant confirmation email with all the details.', 'type' => 'textarea', 'group' => 'faq', 'label' => 'FAQ 1 Answer'],
            ['key' => 'faq_2_q', 'value' => 'Are all service providers verified?', 'type' => 'text', 'group' => 'faq', 'label' => 'FAQ 2 Question'],
            ['key' => 'faq_2_a', 'value' => 'Yes! Every professional on our platform goes through a thorough verification process including identity checks, background screening, and skills assessment. We also monitor ongoing reviews to maintain quality standards.', 'type' => 'textarea', 'group' => 'faq', 'label' => 'FAQ 2 Answer'],

            // CTA
            ['key' => 'cta_title', 'value' => 'Ready to find a professional?', 'type' => 'text', 'group' => 'cta', 'label' => 'CTA Title'],
            ['key' => 'cta_description', 'value' => 'Join thousands of happy customers who have already found reliable help through KUBA.', 'type' => 'textarea', 'group' => 'cta', 'label' => 'CTA Description'],

            // Testimonials
            ['key' => 'test_1_name', 'value' => 'Sarah Jenkins', 'type' => 'text', 'group' => 'testimonials', 'label' => 'Testimonial 1 Name'],
            ['key' => 'test_1_role', 'value' => 'Homeowner', 'type' => 'text', 'group' => 'testimonials', 'label' => 'Testimonial 1 Role'],
            ['key' => 'test_1_content', 'value' => '"I found an amazing electrician through KUBA within minutes. The service was professional, and the price was transparent. Highly recommended for anyone looking for reliable help!"', 'type' => 'textarea', 'group' => 'testimonials', 'label' => 'Testimonial 1 Content'],
            ['key' => 'test_1_avatar', 'value' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop', 'type' => 'image', 'group' => 'testimonials', 'label' => 'Testimonial 1 Avatar'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
