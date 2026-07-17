<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Consolidated seeder for all CMS site settings.
 * Replaces the data-only migrations that previously seeded these values.
 */
class SiteSettingsDataSeeder extends Seeder
{
    public function run(): void
    {
        $settings = array_merge(
            $this->heroImageSettings(),
            $this->heroBadgeSettings(),
            $this->categoryDetailSettings(),
            $this->heroHowItWorksSettings(),
            $this->landingSectionSettings(),
            $this->heroSearchModalSettings(),
            $this->corporateBannerSettings(),
            $this->corporateBannerCtaUpdates(),
            $this->authPageSettings(),
        );

        foreach ($settings as $row) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $row['key']],
                array_merge($row, [
                    'id' => (string) Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }

    private function heroImageSettings(): array
    {
        return [
            ['key' => 'hero_bg_image', 'value' => '', 'type' => 'image', 'group' => 'hero_backgrounds', 'label' => 'Landing Page Hero Image', 'description' => 'Background image for the landing page hero section.'],
            ['key' => 'about_hero_image', 'value' => '', 'type' => 'image', 'group' => 'about', 'label' => 'About Page Hero', 'description' => 'Background image for the About Us page hero section.'],
            ['key' => 'contact_hero_image', 'value' => '', 'type' => 'image', 'group' => 'contact', 'label' => 'Contact Page Hero', 'description' => 'Background image for the Contact page hero section.'],
            ['key' => 'investors_hero_image', 'value' => '', 'type' => 'image', 'group' => 'sections', 'label' => 'Investors Page Hero', 'description' => 'Background image for the Investors page hero section.'],
            ['key' => 'commercial_hero_image', 'value' => '', 'type' => 'image', 'group' => 'sections', 'label' => 'Commercial Page Hero', 'description' => 'Background image for the Commercial page hero section.'],
            ['key' => 'cooperatives_hero_image', 'value' => '', 'type' => 'image', 'group' => 'sections', 'label' => 'Cooperatives Page Hero', 'description' => 'Background image for the Cooperatives page hero section.'],
        ];
    }

    private function heroBadgeSettings(): array
    {
        $pages = [
            'about' => ['badge' => 'Who We Are', 'title' => 'Redefining Service Excellence', 'subtitle' => 'Connecting you with trusted professionals for every home need.'],
            'contact' => ['badge' => 'Get In Touch', 'title' => 'How Can We Help?', 'subtitle' => 'Our support team is here to ensure your experience is seamless.'],
            'services' => ['badge' => 'Our Marketplace', 'title' => 'Expert Services for Your Home', 'subtitle' => 'Browse through verified professionals and book with confidence.'],
            'providers' => ['badge' => 'Verified Professionals', 'title' => 'Find the Best Local Talent', 'subtitle' => 'Top-rated experts ready to handle your home improvement tasks.'],
            'blog' => ['badge' => 'Kuba Journal', 'title' => 'Insights & Inspiration', 'subtitle' => 'Tips, trends, and project guides from our industry experts.'],
            'commercial' => ['badge' => 'Commercial Solutions', 'title' => 'Enterprise Grade Maintenance', 'subtitle' => 'Scalable facilities management for modern businesses.'],
            'cooperatives' => ['badge' => 'Community Co-ops', 'title' => 'Standardized Service Delivery', 'subtitle' => 'Empowering cooperatives with unified maintenance platforms.'],
            'investors' => ['badge' => 'Investor Relations', 'title' => 'Invest in the Future', 'subtitle' => "Join us in scaling Africa's premier digital marketplace."],
        ];

        $settings = [];
        foreach ($pages as $slug => $defaults) {
            $settings[] = ['key' => "{$slug}_hero_badge", 'value' => $defaults['badge'], 'type' => 'text', 'group' => 'hero_media', 'label' => ucfirst($slug) . ' Hero Badge', 'description' => 'Small badge text above the main hero headline.'];
            $settings[] = ['key' => "{$slug}_hero_title", 'value' => $defaults['title'], 'type' => 'text', 'group' => 'hero_media', 'label' => ucfirst($slug) . ' Hero Title', 'description' => 'Main headline for the hero section.'];
            $settings[] = ['key' => "{$slug}_hero_subtitle", 'value' => $defaults['subtitle'], 'type' => 'textarea', 'group' => 'hero_media', 'label' => ucfirst($slug) . ' Hero Subtitle', 'description' => 'Sub-headline text for the hero section.'];
        }
        return $settings;
    }

    private function categoryDetailSettings(): array
    {
        return [
            ['key' => 'category_detail_hero_image', 'value' => null, 'type' => 'image', 'group' => 'hero_backgrounds', 'label' => 'Category Detail View Hero', 'description' => 'The customizable background image for individual service category pages.'],
        ];
    }

    private function heroHowItWorksSettings(): array
    {
        return [
            ['key' => 'hero_eyebrow', 'value' => 'Verified professionals across Kenya', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Hero eyebrow (line above headline)'],
            ['key' => 'hero_headline', 'value' => 'Expert services for your home', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Hero headline (main title)'],
            ['key' => 'hero_stat_value', 'value' => '500+', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Hero stat value (e.g. provider count)'],
            ['key' => 'hero_stat_label', 'value' => 'Trusted pros near you', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Hero stat label'],
            ['key' => 'hero_search_service_label', 'value' => 'Service', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Search bar — service label'],
            ['key' => 'hero_search_location_label', 'value' => 'Location', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Search bar — location label'],
            ['key' => 'hero_search_date_label', 'value' => 'Date', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Search bar — date label'],
            ['key' => 'how_eyebrow', 'value' => 'How it works', 'type' => 'text', 'group' => 'about_page', 'label' => 'How it works — eyebrow'],
            ['key' => 'how_headline', 'value' => 'Experience that grows with your scale', 'type' => 'text', 'group' => 'about_page', 'label' => 'How it works — main headline'],
            ['key' => 'how_intro', 'value' => 'Book trusted home professionals in a few taps — from one-off repairs to ongoing care for your property.', 'type' => 'textarea', 'group' => 'about_page', 'label' => 'How it works — side description'],
        ];
    }

    private function landingSectionSettings(): array
    {
        return [
            ['key' => 'stats_badge', 'value' => 'Trust & Scale', 'type' => 'text', 'group' => 'site_stats', 'label' => 'Stats section — badge'],
            ['key' => 'stats_title', 'value' => 'Why Thousands Trust KUBA', 'type' => 'text', 'group' => 'site_stats', 'label' => 'Stats section — headline (last word is gradient)'],
            ['key' => 'stats_subtitle', 'value' => 'We are building the largest network of trusted home service providers.', 'type' => 'textarea', 'group' => 'site_stats', 'label' => 'Stats section — subtitle'],
            ['key' => 'categories_badge', 'value' => 'Categories', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Categories carousel — badge'],
            ['key' => 'categories_title', 'value' => 'Explore service categories', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Categories carousel — headline (last word is gradient)'],
            ['key' => 'categories_subtitle', 'value' => 'Swipe through categories and jump straight into the services you need.', 'type' => 'textarea', 'group' => 'landing_sections', 'label' => 'Categories carousel — subtitle'],
            ['key' => 'services_badge', 'value' => 'New Services', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Featured services — badge'],
            ['key' => 'services_title', 'value' => 'Just Added', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Featured services — headline (last word is gradient)'],
            ['key' => 'services_subtitle', 'value' => 'Check out these new services from our top-rated pros.', 'type' => 'textarea', 'group' => 'landing_sections', 'label' => 'Featured services — subtitle'],
            ['key' => 'providers_badge', 'value' => 'Top Rated Pros', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Featured providers — badge'],
            ['key' => 'providers_title', 'value' => 'Featured Professionals', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Featured providers — headline (last word is gradient)'],
            ['key' => 'providers_subtitle', 'value' => 'Book trusted, verified and highly-rated professionals for your home service needs.', 'type' => 'textarea', 'group' => 'landing_sections', 'label' => 'Featured providers — subtitle'],
            ['key' => 'testimonials_badge', 'value' => 'Testimonials', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Testimonials — badge'],
            ['key' => 'testimonials_title', 'value' => 'Loved by customers', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'Testimonials — headline (last word is gradient)'],
            ['key' => 'testimonials_subtitle', 'value' => "Don't just take our word for it. Here's what people are saying about their experience with KUBA professionals.", 'type' => 'textarea', 'group' => 'landing_sections', 'label' => 'Testimonials — subtitle'],
            ['key' => 'faq_badge', 'value' => 'Got Questions?', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'FAQ section — badge'],
            ['key' => 'faq_title', 'value' => 'Frequently Asked Questions', 'type' => 'text', 'group' => 'landing_sections', 'label' => 'FAQ section — headline (last word is gradient)'],
            ['key' => 'faq_subtitle', 'value' => "Everything you need to know about KUBA. Can't find an answer? Contact our support team anytime.", 'type' => 'textarea', 'group' => 'landing_sections', 'label' => 'FAQ section — subtitle'],
            ['key' => 'how_cta_label', 'value' => 'Browse services', 'type' => 'text', 'group' => 'about_page', 'label' => 'How it works — CTA button label'],
            ['key' => 'how_cta_url', 'value' => '/services', 'type' => 'text', 'group' => 'about_page', 'label' => 'How it works — CTA link path'],
            ['key' => 'cta_badge', 'value' => 'Get Started Today', 'type' => 'text', 'group' => 'cta', 'label' => 'Bottom CTA — badge'],
            ['key' => 'cta_primary_label', 'value' => 'Browse Services', 'type' => 'text', 'group' => 'cta', 'label' => 'Bottom CTA — primary button'],
            ['key' => 'cta_secondary_label', 'value' => 'Join as a Pro', 'type' => 'text', 'group' => 'cta', 'label' => 'Bottom CTA — secondary button'],
        ];
    }

    private function heroSearchModalSettings(): array
    {
        return [
            ['key' => 'search_modal_title', 'value' => 'Find Professionals', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Search modal — title (screen reader)'],
            ['key' => 'search_modal_description', 'value' => 'Search verified experts and book the right pro for your home.', 'type' => 'textarea', 'group' => 'home_hero', 'label' => 'Search modal — description'],
            ['key' => 'search_modal_query_placeholder', 'value' => 'What service do you need?', 'type' => 'text', 'group' => 'home_hero', 'label' => 'Search modal — main search placeholder'],
        ];
    }

    private function corporateBannerSettings(): array
    {
        return [
            ['key' => 'corp_banner_headline', 'value' => 'One platform for every service your business needs', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses banner headline'],
            ['key' => 'corp_banner_body', 'value' => 'Consolidated billing, dedicated account support, and vetted professionals for offices, retail, and multi-site teams.', 'type' => 'textarea', 'group' => 'market_narratives', 'label' => 'Landing — Businesses banner description'],
            ['key' => 'corp_cta_primary', 'value' => 'Request quote', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses request quote CTA'],
            ['key' => 'corp_video_label', 'value' => 'Read more', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses read more CTA (legacy key)'],
            ['key' => 'corp_video_href', 'value' => '/commercial', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses secondary link URL'],
            ['key' => 'corp_request_modal_title', 'value' => 'Request a business plan', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses request modal title'],
            ['key' => 'corp_request_modal_desc', 'value' => 'Tell us about your organization and we will design a service package with consolidated billing and dedicated support.', 'type' => 'textarea', 'group' => 'market_narratives', 'label' => 'Landing — Businesses request modal description'],
            ['key' => 'corp_cta_secondary', 'value' => 'Read more', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses read more CTA'],
            ['key' => 'corp_read_more_href', 'value' => '/commercial', 'type' => 'text', 'group' => 'market_narratives', 'label' => 'Landing — Businesses read more URL'],
        ];
    }

    private function corporateBannerCtaUpdates(): array
    {
        return [];
    }

    private function authPageSettings(): array
    {
        return [
            ['key' => 'auth_client_login_title', 'value' => 'Welcome to Kuba', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client login — headline'],
            ['key' => 'auth_client_login_subtitle', 'value' => 'Sign in to book trusted home and business services across Kenya.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client login — subtitle'],
            ['key' => 'auth_client_login_submit', 'value' => 'Sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client login — button label'],
            ['key' => 'auth_client_login_footer', 'value' => "Don't have an account?", 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client login — footer prefix'],
            ['key' => 'auth_client_login_footer_link', 'value' => 'Sign up', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client login — footer link text'],
            ['key' => 'auth_client_login_visual_headline', 'value' => 'Trusted pros for every job — book, track, and pay in one place.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client login — visual headline'],
            ['key' => 'auth_client_login_visual_caption', 'value' => 'Verified providers, secure payments, and real-time booking updates on Kuba.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client login — visual caption'],
            ['key' => 'auth_client_login_visual_status', 'value' => 'Booking', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client login — visual status pill'],
            ['key' => 'auth_client_login_visual_image', 'value' => '', 'type' => 'image', 'group' => 'auth_pages', 'label' => 'Client login — visual image'],
            ['key' => 'auth_client_login_social_title', 'value' => 'Join 10k+ customers', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client login — social proof title'],
            ['key' => 'auth_client_login_social_subtitle', 'value' => 'See why households and businesses trust Kuba for everyday services.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client login — social proof subtitle'],
            ['key' => 'auth_client_register_title', 'value' => 'Create your Kuba account', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client register — headline'],
            ['key' => 'auth_client_register_subtitle', 'value' => 'Book verified professionals for home and office services in minutes.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client register — subtitle'],
            ['key' => 'auth_client_register_submit', 'value' => 'Sign up', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client register — button label'],
            ['key' => 'auth_client_register_footer', 'value' => 'Already have an account?', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client register — footer prefix'],
            ['key' => 'auth_client_register_footer_link', 'value' => 'Sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client register — footer link text'],
            ['key' => 'auth_client_register_visual_headline', 'value' => 'Your marketplace for reliable home and business services.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client register — visual headline'],
            ['key' => 'auth_client_register_visual_caption', 'value' => 'Compare pros, message securely, and manage every booking from your dashboard.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client register — visual caption'],
            ['key' => 'auth_client_register_visual_status', 'value' => 'Joining', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client register — visual status pill'],
            ['key' => 'auth_client_register_visual_image', 'value' => '', 'type' => 'image', 'group' => 'auth_pages', 'label' => 'Client register — visual image'],
            ['key' => 'auth_client_register_social_title', 'value' => 'Join 10k+ customers', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Client register — social proof title'],
            ['key' => 'auth_client_register_social_subtitle', 'value' => 'Start booking cleaners, electricians, wellness pros, and more today.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Client register — social proof subtitle'],
            ['key' => 'auth_provider_login_title', 'value' => 'Provider sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider login — headline'],
            ['key' => 'auth_provider_login_subtitle', 'value' => 'Manage bookings, earnings, and your service profile on Kuba.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider login — subtitle'],
            ['key' => 'auth_provider_login_submit', 'value' => 'Sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider login — button label'],
            ['key' => 'auth_provider_login_footer', 'value' => 'New provider?', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider login — footer prefix'],
            ['key' => 'auth_provider_login_footer_link', 'value' => 'Create account', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider login — footer link text'],
            ['key' => 'auth_provider_login_visual_headline', 'value' => 'Grow your business with daily service requests on Kuba.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider login — visual headline'],
            ['key' => 'auth_provider_login_visual_caption', 'value' => 'Track jobs, chat with clients, and get paid when work is complete.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider login — visual caption'],
            ['key' => 'auth_provider_login_visual_status', 'value' => 'Earning', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider login — visual status pill'],
            ['key' => 'auth_provider_login_visual_image', 'value' => '', 'type' => 'image', 'group' => 'auth_pages', 'label' => 'Provider login — visual image'],
            ['key' => 'auth_provider_login_social_title', 'value' => '2,500+ active pros', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider login — social proof title'],
            ['key' => 'auth_provider_login_social_subtitle', 'value' => 'Join verified professionals earning on the Kuba marketplace.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider login — social proof subtitle'],
            ['key' => 'auth_provider_register_title', 'value' => 'Become a Kuba pro', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider register — headline'],
            ['key' => 'auth_provider_register_subtitle', 'value' => 'List your services, receive bookings, and get paid securely.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider register — subtitle'],
            ['key' => 'auth_provider_register_submit', 'value' => 'Sign up', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider register — button label'],
            ['key' => 'auth_provider_register_footer', 'value' => 'Already registered?', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider register — footer prefix'],
            ['key' => 'auth_provider_register_footer_link', 'value' => 'Sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider register — footer link text'],
            ['key' => 'auth_provider_register_visual_headline', 'value' => 'Reach customers looking for your skills every day.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider register — visual headline'],
            ['key' => 'auth_provider_register_visual_caption', 'value' => 'Complete your profile after signup to start accepting bookings.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider register — visual caption'],
            ['key' => 'auth_provider_register_visual_status', 'value' => 'Onboarding', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider register — visual status pill'],
            ['key' => 'auth_provider_register_visual_image', 'value' => '', 'type' => 'image', 'group' => 'auth_pages', 'label' => 'Provider register — visual image'],
            ['key' => 'auth_provider_register_social_title', 'value' => 'Grow with Kuba', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Provider register — social proof title'],
            ['key' => 'auth_provider_register_social_subtitle', 'value' => 'Zero listing fees for your first month when you join today.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Provider register — social proof subtitle'],
            ['key' => 'auth_forgot_title', 'value' => 'Reset your password', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot password — headline'],
            ['key' => 'auth_forgot_subtitle', 'value' => 'Enter the email on your account and we will send you a reset link.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Forgot password — subtitle'],
            ['key' => 'auth_forgot_submit', 'value' => 'Send reset link', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot password — button label'],
            ['key' => 'auth_forgot_footer', 'value' => 'Remember your password?', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot password — footer prefix'],
            ['key' => 'auth_forgot_footer_link', 'value' => 'Back to sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot password — footer link text'],
            ['key' => 'auth_forgot_visual_headline', 'value' => 'Secure access to your Kuba account.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Forgot password — visual headline'],
            ['key' => 'auth_forgot_visual_caption', 'value' => 'Reset links expire after 60 minutes for your security.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Forgot password — visual caption'],
            ['key' => 'auth_forgot_visual_status', 'value' => 'Securing', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Forgot password — visual status pill'],
            ['key' => 'auth_forgot_visual_image', 'value' => '', 'type' => 'image', 'group' => 'auth_pages', 'label' => 'Forgot password — visual image'],
            ['key' => 'auth_reset_title', 'value' => 'Choose a new password', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Reset password — headline'],
            ['key' => 'auth_reset_subtitle', 'value' => 'Enter a strong password you have not used on Kuba before.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Reset password — subtitle'],
            ['key' => 'auth_reset_submit', 'value' => 'Update password', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Reset password — button label'],
            ['key' => 'auth_reset_footer', 'value' => 'Back to', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Reset password — footer prefix'],
            ['key' => 'auth_reset_footer_link', 'value' => 'Sign in', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Reset password — footer link text'],
            ['key' => 'auth_reset_visual_headline', 'value' => 'Almost there — set your new password.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Reset password — visual headline'],
            ['key' => 'auth_reset_visual_caption', 'value' => 'Use at least 8 characters with letters and numbers.', 'type' => 'textarea', 'group' => 'auth_pages', 'label' => 'Reset password — visual caption'],
            ['key' => 'auth_reset_visual_status', 'value' => 'Updating', 'type' => 'text', 'group' => 'auth_pages', 'label' => 'Reset password — visual status pill'],
            ['key' => 'auth_reset_visual_image', 'value' => '', 'type' => 'image', 'group' => 'auth_pages', 'label' => 'Reset password — visual image'],
        ];
    }
}
