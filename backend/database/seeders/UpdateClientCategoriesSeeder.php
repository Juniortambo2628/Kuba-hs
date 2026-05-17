<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateClientCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();
        try {
            // 1. Move Plumbing services to 'Cleaning & Maintenance'
            $cleaningCategory = ServiceCategory::where('name', 'Cleaning & Maintenance')->first();
            $plumbingCategory = ServiceCategory::where('name', 'Plumbing')->first();

            if ($plumbingCategory && $cleaningCategory) {
                Service::where('category_id', $plumbingCategory->id)
                    ->update(['category_id' => $cleaningCategory->id]);
                $plumbingCategory->delete();
            }

            // 2. Consolidate 'Financial & Legal' into specific categories
            $finLegalCategory = ServiceCategory::where('name', 'Financial & Legal')->first();
            if ($finLegalCategory) {
                $legalCat = ServiceCategory::updateOrCreate(['name' => 'Legal Services'], ['type' => 'commercial', 'icon_url' => 'Scale']);
                $finCat = ServiceCategory::updateOrCreate(['name' => 'Financial Services'], ['type' => 'commercial', 'icon_url' => 'Landmark']);

                // Migrate specific services
                Service::where('category_id', $finLegalCategory->id)
                    ->where('name', 'like', '%Legal%')
                    ->update(['category_id' => $legalCat->id]);
                
                Service::where('category_id', $finLegalCategory->id)
                    ->where('name', 'like', '%Tax%')
                    ->orWhere('name', 'like', '%SACCO%')
                    ->update(['category_id' => $finCat->id]);

                // Default remaining to Professional Services
                $profCat = ServiceCategory::updateOrCreate(['name' => 'Professional Services'], ['type' => 'commercial', 'icon_url' => 'Briefcase']);
                Service::where('category_id', $finLegalCategory->id)
                    ->update(['category_id' => $profCat->id]);

                $finLegalCategory->delete();
            }

            // 3. Define the full Taxonomy with Types
            $taxonomy = [
                'Cleaning & Maintenance' => ['type' => 'residential', 'icon' => 'Sparkles'],
                'Health & Wellness' => ['type' => 'residential', 'icon' => 'HeartPulse'],
                'Personal & Grooming' => ['type' => 'residential', 'icon' => 'Scissors'],
                'Education & Training' => ['type' => 'residential', 'icon' => 'GraduationCap'],
                'Food & Hospitality' => ['type' => 'residential', 'icon' => 'Soup'],
                'Electrical' => ['type' => 'residential', 'icon' => 'Zap'],
                
                'Legal Services' => ['type' => 'commercial', 'icon' => 'Scale'],
                'Financial Services' => ['type' => 'commercial', 'icon' => 'Landmark'],
                'Commercial Real Estate' => ['type' => 'commercial', 'icon' => 'Building'],
                'Professional Services' => ['type' => 'commercial', 'icon' => 'Briefcase'],
                'Technology & IT Services' => ['type' => 'commercial', 'icon' => 'Laptop'],
                'HR Services' => ['type' => 'commercial', 'icon' => 'Users'],
                'Commercial Logistics' => ['type' => 'commercial', 'icon' => 'Building2'],
            ];

            foreach ($taxonomy as $name => $meta) {
                ServiceCategory::updateOrCreate(
                    ['name' => $name],
                    [
                        'type' => $meta['type'],
                        'icon_url' => $meta['icon'],
                        'description' => "Professional {$name} services in Kenya."
                    ]
                );
            }

            // 4. Ensure specific services exist for all categories to populate the megamenu
            $extraServices = [
                'Cleaning & Maintenance' => [
                    ['name' => 'Standard Home Cleaning', 'desc' => 'General cleaning of all living areas.'],
                    ['name' => 'Deep Cleaning', 'desc' => 'Intensive cleaning for move-ins or seasonal refreshes.'],
                    ['name' => 'Post-Construction Cleaning', 'desc' => 'Debris and dust removal after renovations.'],
                    ['name' => 'Upholstery & Carpet Cleaning', 'desc' => 'Professional steam and dry cleaning for furniture.'],
                    ['name' => 'Shared Spaces Maintenance', 'desc' => 'Cleaning for apartment lobbies and common areas.'],
                    ['name' => 'Compound Management', 'desc' => 'Landscaping, waste, and external maintenance.'],
                    ['name' => 'Leak Detection & Repair', 'desc' => 'Finding and fixing plumbing leaks.'],
                    ['name' => 'Drain Unblocking', 'desc' => 'Clearing clogged sinks, toilets, and drains.'],
                ],
                'Health & Wellness' => [
                    ['name' => 'Telehealth Consultation', 'desc' => 'Virtual medical advice from licensed doctors.'],
                    ['name' => 'Mental Health Counseling', 'desc' => 'Private sessions with certified therapists.'],
                    ['name' => 'Basic Health Checkups', 'desc' => 'Routine screenings and wellness monitoring.'],
                    ['name' => 'Corporate Wellness Programs', 'desc' => 'Health workshops and initiatives for employees.'],
                    ['name' => 'Doulas', 'desc' => 'Professional birth companion, labor advocacy, and postpartum support.'],
                    ['name' => 'Nutritionists', 'desc' => 'Certified clinical nutritionists for custom meal planning and diet advice.'],
                    ['name' => 'Pregnancy Care (massage & overall care)', 'desc' => 'Prenatal/postnatal maternal massage and general pregnancy support.'],
                ],
                'Personal & Grooming' => [
                    ['name' => 'Standard Haircut', 'desc' => 'Professional barber and styling services at home.'],
                    ['name' => 'Home Manicure/Pedicure', 'desc' => 'Nail care and aesthetics delivered to your door.'],
                    ['name' => 'Skin & Beauty Treatments', 'desc' => 'Facials and skin therapy sessions.'],
                    ['name' => 'Barbers', 'desc' => 'Professional men\'s haircuts and grooming.'],
                    ['name' => 'Hair Stylists', 'desc' => 'Expert hair styling and treatment.'],
                    ['name' => 'Waxing', 'desc' => 'Professional hair removal services.'],
                    ['name' => 'Eyelashes & Eyebrows', 'desc' => 'Enhancement and shaping services.'],
                    ['name' => 'Nails', 'desc' => 'Manicures, pedicures, and nail art.'],
                    ['name' => 'Personal Shoppers', 'desc' => 'Dedicated shopping assistance and styling.'],
                    ['name' => 'Facials & Skincare', 'desc' => 'Premium skincare, facial scrubs, and moisturizing treatments.'],
                    ['name' => 'Makeup Artists', 'desc' => 'Professional makeup for weddings, corporate events, and daily styles.'],
                    ['name' => 'Hair Coloring & Styling', 'desc' => 'Full coloring, highlights, customized haircutting, and styling.'],
                    ['name' => 'Massage & Body Scrub', 'desc' => 'Full-body relaxation massages, aromatherapy, and organic body scrubs.'],
                    ['name' => 'Threading & Tweezing', 'desc' => 'Precise brow shaping and facial hair removal.'],
                ],
                'Education & Training' => [
                    ['name' => 'Digital Skills Training', 'desc' => 'Workshops on modern software and tech tools.'],
                    ['name' => 'Financial Literacy Workshop', 'desc' => 'Personal finance management and investment training.'],
                    ['name' => 'Upskilling Programs', 'desc' => 'Specialized career training and certifications.'],
                ],
                'Food & Hospitality' => [
                    ['name' => 'Bulk Order Delivery', 'desc' => 'Large scale food delivery for events or offices.'],
                    ['name' => 'Catering for Groups', 'desc' => 'Professional catering services for small to large gatherings.'],
                    ['name' => 'Short-stay Management', 'desc' => 'Host services for Airbnb and guest properties.'],
                ],
                'Electrical' => [
                    ['name' => 'Electrical Troubleshooting', 'desc' => 'Diagnosing and fixing domestic power issues.'],
                    ['name' => 'Solar Power Setup', 'desc' => 'Installation and maintenance of solar PV systems.'],
                ],
                'Legal Services' => [
                    ['name' => 'Legal Documentation', 'desc' => 'Drafting and reviewing contracts and agreements.'],
                    ['name' => 'Business/Corporate Law', 'desc' => 'Corporate structuring and legal advisory.'],
                    ['name' => 'Real Estate Law', 'desc' => 'Property transactions and dispute resolution.'],
                ],
                'Financial Services' => [
                    ['name' => 'SACCO Support & Advisory', 'desc' => 'Strategic guidance for cooperative societies.'],
                    ['name' => 'Tax & Business Advisory', 'desc' => 'KRA compliance and financial planning.'],
                    ['name' => 'Banking', 'desc' => 'Corporate banking solutions and advisory.'],
                    ['name' => 'Insurance', 'desc' => 'Comprehensive risk matching and coverage.'],
                ],
                'Commercial Real Estate' => [
                    ['name' => 'Property Valuation', 'desc' => 'Accurate market valuation for commercial assets.'],
                    ['name' => 'Facility Management', 'desc' => 'Comprehensive operations for office buildings.'],
                ],
                'Professional Services' => [
                    ['name' => 'Business Compliance Services', 'desc' => 'KRA, NSSF, NHIF, and Registrar of Companies filings.'],
                ],
                'Technology & IT Services' => [
                    ['name' => 'IT & Tech Support', 'desc' => 'Remote and on-site technical troubleshooting.'],
                    ['name' => 'Security Guard Services', 'desc' => 'Manned guarding and surveillance for businesses.'],
                ],
                'HR Services' => [
                    ['name' => 'Staffing Agencies', 'desc' => 'Temporary and permanent staff placement.'],
                    ['name' => 'Payroll Management', 'desc' => 'Outsourced payroll processing and compliance.'],
                ],
                'Commercial Logistics' => [
                    ['name' => 'Delivery & Logistics', 'desc' => 'B2B courier and supply chain transport.'],
                ],
            ];

            foreach ($extraServices as $catName => $services) {
                $cat = ServiceCategory::where('name', $catName)->first();
                if ($cat) {
                    foreach ($services as $s) {
                        Service::updateOrCreate(
                            ['name' => $s['name']],
                            ['category_id' => $cat->id, 'description' => $s['desc'], 'is_featured' => true]
                        );
                    }
                }
            }

            DB::commit();
            $this->command->info('Categories consolidated and types assigned successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error updating categories: ' . $e->getMessage());
        }
    }
}
