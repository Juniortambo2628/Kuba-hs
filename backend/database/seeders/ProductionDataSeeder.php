<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Provider;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ProviderService;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\SiteSetting;
use App\Models\Review;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductionDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        Provider::truncate();
        Service::truncate();
        ServiceCategory::truncate();
        ProviderService::truncate();
        Booking::truncate();
        Payment::truncate();
        SiteSetting::truncate();
        Review::truncate();
        Address::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Admin & Test Users
        $admin = User::create([
            'first_name' => 'Kuba',
            'last_name' => 'Admin',
            'email' => 'admin@kuba.co.ke',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $client = User::create([
            'first_name' => 'Kevin',
            'last_name' => 'Client',
            'email' => 'client@test.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        $clientAddress = Address::create([
            'user_id' => $client->id,
            'address_type' => 'residential',
            'street_address' => '123 Test Street',
            'city' => 'Nairobi',
            'state' => 'Nairobi County',
            'postal_code' => '00100',
            'country' => 'Kenya',
            'latitude' => -1.2921,
            'longitude' => 36.8219,
            'is_default' => true,
        ]);

        // 2. CMS Settings (CMS Alignment)
        $settings = [
            // Branding
            ['key' => 'site_name', 'value' => 'Kuba', 'group' => 'branding', 'label' => 'Site Name', 'type' => 'text'],
            ['key' => 'site_description', 'value' => 'Kenya\'s Premier Home Services Marketplace', 'group' => 'branding', 'label' => 'Site Description', 'type' => 'textarea'],
            ['key' => 'site_logo', 'value' => '/assets/branding/Kuba-Header-footter-Logo-for-Light-Mode.png', 'group' => 'branding', 'label' => 'Platform Logo (Standard)', 'type' => 'image'],
            ['key' => 'site_logo_dark', 'value' => '/assets/branding/Kuba-Header-Footer-Logo-for-Dark-Mode.png', 'group' => 'branding', 'label' => 'Platform Logo (Dark Mode)', 'type' => 'image'],
            ['key' => 'favicon', 'value' => '/assets/branding/Kuba-Favicon.png', 'group' => 'branding', 'label' => 'Site Favicon', 'type' => 'image'],
            ['key' => 'admin_logo_light', 'value' => '/assets/branding/Kuba-Logo-Login-Light-mode.png', 'group' => 'branding', 'label' => 'Admin Sign-in Logo (Light)', 'type' => 'image'],
            ['key' => 'admin_logo_dark', 'value' => '/assets/branding/Kuba-Logo-Login-Dark-mode.png', 'group' => 'branding', 'label' => 'Admin Sign-in Logo (Dark)', 'type' => 'image'],

            // Hero Section (Home)
            ['key' => 'hero_title', 'value' => 'Expert Services for Your Home, Simply Delivered', 'group' => 'hero', 'label' => 'Hero Title (Home)', 'type' => 'text'],
            ['key' => 'hero_subtitle', 'value' => 'Find trusted professionals for cleaning, plumbing, and electrical work in Nairobi.', 'group' => 'hero', 'label' => 'Hero Subtitle (Home)', 'type' => 'textarea'],
            ['key' => 'hero_bg_image', 'value' => '', 'group' => 'hero', 'label' => 'Hero Background Image', 'type' => 'image'],
            ['key' => 'hero_cta_text', 'value' => 'Get Started', 'group' => 'hero', 'label' => 'Hero CTA Button', 'type' => 'text'],

            // About Page
            ['key' => 'about_hero_title', 'value' => 'Connecting Kenyans to Quality Services', 'group' => 'about', 'label' => 'About Hero Title', 'type' => 'text'],
            ['key' => 'about_hero_subtitle', 'value' => 'Kuba is built on trust, quality, and community. We empower local professionals.', 'group' => 'about', 'label' => 'About Hero Subtitle', 'type' => 'textarea'],
            ['key' => 'about_hero_image', 'value' => '', 'group' => 'about', 'label' => 'About Hero Image', 'type' => 'image'],
            ['key' => 'about_content', 'value' => 'Expanding local opportunities by connecting the best hands with the best homes.', 'group' => 'about', 'label' => 'About Main Content', 'type' => 'textarea'],

            // Contact & Support
            ['key' => 'contact_hero_title', 'value' => 'We\'re Here to Help', 'group' => 'config', 'label' => 'Contact Hero Title', 'type' => 'text'],
            ['key' => 'contact_hero_subtitle', 'value' => 'Have questions or need assistance? Reach out to the Kuba support team.', 'group' => 'config', 'label' => 'Contact Hero Subtitle', 'type' => 'textarea'],
            ['key' => 'support_email', 'value' => 'hello@kuba.co.ke', 'group' => 'config', 'label' => 'Support Email', 'type' => 'text'],
            ['key' => 'support_phone', 'value' => '+254 700 000 000', 'group' => 'config', 'label' => 'Support Phone', 'type' => 'text'],
            ['key' => 'office_address', 'value' => 'Westlands, Nairobi, Kenya', 'group' => 'config', 'label' => 'Headquarters Address', 'type' => 'textarea'],

            // Investors
            ['key' => 'investors_hero_title', 'value' => 'Invest in the Future of Service Delivery', 'group' => 'sections', 'label' => 'Investors Hero Title', 'type' => 'text'],
            ['key' => 'investors_hero_subtitle', 'value' => 'Join us in scaling Africa\'s premier digital marketplace for essential services.', 'group' => 'sections', 'label' => 'Investors Hero Subtitle', 'type' => 'textarea'],

            // Commercial / Business
            ['key' => 'commercial_hero_title', 'value' => 'Institutional Grade Facility Management', 'group' => 'sections', 'label' => 'Commercial Hero Title', 'type' => 'text'],
            ['key' => 'commercial_hero_subtitle', 'value' => 'Tailored solutions for businesses, from HR support to security and maintenance.', 'group' => 'sections', 'label' => 'Commercial Hero Subtitle', 'type' => 'textarea'],

            // Cooperatives
            ['key' => 'cooperatives_hero_title', 'value' => 'Empowering SACCOs & Community Groups', 'group' => 'sections', 'label' => 'Cooperatives Hero Title', 'type' => 'text'],
            ['key' => 'cooperatives_hero_subtitle', 'value' => 'Financial advisory and group-focused services for Kenyan community growth.', 'group' => 'sections', 'label' => 'Cooperatives Hero Subtitle', 'type' => 'textarea'],

            // Blog / Journal
            ['key' => 'blog_hero_title', 'value' => 'The Kuba Journal', 'group' => 'sections', 'label' => 'Blog Hero Title', 'type' => 'text'],
            ['key' => 'blog_hero_subtitle', 'value' => 'Insights, updates, and expert tips from the world of professional services.', 'group' => 'sections', 'label' => 'Blog Hero Subtitle', 'type' => 'textarea'],

            // Legal URLs
            ['key' => 'terms_of_service_url', 'value' => '/terms', 'group' => 'sections', 'label' => 'Terms of Service URL', 'type' => 'text'],
            ['key' => 'privacy_policy_url', 'value' => '/privacy', 'group' => 'sections', 'label' => 'Privacy Policy URL', 'type' => 'text'],

            // Payment & Financials
            ['key' => 'platform_fee_percent', 'value' => '10', 'group' => 'payment', 'label' => 'Platform Fee %', 'type' => 'text'],
            ['key' => 'currency_code', 'value' => 'KES', 'group' => 'payment', 'label' => 'Currency Code', 'type' => 'text'],
            ['key' => 'min_payout_amount', 'value' => '1000', 'group' => 'payment', 'label' => 'Minimum Payout (KES)', 'type' => 'text'],

            // Social Presence
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/kubakenya', 'group' => 'social', 'label' => 'Facebook URL', 'type' => 'text'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/kubakenya', 'group' => 'social', 'label' => 'Instagram URL', 'type' => 'text'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/kubakenya', 'group' => 'social', 'label' => 'Twitter/X URL', 'type' => 'text'],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/kuba', 'group' => 'social', 'label' => 'LinkedIn URL', 'type' => 'text'],
        ];

        foreach ($settings as $s) {
            SiteSetting::create($s);
        }

        // 3. Categories & Services (Kenyan Market)
        $marketData = [
            'Cleaning & Maintenance' => [
                'icon' => 'Sparkles',
                'services' => [
                    ['name' => 'Standard Home Cleaning', 'desc' => 'General cleaning of all rooms, mopping, and dusting.'],
                    ['name' => 'Deep Cleaning', 'desc' => 'Intensive cleaning including inside cabinets and appliances.'],
                    ['name' => 'Post-Construction Cleaning', 'desc' => 'Removal of dust and debris after renovations.'],
                    ['name' => 'Upholstery & Carpet Cleaning', 'desc' => 'Professional steaming and stain removal.'],
                    ['name' => 'Shared Spaces Maintenance', 'desc' => 'Cleaning and upkeep of communal areas in estates.'],
                    ['name' => 'Compound Management', 'desc' => 'Landscaping, waste disposal, and general compound care.'],
                ]
            ],
            'Health & Wellness' => [
                'icon' => 'HeartPulse',
                'services' => [
                    ['name' => 'Telehealth Consultation', 'desc' => 'Remote medical advice from certified practitioners.'],
                    ['name' => 'Mental Health Counseling', 'desc' => 'Professional therapy and emotional support sessions.'],
                    ['name' => 'Basic Health Checkups', 'desc' => 'Routine monitoring of vitals and general wellness exams.'],
                    ['name' => 'Corporate Wellness Programs', 'desc' => 'Mental health and physical wellness for employees.'],
                ]
            ],
            'Education & Training' => [
                'icon' => 'GraduationCap',
                'services' => [
                    ['name' => 'Digital Skills Training', 'desc' => 'Practical courses in coding, design, and digital literacy.'],
                    ['name' => 'Financial Literacy Workshop', 'desc' => 'Empowering individuals with personal finance management.'],
                    ['name' => 'Upskilling Programs', 'desc' => 'Professional development for various industries.'],
                ]
            ],
            'Financial & Legal' => [
                'icon' => 'Gavel',
                'services' => [
                    ['name' => 'SACCO Support & Advisory', 'desc' => 'Guidance on SACCO registration and management.'],
                    ['name' => 'Legal Documentation', 'desc' => 'Preparation of contracts, deeds, and legal papers.'],
                    ['name' => 'Tax & Business Advisory', 'desc' => 'Compliance assistance and financial strategy.'],
                    ['name' => 'Business Compliance Services', 'desc' => 'Ensuring your business meets all regulatory standards.'],
                ]
            ],
            'Food & Hospitality' => [
                'icon' => 'Soup',
                'services' => [
                    ['name' => 'Bulk Order Delivery', 'desc' => 'Large scale food delivery for groups or offices.'],
                    ['name' => 'Catering for Groups', 'desc' => 'Professional catering for events and corporate functions.'],
                    ['name' => 'Short-stay Management', 'desc' => 'Management of Airbnbs and guest accommodations.'],
                ]
            ],
            'Commercial Logistics' => [
                'icon' => 'Building2',
                'services' => [
                    ['name' => 'Facility Management', 'desc' => 'Integrated maintenance and repair for institutions.'],
                    ['name' => 'HR & Staffing Support', 'desc' => 'Provision of temporary staff and recruitment aid.'],
                    ['name' => 'IT & Tech Support', 'desc' => 'Network setup, hardware repair, and troubleshooting.'],
                    ['name' => 'Security Guard Services', 'desc' => 'Professional security personnel for premises.'],
                    ['name' => 'Delivery & Logistics', 'desc' => 'Efficient transport and supply chain solutions.'],
                ]
            ],
            'Plumbing' => [
                'icon' => 'Droplets',
                'services' => [
                    ['name' => 'Leak Detection & Repair', 'desc' => 'Finding and fixing hidden water leaks.'],
                    ['name' => 'Drain Unblocking', 'desc' => 'Clearing clogged sinks, toilets, and floor drains.'],
                ]
            ],
            'Electrical' => [
                'icon' => 'Zap',
                'services' => [
                    ['name' => 'Electrical Troubleshooting', 'desc' => 'Diagnosing power surges and circuit failures.'],
                    ['name' => 'Solar Power Setup', 'desc' => 'Installation of solar panels and battery systems.'],
                ]
            ],
        ];

        foreach ($marketData as $catName => $data) {
            $category = ServiceCategory::create([
                'name' => $catName,
                'description' => "Professional {$catName} services in Kenya.",
                'icon_url' => $data['icon'],
            ]);

            foreach ($data['services'] as $sData) {
                Service::create([
                    'category_id' => $category->id,
                    'name' => $sData['name'],
                    'description' => $sData['desc'],
                    'is_featured' => true,
                ]);
            }
        }

        // 4. Kenyan Providers
        $locations = ['Nairobi CBD', 'Westlands', 'Karen', 'Langata', 'Kilimani', 'Mombasa CBD', 'Nyali'];
        $specializations = [
            ['Residential Specialist', '5 Star Rating'],
            ['Industrial Grade', 'Certified Expert'],
            ['Eco-friendly', 'Pet Safe'],
        ];

        for ($i = 1; $i <= 8; $i++) {
            $pUser = User::create([
                'first_name' => "Provider",
                'last_name' => "Number {$i}",
                'email' => "provider{$i}@kuba.co.ke",
                'password' => Hash::make('password'),
                'role' => 'provider',
            ]);

            $provider = Provider::create([
                'user_id' => $pUser->id,
                'business_name' => ["Alpha", "Elite", "Prime", "Swift", "Zenith"][$i % 5] . " " . ["Services", "Home Pros", "Solutions", "Experts"][$i % 4],
                'bio' => "Professional service provider based in {$locations[$i % count($locations)]} with over 5 years of local experience.",
                'experience_years' => 3 + $i,
                'location_name' => $locations[$i % count($locations)],
                'latitude' => -1.2921 + (rand(-100, 100) / 1000), // Random Nairobi area
                'longitude' => 36.8219 + (rand(-100, 100) / 1000),
                'is_verified' => true,
                'specialized_skills' => $specializations[$i % count($specializations)],
                'application_status' => 'approved',
            ]);

            // Assign 2 random services to each provider
            $services = Service::inRandomOrder()->take(2)->get();
            foreach ($services as $service) {
                ProviderService::create([
                    'provider_id' => $provider->id,
                    'service_id' => $service->id,
                    'base_price' => rand(1500, 5000),
                    'pricing_type' => 'hourly',
                    'min_hours' => rand(1, 3),
                    'is_available' => true,
                ]);
            }
        }

        // 5. Historical Bookings & Payments (For Visualization)
        $providers = Provider::all();
        $statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

        for ($j = 0; $j < 15; $j++) {
            $pro = $providers->random();
            $ps = ProviderService::where('provider_id', $pro->id)->first();
            $status = $statuses[rand(0, 3)];

            $booking = Booking::create([
                'booking_number' => 'KBA-' . strtoupper(Str::random(8)),
                'customer_id' => $client->id,
                'provider_id' => $pro->id,
                'service_id' => $ps->service_id,
                'service_type' => 'residential',
                'address_id' => $clientAddress->id,
                'scheduled_date' => now()->addDays(rand(-30, 30)),
                'status' => $status,
                'estimated_price' => $ps->base_price * 2,
                'final_price' => $status === 'completed' ? $ps->base_price * 2 : null,
                'payment_status' => $status === 'completed' ? 'paid' : 'pending',
                'location_name' => '123 Test Street, Nairobi',
            ]);

            if ($status === 'completed') {
                $amount = $booking->final_price;
                $fee = round($amount * 0.10, 2);
                
                Payment::create([
                    'booking_id' => $booking->id,
                    'customer_id' => $client->id,
                    'provider_id' => $pro->id,
                    'amount' => $amount,
                    'platform_fee' => $fee,
                    'provider_amount' => $amount - $fee,
                    'payment_method' => 'paystack',
                    'transaction_id' => 'TX-' . strtoupper(Str::random(10)),
                    'status' => 'completed',
                    'payment_gateway' => 'paystack',
                ]);

                Review::create([
                    'booking_id' => $booking->id,
                    'provider_id' => $pro->id,
                    'customer_id' => $client->id,
                    'rating' => rand(4, 5),
                    'comment' => "Excellent service from {$pro->business_name}!",
                ]);
            }
        }
    }
}
