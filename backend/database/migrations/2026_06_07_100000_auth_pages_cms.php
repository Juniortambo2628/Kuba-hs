<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $rows = [
            // ── Client login ──
            ['key' => 'auth_client_login_title', 'value' => 'Welcome to Kuba', 'label' => 'Client login — headline', 'type' => 'text'],
            ['key' => 'auth_client_login_subtitle', 'value' => 'Sign in to book trusted home and business services across Kenya.', 'label' => 'Client login — subtitle', 'type' => 'textarea'],
            ['key' => 'auth_client_login_submit', 'value' => 'Sign in', 'label' => 'Client login — button label', 'type' => 'text'],
            ['key' => 'auth_client_login_footer', 'value' => "Don't have an account?", 'label' => 'Client login — footer prefix', 'type' => 'text'],
            ['key' => 'auth_client_login_footer_link', 'value' => 'Sign up', 'label' => 'Client login — footer link text', 'type' => 'text'],
            ['key' => 'auth_client_login_visual_headline', 'value' => 'Trusted pros for every job — book, track, and pay in one place.', 'label' => 'Client login — visual headline', 'type' => 'textarea'],
            ['key' => 'auth_client_login_visual_caption', 'value' => 'Verified providers, secure payments, and real-time booking updates on Kuba.', 'label' => 'Client login — visual caption', 'type' => 'textarea'],
            ['key' => 'auth_client_login_visual_status', 'value' => 'Booking', 'label' => 'Client login — visual status pill', 'type' => 'text'],
            ['key' => 'auth_client_login_visual_image', 'value' => '', 'label' => 'Client login — visual image', 'type' => 'image'],
            ['key' => 'auth_client_login_social_title', 'value' => 'Join 10k+ customers', 'label' => 'Client login — social proof title', 'type' => 'text'],
            ['key' => 'auth_client_login_social_subtitle', 'value' => 'See why households and businesses trust Kuba for everyday services.', 'label' => 'Client login — social proof subtitle', 'type' => 'textarea'],

            // ── Client register ──
            ['key' => 'auth_client_register_title', 'value' => 'Create your Kuba account', 'label' => 'Client register — headline', 'type' => 'text'],
            ['key' => 'auth_client_register_subtitle', 'value' => 'Book verified professionals for home and office services in minutes.', 'label' => 'Client register — subtitle', 'type' => 'textarea'],
            ['key' => 'auth_client_register_submit', 'value' => 'Sign up', 'label' => 'Client register — button label', 'type' => 'text'],
            ['key' => 'auth_client_register_footer', 'value' => 'Already have an account?', 'label' => 'Client register — footer prefix', 'type' => 'text'],
            ['key' => 'auth_client_register_footer_link', 'value' => 'Sign in', 'label' => 'Client register — footer link text', 'type' => 'text'],
            ['key' => 'auth_client_register_visual_headline', 'value' => 'Your marketplace for reliable home and business services.', 'label' => 'Client register — visual headline', 'type' => 'textarea'],
            ['key' => 'auth_client_register_visual_caption', 'value' => 'Compare pros, message securely, and manage every booking from your dashboard.', 'label' => 'Client register — visual caption', 'type' => 'textarea'],
            ['key' => 'auth_client_register_visual_status', 'value' => 'Joining', 'label' => 'Client register — visual status pill', 'type' => 'text'],
            ['key' => 'auth_client_register_visual_image', 'value' => '', 'label' => 'Client register — visual image', 'type' => 'image'],
            ['key' => 'auth_client_register_social_title', 'value' => 'Join 10k+ customers', 'label' => 'Client register — social proof title', 'type' => 'text'],
            ['key' => 'auth_client_register_social_subtitle', 'value' => 'Start booking cleaners, electricians, wellness pros, and more today.', 'label' => 'Client register — social proof subtitle', 'type' => 'textarea'],

            // ── Provider login ──
            ['key' => 'auth_provider_login_title', 'value' => 'Provider sign in', 'label' => 'Provider login — headline', 'type' => 'text'],
            ['key' => 'auth_provider_login_subtitle', 'value' => 'Manage bookings, earnings, and your service profile on Kuba.', 'label' => 'Provider login — subtitle', 'type' => 'textarea'],
            ['key' => 'auth_provider_login_submit', 'value' => 'Sign in', 'label' => 'Provider login — button label', 'type' => 'text'],
            ['key' => 'auth_provider_login_footer', 'value' => 'New provider?', 'label' => 'Provider login — footer prefix', 'type' => 'text'],
            ['key' => 'auth_provider_login_footer_link', 'value' => 'Create account', 'label' => 'Provider login — footer link text', 'type' => 'text'],
            ['key' => 'auth_provider_login_visual_headline', 'value' => 'Grow your business with daily service requests on Kuba.', 'label' => 'Provider login — visual headline', 'type' => 'textarea'],
            ['key' => 'auth_provider_login_visual_caption', 'value' => 'Track jobs, chat with clients, and get paid when work is complete.', 'label' => 'Provider login — visual caption', 'type' => 'textarea'],
            ['key' => 'auth_provider_login_visual_status', 'value' => 'Earning', 'label' => 'Provider login — visual status pill', 'type' => 'text'],
            ['key' => 'auth_provider_login_visual_image', 'value' => '', 'label' => 'Provider login — visual image', 'type' => 'image'],
            ['key' => 'auth_provider_login_social_title', 'value' => '2,500+ active pros', 'label' => 'Provider login — social proof title', 'type' => 'text'],
            ['key' => 'auth_provider_login_social_subtitle', 'value' => 'Join verified professionals earning on the Kuba marketplace.', 'label' => 'Provider login — social proof subtitle', 'type' => 'textarea'],

            // ── Provider register ──
            ['key' => 'auth_provider_register_title', 'value' => 'Become a Kuba pro', 'label' => 'Provider register — headline', 'type' => 'text'],
            ['key' => 'auth_provider_register_subtitle', 'value' => 'List your services, receive bookings, and get paid securely.', 'label' => 'Provider register — subtitle', 'type' => 'textarea'],
            ['key' => 'auth_provider_register_submit', 'value' => 'Sign up', 'label' => 'Provider register — button label', 'type' => 'text'],
            ['key' => 'auth_provider_register_footer', 'value' => 'Already registered?', 'label' => 'Provider register — footer prefix', 'type' => 'text'],
            ['key' => 'auth_provider_register_footer_link', 'value' => 'Sign in', 'label' => 'Provider register — footer link text', 'type' => 'text'],
            ['key' => 'auth_provider_register_visual_headline', 'value' => 'Reach customers looking for your skills every day.', 'label' => 'Provider register — visual headline', 'type' => 'textarea'],
            ['key' => 'auth_provider_register_visual_caption', 'value' => 'Complete your profile after signup to start accepting bookings.', 'label' => 'Provider register — visual caption', 'type' => 'textarea'],
            ['key' => 'auth_provider_register_visual_status', 'value' => 'Onboarding', 'label' => 'Provider register — visual status pill', 'type' => 'text'],
            ['key' => 'auth_provider_register_visual_image', 'value' => '', 'label' => 'Provider register — visual image', 'type' => 'image'],
            ['key' => 'auth_provider_register_social_title', 'value' => 'Grow with Kuba', 'label' => 'Provider register — social proof title', 'type' => 'text'],
            ['key' => 'auth_provider_register_social_subtitle', 'value' => 'Zero listing fees for your first month when you join today.', 'label' => 'Provider register — social proof subtitle', 'type' => 'textarea'],

            // ── Forgot password ──
            ['key' => 'auth_forgot_title', 'value' => 'Reset your password', 'label' => 'Forgot password — headline', 'type' => 'text'],
            ['key' => 'auth_forgot_subtitle', 'value' => 'Enter the email on your account and we will send you a reset link.', 'label' => 'Forgot password — subtitle', 'type' => 'textarea'],
            ['key' => 'auth_forgot_submit', 'value' => 'Send reset link', 'label' => 'Forgot password — button label', 'type' => 'text'],
            ['key' => 'auth_forgot_footer', 'value' => 'Remember your password?', 'label' => 'Forgot password — footer prefix', 'type' => 'text'],
            ['key' => 'auth_forgot_footer_link', 'value' => 'Back to sign in', 'label' => 'Forgot password — footer link text', 'type' => 'text'],
            ['key' => 'auth_forgot_visual_headline', 'value' => 'Secure access to your Kuba account.', 'label' => 'Forgot password — visual headline', 'type' => 'textarea'],
            ['key' => 'auth_forgot_visual_caption', 'value' => 'Reset links expire after 60 minutes for your security.', 'label' => 'Forgot password — visual caption', 'type' => 'textarea'],
            ['key' => 'auth_forgot_visual_status', 'value' => 'Securing', 'label' => 'Forgot password — visual status pill', 'type' => 'text'],
            ['key' => 'auth_forgot_visual_image', 'value' => '', 'label' => 'Forgot password — visual image', 'type' => 'image'],

            // ── Reset password ──
            ['key' => 'auth_reset_title', 'value' => 'Choose a new password', 'label' => 'Reset password — headline', 'type' => 'text'],
            ['key' => 'auth_reset_subtitle', 'value' => 'Enter a strong password you have not used on Kuba before.', 'label' => 'Reset password — subtitle', 'type' => 'textarea'],
            ['key' => 'auth_reset_submit', 'value' => 'Update password', 'label' => 'Reset password — button label', 'type' => 'text'],
            ['key' => 'auth_reset_footer', 'value' => 'Back to', 'label' => 'Reset password — footer prefix', 'type' => 'text'],
            ['key' => 'auth_reset_footer_link', 'value' => 'Sign in', 'label' => 'Reset password — footer link text', 'type' => 'text'],
            ['key' => 'auth_reset_visual_headline', 'value' => 'Almost there — set your new password.', 'label' => 'Reset password — visual headline', 'type' => 'textarea'],
            ['key' => 'auth_reset_visual_caption', 'value' => 'Use at least 8 characters with letters and numbers.', 'label' => 'Reset password — visual caption', 'type' => 'textarea'],
            ['key' => 'auth_reset_visual_status', 'value' => 'Updating', 'label' => 'Reset password — visual status pill', 'type' => 'text'],
            ['key' => 'auth_reset_visual_image', 'value' => '', 'label' => 'Reset password — visual image', 'type' => 'image'],
        ];

        foreach ($rows as $row) {
            if (DB::table('site_settings')->where('key', $row['key'])->exists()) {
                continue;
            }
            DB::table('site_settings')->insert([
                'id' => (string) Str::uuid(),
                'key' => $row['key'],
                'value' => $row['value'],
                'group' => 'auth_pages',
                'label' => $row['label'],
                'type' => $row['type'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('site_settings')->where('group', 'auth_pages')->delete();
    }
};
