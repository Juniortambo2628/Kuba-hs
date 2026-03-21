<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PageFeature;

class PageFeatureSeeder extends Seeder
{
    public function run(): void
    {
        PageFeature::truncate();

        $features = [
            // About Page - Values
            [
                'page_name' => 'about',
                'section_name' => 'values',
                'title' => 'Quality First',
                'description' => 'We vet every provider to ensure only the highest standards of service for your home.',
                'icon' => 'Trophy',
                'metadata' => ['color' => 'text-yellow-500', 'bg' => 'bg-yellow-500/10'],
                'order_index' => 1,
            ],
            [
                'page_name' => 'about',
                'section_name' => 'values',
                'title' => 'Full Transparency',
                'description' => 'Upfront pricing and clear communication between providers and customers.',
                'icon' => 'Gem',
                'metadata' => ['color' => 'text-purple-500', 'bg' => 'bg-purple-500/10'],
                'order_index' => 2,
            ],
            [
                'page_name' => 'about',
                'section_name' => 'values',
                'title' => 'Safety Guaranteed',
                'description' => 'Your security is paramount. Every transaction and provider is monitored for safety.',
                'icon' => 'Shield',
                'metadata' => ['color' => 'text-blue-500', 'bg' => 'bg-blue-500/10'],
                'order_index' => 3,
            ],

            // Commercial Page - Categories
            [
                'page_name' => 'commercial',
                'section_name' => 'categories',
                'title' => 'Facility Management',
                'description' => 'End-to-end maintenance for offices, retail spaces, and warehouses.',
                'icon' => 'Building2',
                'metadata' => ['features' => ['Janitorial Services', 'HVAC Maintenance', 'Security Systems', 'Plumbing & Electrical']],
                'order_index' => 1,
            ],
            [
                'page_name' => 'commercial',
                'section_name' => 'categories',
                'title' => 'Staff Wellness',
                'description' => 'On-site wellness programs to boost employee morale and productivity.',
                'icon' => 'Heart',
                'metadata' => ['features' => ['Office Massage', 'Fitness Training', 'Mental Health Support', 'Ergonomics Consulting']],
                'order_index' => 2,
            ],
            [
                'page_name' => 'commercial',
                'section_name' => 'categories',
                'title' => 'Bulk Operations',
                'description' => 'High-volume services for large-scale properties or scheduled fleets.',
                'icon' => 'Zap',
                'metadata' => ['features' => ['Fleet Cleaning', 'Bulk Laundry', 'Periodic Pesticide', 'Relocation Support']],
                'order_index' => 3,
            ],

            // Cooperatives Page - Categories
            [
                'page_name' => 'cooperatives',
                'section_name' => 'categories',
                'title' => 'Community Services',
                'description' => 'Shared services for gated communities, apartments, and cooperatives.',
                'icon' => 'Users',
                'metadata' => ['features' => ['Common Area Cleaning', 'Estate Maintenance', 'Group Security', 'Solar Maintenance']],
                'order_index' => 1,
            ],
            [
                'page_name' => 'cooperatives',
                'section_name' => 'categories',
                'title' => 'Member Welfare',
                'description' => 'Scalable wellness and personal packages for cooperative members.',
                'icon' => 'Heart',
                'metadata' => ['features' => ['Mobile Health Clinics', 'Home Grooming Sets', 'Childcare Clusters', 'Elderly Support']],
                'order_index' => 2,
            ],
            [
                'page_name' => 'cooperatives',
                'section_name' => 'categories',
                'title' => 'Group Financials',
                'description' => 'Consolidated procurement and billing for group-negotiated rates.',
                'icon' => 'Scale',
                'metadata' => ['features' => ['Bulk Supply Rates', 'Installment Payments', 'Revenue Transparency', 'Usage Analytics']],
                'order_index' => 3,
            ],

            // Investors - Metrics
            [
                'page_name' => 'investors',
                'section_name' => 'metrics',
                'title' => '250K+',
                'subtitle' => 'Active Users',
                'icon' => 'Users',
                'order_index' => 1,
            ],
            [
                'page_name' => 'investors',
                'section_name' => 'metrics',
                'title' => 'KES 150M',
                'subtitle' => 'Monthly Revenue',
                'icon' => 'TrendingUp',
                'order_index' => 2,
            ],
            [
                'page_name' => 'investors',
                'section_name' => 'metrics',
                'title' => '12 Countries',
                'subtitle' => 'Market Reach',
                'icon' => 'Globe',
                'order_index' => 3,
            ],
            [
                'page_name' => 'investors',
                'section_name' => 'metrics',
                'title' => '340%',
                'subtitle' => 'Year-over-Year',
                'icon' => 'BarChart3',
                'order_index' => 4,
            ]
        ];

        foreach ($features as $f) {
            PageFeature::create($f);
        }
    }
}
