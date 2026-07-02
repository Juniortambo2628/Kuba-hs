<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Consolidated seeder for all SiteSettings that were previously spread across
 * ~10 data migrations. New installs should run this seeder instead of those migrations.
 *
 * Superseded migrations (already ran on production, kept for reference):
 * - 2026_03_21_075618_add_missing_hero_settings
 * - 2026_03_21_145817_add_hero_badges_to_settings
 * - 2026_03_28_000000_add_category_detail_hero_setting
 * - 2026_06_03_140000_landing_hero_how_it_works_cms
 * - 2026_06_04_100000_landing_sections_cms
 * - 2026_06_04_120000_hero_search_modal_cms
 * - 2026_06_05_120000_corporate_banner_cms_and_quote_source
 * - 2026_06_05_140000_update_corporate_banner_cta_labels
 * - 2026_06_07_100000_auth_pages_cms
 */
class SiteSettingsDataSeeder extends Seeder
{
    public function run(): void
    {
        $settings = $this->getAllSettings();

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }

    private function getAllSettings(): array
    {
        return array_merge(
            $this->heroSettings(),
            $this->heroBadges(),
            $this->heroCategoryDetail(),
            $this->howItWorksSettings(),
            $this->landingSectionsSettings(),
            $this->heroSearchModal(),
            $this->corporateBanner(),
            $this->authPagesSettings(),
        );
    }

    private function heroSettings(): array
    {
        return [
            ['key' => 'hero_headline', 'value' => 'Expert Services for Your Home, Simply Delivered', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Headline'],
            ['key' => 'hero_subheadline', 'value' => 'Find trusted professionals for cleaning, repair, and more. Quality guaranteed.', 'type' => 'textarea', 'group' => 'hero', 'label' => 'Hero Subheadline'],
            ['key' => 'hero_cta_primary', 'value' => 'Get Started', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero CTA Primary'],
            ['key' => 'hero_cta_secondary', 'value' => 'View Services', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero CTA Secondary'],
        ];
    }

    private function heroBadges(): array
    {
        return [
            ['key' => 'hero_badge_1_text', 'value' => 'Verified Professionals', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Badge 1 Text'],
            ['key' => 'hero_badge_1_icon', 'value' => 'shield-check', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Badge 1 Icon'],
            ['key' => 'hero_badge_2_text', 'value' => '24/7 Support', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Badge 2 Text'],
            ['key' => 'hero_badge_2_icon', 'value' => 'headphones', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Badge 2 Icon'],
            ['key' => 'hero_badge_3_text', 'value' => 'Satisfaction Guaranteed', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Badge 3 Text'],
            ['key' => 'hero_badge_3_icon', 'value' => 'thumbs-up', 'type' => 'text', 'group' => 'hero', 'label' => 'Hero Badge 3 Icon'],
        ];
    }

    private function heroCategoryDetail(): array
    {
        return [
            ['key' => 'category_detail_hero_bg', 'value' => null, 'type' => 'image', 'group' => 'category_detail', 'label' => 'Category Detail Hero Background'],
            ['key' => 'category_detail_hero_title', 'value' => 'Browse Our Services', 'type' => 'text', 'group' => 'category_detail', 'label' => 'Category Detail Hero Title'],
            ['key' => 'category_detail_hero_subtitle', 'value' => 'Find the perfect service for your needs', 'type' => 'text', 'group' => 'category_detail', 'label' => 'Category Detail Hero Subtitle'],
        ];
    }

    private function howItWorksSettings(): array
    {
        return [
            ['key' => 'how_it_works_title', 'value' => 'How It Works', 'type' => 'text', 'group' => 'how_it_works', 'label' => 'How It Works Title'],
            ['key' => 'how_it_works_subtitle', 'value' => 'Three simple steps to get expert help', 'type' => 'text', 'group' => 'how_it_works', 'label' => 'How It Works Subtitle'],
            ['key' => 'step_1_title', 'value' => 'Tell Us What You Need', 'type' => 'text', 'group' => 'how_it_works', 'label' => 'Step 1 Title'],
            ['key' => 'step_1_desc', 'value' => 'Describe your service requirement and preferred schedule.', 'type' => 'textarea', 'group' => 'how_it_works', 'label' => 'Step 1 Description'],
            ['key' => 'step_2_title', 'value' => 'Choose a Time', 'type' => 'text', 'group' => 'how_it_works', 'label' => 'Step 2 Title'],
            ['key' => 'step_2_desc', 'value' => 'Select from available time slots that suit your convenience.', 'type' => 'textarea', 'group' => 'how_it_works', 'label' => 'Step 2 Description'],
            ['key' => 'step_3_title', 'value' => 'We Handle the Rest', 'type' => 'text', 'group' => 'how_it_works', 'label' => 'Step 3 Title'],
            ['key' => 'step_3_desc', 'value' => 'A verified professional arrives and gets the job done.', 'type' => 'textarea', 'group' => 'how_it_works', 'label' => 'Step 3 Description'],
        ];
    }

    private function landingSectionsSettings(): array
    {
        return [
            ['key' => 'landing_services_title', 'value' => 'Our Services', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing Services Title'],
            ['key' => 'landing_services_subtitle', 'value' => 'Professional services for every need', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing Services Subtitle'],
            ['key' => 'landing_providers_title', 'value' => 'Top Providers', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing Providers Title'],
            ['key' => 'landing_providers_subtitle', 'value' => 'Meet our verified professionals', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing Providers Subtitle'],
            ['key' => 'landing_cta_title', 'value' => 'Ready to Get Started?', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing CTA Title'],
            ['key' => 'landing_cta_subtitle', 'value' => 'Join thousands of satisfied customers', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing CTA Subtitle'],
            ['key' => 'landing_cta_button', 'value' => 'Book a Service', 'type' => 'text', 'group' => 'landing', 'label' => 'Landing CTA Button'],
        ];
    }

    private function heroSearchModal(): array
    {
        return [
            ['key' => 'search_modal_title', 'value' => 'What service do you need?', 'type' => 'text', 'group' => 'search_modal', 'label' => 'Search Modal Title'],
            ['key' => 'search_modal_placeholder', 'value' => 'Search for services...', 'type' => 'text', 'group' => 'search_modal', 'label' => 'Search Modal Placeholder'],
            ['key' => 'search_modal_popular_title', 'value' => 'Popular Services', 'type' => 'text', 'group' => 'search_modal', 'label' => 'Search Modal Popular Title'],
        ];
    }

    private function corporateBanner(): array
    {
        return [
            ['key' => 'corp_banner_title', 'value' => 'Corporate & Commercial Services', 'type' => 'text', 'group' => 'corporate', 'label' => 'Corporate Banner Title'],
            ['key' => 'corp_banner_subtitle', 'value' => 'Tailored solutions for businesses of all sizes', 'type' => 'textarea', 'group' => 'corporate', 'label' => 'Corporate Banner Subtitle'],
            ['key' => 'corp_cta_primary', 'value' => 'Request a Quote', 'type' => 'text', 'group' => 'corporate', 'label' => 'Corporate CTA Primary'],
            ['key' => 'corp_cta_secondary', 'value' => 'Learn More', 'type' => 'text', 'group' => 'corporate', 'label' => 'Corporate CTA Secondary'],
            ['key' => 'corp_read_more_href', 'value' => '/commercial', 'type' => 'link', 'group' => 'corporate', 'label' => 'Corporate Read More Href'],
        ];
    }

    private function authPagesSettings(): array
    {
        return [
            ['key' => 'auth_login_title', 'value' => 'Welcome Back', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Login Title'],
            ['key' => 'auth_login_subtitle', 'value' => 'Sign in to your account', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Login Subtitle'],
            ['key' => 'auth_register_title', 'value' => 'Create Account', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Register Title'],
            ['key' => 'auth_register_subtitle', 'value' => 'Join our community of homeowners and professionals', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Register Subtitle'],
            ['key' => 'auth_forgot_title', 'value' => 'Reset Password', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot Password Title'],
            ['key' => 'auth_forgot_subtitle', 'value' => 'Enter your email to receive a reset link', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot Password Subtitle'],
        ];
    }
}
