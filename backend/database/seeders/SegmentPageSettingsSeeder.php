<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SegmentPageSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Commercial Page
            ['key' => 'hero_badge', 'value' => 'Kuba Business Solutions', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'Hero Badge'],
            ['key' => 'hero_title', 'value' => 'Services for Modern Organizations', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'Hero Title'],
            ['key' => 'hero_subtitle', 'value' => 'From facility management to staff wellness, Kuba supports your business operations with verified professionals and consolidated management.', 'type' => 'textarea', 'group' => 'commercial_page', 'label' => 'Hero Subtitle'],
            ['key' => 'value_prop_1_title', 'value' => 'Consolidated Billing', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'Value Prop 1 Title'],
            ['key' => 'value_prop_1_desc', 'value' => 'One monthly invoice for all services booked across your company locations.', 'type' => 'textarea', 'group' => 'commercial_page', 'label' => 'Value Prop 1 Description'],
            ['key' => 'value_prop_2_title', 'value' => 'Account Manager', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'Value Prop 2 Title'],
            ['key' => 'value_prop_2_desc', 'value' => 'A dedicated point of contact to handle all your scheduling and custom requests.', 'type' => 'textarea', 'group' => 'commercial_page', 'label' => 'Value Prop 2 Description'],
            ['key' => 'value_prop_3_title', 'value' => 'Compliance Ready', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'Value Prop 3 Title'],
            ['key' => 'value_prop_3_desc', 'value' => 'Fully insured and vetted professionals meeting your corporate safety standards.', 'type' => 'textarea', 'group' => 'commercial_page', 'label' => 'Value Prop 3 Description'],
            ['key' => 'categories_title', 'value' => 'Commercial Service Categories', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'Categories Title'],
            ['key' => 'categories_subtitle', 'value' => 'Tailored solutions for every industry vertical.', 'type' => 'textarea', 'group' => 'commercial_page', 'label' => 'Categories Subtitle'],
            ['key' => 'cta_title', 'value' => 'Need a customized service package?', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'CTA Title'],
            ['key' => 'cta_subtitle', 'value' => 'Our team can design a bespoke solution that fits your specific business requirements and budget.', 'type' => 'textarea', 'group' => 'commercial_page', 'label' => 'CTA Subtitle'],
            ['key' => 'cta_contact', 'value' => 'or call +254 700 000 000', 'type' => 'text', 'group' => 'commercial_page', 'label' => 'CTA Contact Info'],

            // Cooperative Page
            ['key' => 'hero_badge', 'value' => 'KUBA COOPERATIVES & GROUPS', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'Hero Badge'],
            ['key' => 'hero_title', 'value' => 'Community Centered & Scalable Solutions', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'Hero Title'],
            ['key' => 'hero_subtitle', 'value' => 'Serving multiple members under one structure. Kuba empowers cooperatives with negotiated rates and community-driven service allocation.', 'type' => 'textarea', 'group' => 'cooperative_page', 'label' => 'Hero Subtitle'],
            ['key' => 'value_prop_1_title', 'value' => 'Scalable Infrastructure', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'Value Prop 1 Title'],
            ['key' => 'value_prop_1_desc', 'value' => 'Easily onboard hundreds of members into professional home service programs.', 'type' => 'textarea', 'group' => 'cooperative_page', 'label' => 'Value Prop 1 Description'],
            ['key' => 'value_prop_2_title', 'value' => 'Community Focused', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'Value Prop 2 Title'],
            ['key' => 'value_prop_2_desc', 'value' => 'Shared goals and negotiated group rates that benefit every individual member.', 'type' => 'textarea', 'group' => 'cooperative_page', 'label' => 'Value Prop 2 Description'],
            ['key' => 'value_prop_3_title', 'value' => 'Efficient Deployment', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'Value Prop 3 Title'],
            ['key' => 'value_prop_3_desc', 'value' => 'Coordinated service delivery to maximize coverage across member locations.', 'type' => 'textarea', 'group' => 'cooperative_page', 'label' => 'Value Prop 3 Description'],
            ['key' => 'categories_title', 'value' => 'Cooperative Service Layers', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'Categories Title'],
            ['key' => 'categories_subtitle', 'value' => "Built to grow with your community's needs.", 'type' => 'textarea', 'group' => 'cooperative_page', 'label' => 'Categories Subtitle'],
            ['key' => 'cta_title', 'value' => 'Empower your group with Kuba.', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'CTA Title'],
            ['key' => 'cta_subtitle', 'value' => 'From apartment clusters to large cooperative unions, we provide the service infrastructure your members deserve.', 'type' => 'textarea', 'group' => 'cooperative_page', 'label' => 'CTA Subtitle'],
            ['key' => 'cta_footer', 'value' => 'Custom member portal available', 'type' => 'text', 'group' => 'cooperative_page', 'label' => 'CTA Footer Text'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key'], 'group' => $setting['group']],
                $setting
            );
        }
    }
}
