<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $pages = [
            'about' => ['badge' => 'Who We Are', 'title' => 'Redefining Service Excellence', 'subtitle' => 'Connecting you with trusted professionals for every home need.'],
            'contact' => ['badge' => 'Get In Touch', 'title' => 'How Can We Help?', 'subtitle' => 'Our support team is here to ensure your experience is seamless.'],
            'services' => ['badge' => 'Our Marketplace', 'title' => 'Expert Services for Your Home', 'subtitle' => 'Browse through verified professionals and book with confidence.'],
            'providers' => ['badge' => 'Verified Professionals', 'title' => 'Find the Best Local Talent', 'subtitle' => 'Top-rated experts ready to handle your home improvement tasks.'],
            'blog' => ['badge' => 'Kuba Journal', 'title' => 'Insights & Inspiration', 'subtitle' => 'Tips, trends, and project guides from our industry experts.'],
            'commercial' => ['badge' => 'Commercial Solutions', 'title' => 'Enterprise Grade Maintenance', 'subtitle' => 'Scalable facilities management for modern businesses.'],
            'cooperatives' => ['badge' => 'Community Co-ops', 'title' => 'Standardized Service Delivery', 'subtitle' => 'Empowering cooperatives with unified maintenance platforms.'],
            'investors' => ['badge' => 'Investor Relations', 'title' => 'Invest in the Future', 'subtitle' => 'Join us in scaling Africa\'s premier digital marketplace.'],
        ];

        foreach ($pages as $slug => $defaults) {
            $settings = [
                [
                    'id' => (string) Str::uuid(),
                    'key' => "{$slug}_hero_badge",
                    'value' => $defaults['badge'],
                    'type' => 'text',
                    'group' => 'hero_media',
                    'label' => ucfirst($slug) . ' Hero Badge',
                    'description' => "Small badge text above the main hero headline.",
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'key' => "{$slug}_hero_title",
                    'value' => $defaults['title'],
                    'type' => 'text',
                    'group' => 'hero_media',
                    'label' => ucfirst($slug) . ' Hero Title',
                    'description' => "Main headline for the hero section.",
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'key' => "{$slug}_hero_subtitle",
                    'value' => $defaults['subtitle'],
                    'type' => 'textarea',
                    'group' => 'hero_media',
                    'label' => ucfirst($slug) . ' Hero Subtitle',
                    'description' => "Sub-headline text for the hero section.",
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ];

            foreach ($settings as $setting) {
                DB::table('site_settings')->updateOrInsert(
                    ['key' => $setting['key']],
                    $setting
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            //
        });
    }
};
