<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            // Impact metrics (Stats) section headings
            [
                'key' => 'stats_badge',
                'value' => 'Trust & Scale',
                'group' => 'site_stats',
                'label' => 'Stats section — badge',
                'type' => 'text',
            ],
            [
                'key' => 'stats_title',
                'value' => 'Why Thousands Trust KUBA',
                'group' => 'site_stats',
                'label' => 'Stats section — headline (last word is gradient)',
                'type' => 'text',
            ],
            [
                'key' => 'stats_subtitle',
                'value' => 'We are building the largest network of trusted home service providers.',
                'group' => 'site_stats',
                'label' => 'Stats section — subtitle',
                'type' => 'textarea',
            ],

            // Landing section headings (shared group)
            [
                'key' => 'categories_badge',
                'value' => 'Categories',
                'group' => 'landing_sections',
                'label' => 'Categories carousel — badge',
                'type' => 'text',
            ],
            [
                'key' => 'categories_title',
                'value' => 'Explore service categories',
                'group' => 'landing_sections',
                'label' => 'Categories carousel — headline (last word is gradient)',
                'type' => 'text',
            ],
            [
                'key' => 'categories_subtitle',
                'value' => 'Swipe through categories and jump straight into the services you need.',
                'group' => 'landing_sections',
                'label' => 'Categories carousel — subtitle',
                'type' => 'textarea',
            ],
            [
                'key' => 'services_badge',
                'value' => 'New Services',
                'group' => 'landing_sections',
                'label' => 'Featured services — badge',
                'type' => 'text',
            ],
            [
                'key' => 'services_title',
                'value' => 'Just Added',
                'group' => 'landing_sections',
                'label' => 'Featured services — headline (last word is gradient)',
                'type' => 'text',
            ],
            [
                'key' => 'services_subtitle',
                'value' => 'Check out these new services from our top-rated pros.',
                'group' => 'landing_sections',
                'label' => 'Featured services — subtitle',
                'type' => 'textarea',
            ],
            [
                'key' => 'providers_badge',
                'value' => 'Top Rated Pros',
                'group' => 'landing_sections',
                'label' => 'Featured providers — badge',
                'type' => 'text',
            ],
            [
                'key' => 'providers_title',
                'value' => 'Featured Professionals',
                'group' => 'landing_sections',
                'label' => 'Featured providers — headline (last word is gradient)',
                'type' => 'text',
            ],
            [
                'key' => 'providers_subtitle',
                'value' => 'Book trusted, verified and highly-rated professionals for your home service needs.',
                'group' => 'landing_sections',
                'label' => 'Featured providers — subtitle',
                'type' => 'textarea',
            ],
            [
                'key' => 'testimonials_badge',
                'value' => 'Testimonials',
                'group' => 'landing_sections',
                'label' => 'Testimonials — badge',
                'type' => 'text',
            ],
            [
                'key' => 'testimonials_title',
                'value' => 'Loved by customers',
                'group' => 'landing_sections',
                'label' => 'Testimonials — headline (last word is gradient)',
                'type' => 'text',
            ],
            [
                'key' => 'testimonials_subtitle',
                'value' => "Don't just take our word for it. Here's what people are saying about their experience with KUBA professionals.",
                'group' => 'landing_sections',
                'label' => 'Testimonials — subtitle',
                'type' => 'textarea',
            ],
            [
                'key' => 'faq_badge',
                'value' => 'Got Questions?',
                'group' => 'landing_sections',
                'label' => 'FAQ section — badge',
                'type' => 'text',
            ],
            [
                'key' => 'faq_title',
                'value' => 'Frequently Asked Questions',
                'group' => 'landing_sections',
                'label' => 'FAQ section — headline (last word is gradient)',
                'type' => 'text',
            ],
            [
                'key' => 'faq_subtitle',
                'value' => "Everything you need to know about KUBA. Can't find an answer? Contact our support team anytime.",
                'group' => 'landing_sections',
                'label' => 'FAQ section — subtitle',
                'type' => 'textarea',
            ],

            // How it works CTA
            [
                'key' => 'how_cta_label',
                'value' => 'Browse services',
                'group' => 'about_page',
                'label' => 'How it works — CTA button label',
                'type' => 'text',
            ],
            [
                'key' => 'how_cta_url',
                'value' => '/services',
                'group' => 'about_page',
                'label' => 'How it works — CTA link path',
                'type' => 'text',
            ],

            // CTA block (align with seeder cta group)
            [
                'key' => 'cta_badge',
                'value' => 'Get Started Today',
                'group' => 'cta',
                'label' => 'Bottom CTA — badge',
                'type' => 'text',
            ],
            [
                'key' => 'cta_primary_label',
                'value' => 'Browse Services',
                'group' => 'cta',
                'label' => 'Bottom CTA — primary button',
                'type' => 'text',
            ],
            [
                'key' => 'cta_secondary_label',
                'value' => 'Join as a Pro',
                'group' => 'cta',
                'label' => 'Bottom CTA — secondary button',
                'type' => 'text',
            ],
        ];

        foreach ($settings as $row) {
            if (DB::table('site_settings')->where('key', $row['key'])->exists()) {
                DB::table('site_settings')->where('key', $row['key'])->update([
                    'label' => $row['label'],
                    'group' => $row['group'],
                ]);
                continue;
            }
            DB::table('site_settings')->insert(array_merge($row, [
                'id' => (string) Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Normalize legacy stat groups → site_stats
        DB::table('site_settings')
            ->where('group', 'stats')
            ->whereIn('key', ['stat_1_label', 'stat_1_value', 'stat_2_label', 'stat_2_value', 'stat_3_label', 'stat_3_value', 'stat_4_label', 'stat_4_value'])
            ->update(['group' => 'site_stats']);

        // Align step description keys used on the landing About section
        foreach (['1', '2', '3'] as $n) {
            $legacy = DB::table('site_settings')->where('key', "step_{$n}_description")->first();
            if ($legacy && ! DB::table('site_settings')->where('key', "step_{$n}_desc")->exists()) {
                DB::table('site_settings')->insert([
                    'id' => (string) Str::uuid(),
                    'key' => "step_{$n}_desc",
                    'value' => $legacy->value,
                    'group' => 'about_page',
                    'label' => "How it works — step {$n} description",
                    'type' => 'textarea',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', [
            'stats_badge',
            'stats_title',
            'stats_subtitle',
            'categories_badge',
            'categories_title',
            'categories_subtitle',
            'services_badge',
            'services_title',
            'services_subtitle',
            'providers_badge',
            'providers_title',
            'providers_subtitle',
            'testimonials_badge',
            'testimonials_title',
            'testimonials_subtitle',
            'faq_badge',
            'faq_title',
            'faq_subtitle',
            'how_cta_label',
            'how_cta_url',
            'cta_badge',
            'cta_primary_label',
            'cta_secondary_label',
        ])->delete();
    }
};
