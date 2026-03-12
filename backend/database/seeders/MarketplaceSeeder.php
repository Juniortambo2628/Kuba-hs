<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MarketplaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\Service::truncate();
        \App\Models\ServiceCategory::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $categories = [
            [
                'name' => 'Home Essentials',
                'description' => 'Essential services to keep your home running smoothly.',
                'icon_url' => 'home',
                'services' => [
                    ['name' => 'Home cleaning (standard, deep, move-in/out)', 'description' => 'Comprehensive cleaning services for any occasion.'],
                    ['name' => 'Laundry pickup & delivery', 'description' => 'Convenient laundry and dry cleaning services.'],
                    ['name' => 'Plumbing services', 'description' => 'Expert plumbing repairs, installations, and maintenance.'],
                    ['name' => 'Electrical repairs', 'description' => 'Safe and reliable electrical troubleshooting and repair.'],
                    ['name' => 'Appliance repair', 'description' => 'Fixing refrigerators, washers, ovens, and more.'],
                    ['name' => 'Handyman services', 'description' => 'Versatile repair and maintenance tasks around the house.'],
                    ['name' => 'Pest control', 'description' => 'Effective and safe eradication of household pests.'],
                    ['name' => 'Moving assistance', 'description' => 'Help with packing, loading, and safely moving your belongings.'],
                ]
            ],
            [
                'name' => 'Automotive Care',
                'description' => 'Professional maintenance and cleaning for your vehicle.',
                'icon_url' => 'car',
                'services' => [
                    ['name' => 'Tire Change & Alignment', 'description' => 'On-site tire swapping and precision wheel alignment.'],
                    ['name' => 'Full Interior Detail', 'description' => 'Deep cleaning of upholstery, carpets, and dashboard.'],
                    ['name' => 'Oil & Filter Change', 'description' => 'Quick and efficient engine oil and filter replacement.'],
                    ['name' => 'Battery Diagnosis & Swap', 'description' => 'Checking battery health and installing new units.'],
                    ['name' => 'Ceramic Coating', 'description' => 'Long-lasting paint protection and high-gloss finish.'],
                ]
            ],
            [
                'name' => 'Personal & Wellness',
                'description' => 'Services dedicated to your health, beauty, and well-being.',
                'icon_url' => 'heart',
                'services' => [
                    ['name' => 'Hair & grooming (home service)', 'description' => 'Professional haircuts and grooming in the comfort of your home.'],
                    ['name' => 'Makeup & nail services', 'description' => 'Expert beauty treatments for special events or daily care.'],
                    ['name' => 'Fitness trainers', 'description' => 'Personalized workout sessions with certified instructors.'],
                    ['name' => 'Massage therapy', 'description' => 'Relaxing and therapeutic massage sessions at your location.'],
                    ['name' => 'Babysitting / nanny services', 'description' => 'Trusted and experienced childcare providers.'],
                ]
            ],
            [
                'name' => 'Professional & Digital',
                'description' => 'Expert consulting and digital solutions for your business.',
                'icon_url' => 'briefcase',
                'services' => [
                    ['name' => 'Legal consultation', 'description' => 'Professional legal advice and document review.'],
                    ['name' => 'Accounting & tax support', 'description' => 'Financial organization and tax preparation services.'],
                    ['name' => 'CV writing & career coaching', 'description' => 'Expert help to elevate your professional profile.'],
                    ['name' => 'IT support', 'description' => 'Technical assistance for hardware, software, and networks.'],
                    ['name' => 'Website design', 'description' => 'Creating modern, responsive, and beautiful websites.'],
                ]
            ],
            [
                'name' => 'Event & Commercial',
                'description' => 'Sanitation and setup services for businesses and events.',
                'icon_url' => 'building',
                'services' => [
                    ['name' => 'Office Deep Clean', 'description' => 'Complete workspace sanitization and organization.'],
                    ['name' => 'Commercial Kitchen Scrub', 'description' => 'High-pressure cleaning for industrial food prep areas.'],
                    ['name' => 'Event Cleanup Team', 'description' => 'Rapid restorative cleaning after parties or corporate events.'],
                ]
            ],
        ];
        foreach ($categories as $catData) {
            $cat = \App\Models\ServiceCategory::updateOrCreate(
                ['name' => $catData['name']],
                [
                    'description' => $catData['description'],
                    'icon_url' => $catData['icon_url'],
                ]
            );

            foreach ($catData['services'] as $serviceData) {
                \App\Models\Service::updateOrCreate(
                    [
                        'category_id' => $cat->id,
                        'name' => $serviceData['name'],
                    ],
                    [
                        'description' => $serviceData['description'],
                    ]
                );
            }
        }

        // Create Dummy Providers
        $user1 = \App\Models\User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Cleaner',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'provider',
            ]
        );

        $provider1 = \App\Models\Provider::updateOrCreate(
            ['user_id' => $user1->id],
            [
                'business_name' => 'John\'s Elite Cleaning',
                'bio' => 'Standard and deep cleaning specialist with 5 years experience.',
                'experience_years' => 5,
                'location_name' => 'Downtown',
                'is_verified' => true,
            ]
        );

        $homeCleaning = \App\Models\Service::where('name', 'Home cleaning (standard, deep, move-in/out)')->first();
        if ($homeCleaning) {
            \App\Models\ProviderService::updateOrCreate(
                [
                    'provider_id' => $provider1->id,
                    'service_id' => $homeCleaning->id,
                ],
                [
                    'base_price' => 50.00,
                    'pricing_type' => 'hourly',
                    'is_available' => true,
                ]
            );
        }

        $user2 = \App\Models\User::updateOrCreate(
            ['email' => 'mike@example.com'],
            [
                'first_name' => 'Mike',
                'last_name' => 'Fixer',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'provider',
            ]
        );

        $provider2 = \App\Models\Provider::updateOrCreate(
            ['user_id' => $user2->id],
            [
                'business_name' => 'QuickFix Plumbing',
                'bio' => 'Emergency plumbing and leakage repairs.',
                'experience_years' => 8,
                'location_name' => 'Westside',
                'is_verified' => true,
            ]
        );

        $tapRepair = \App\Models\Service::where('name', 'Plumbing services')->first();
        if ($tapRepair) {
            \App\Models\ProviderService::updateOrCreate(
                [
                    'provider_id' => $provider2->id,
                    'service_id' => $tapRepair->id,
                ],
                [
                    'base_price' => 35.00,
                    'pricing_type' => 'flat',
                    'is_available' => true,
                ]
            );
        }

        // Add images to featured services with more stable URLs (using specific IDs)
        $featuredImages = [
            'Home cleaning (standard, deep, move-in/out)' => 'https://images.unsplash.com/photo-1581578731522-74548b360976?q=80&w=1000&auto=format&fit=crop',
            'Electrical repairs' => 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
            'Tire Change & Alignment' => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop',
            'Massage therapy' => 'https://images.unsplash.com/photo-1544161515-4af6b1d462c2?q=80&w=1000&auto=format&fit=crop',
            'Plumbing services' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
        ];

        foreach ($featuredImages as $name => $url) {
            $service = \App\Models\Service::where('name', $name)->first();
            if ($service) {
                try {
                    // Clear existing and add new to Service
                    $service->clearMediaCollection('images');
                    $service->addMediaFromUrl($url)->toMediaCollection('images');
                    
                    // Also add to any ProviderService offering this service
                    $providerServices = \App\Models\ProviderService::where('service_id', $service->id)->get();
                    foreach ($providerServices as $ps) {
                        $ps->clearMediaCollection('services');
                        $ps->addMediaFromUrl($url)->toMediaCollection('services');
                    }
                } catch (\Exception $e) {
                    \Log::error("Failed to add media for {$name}: " . $e->getMessage());
                    // Fallback to a placeholder if Unsplash fails
                    $placeholder = "https://ui-avatars.com/api/?name=" . urlencode($name) . "&size=512";
                    try {
                        $service->addMediaFromUrl($placeholder)->toMediaCollection('images');
                    } catch (\Exception $inner) {}
                }
            }
        }
    }
}
