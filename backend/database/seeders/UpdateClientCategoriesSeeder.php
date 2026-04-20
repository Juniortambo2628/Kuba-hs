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
                // Move services
                Service::where('category_id', $plumbingCategory->id)
                    ->update(['category_id' => $cleaningCategory->id]);
                // Delete empty plumbing category
                $plumbingCategory->delete();
            }

            // 2. Add / Update Health & Wellness
            $healthCategory = ServiceCategory::updateOrCreate(
                ['name' => 'Health & Wellness'],
                ['description' => 'Professional Health & Wellness services in Kenya.', 'icon_url' => 'HeartPulse']
            );

            $healthServices = [
                ['name' => 'Massage Therapy', 'description' => 'Relaxing and therapeutic massage sessions at your location.'],
                ['name' => 'Fitness Therapy & Trainers', 'description' => 'Personalized workout sessions with certified instructors.'],
                ['name' => 'Doulas', 'description' => 'Professional birth and postpartum support.'],
            ];

            foreach ($healthServices as $hs) {
                Service::updateOrCreate(
                    ['name' => $hs['name']],
                    ['category_id' => $healthCategory->id, 'description' => $hs['description'], 'is_featured' => true]
                );
            }

            // 3. New Categories to Add
            $newCategories = [
                'Personal & Grooming' => [
                    'icon' => 'Scissors',
                    'services' => [
                        ['name' => 'Barbers', 'desc' => 'Professional men\'s haircuts and grooming.'],
                        ['name' => 'Hair Stylists', 'desc' => 'Expert hair styling and treatment.'],
                        ['name' => 'Waxing', 'desc' => 'Professional hair removal services.'],
                        ['name' => 'Eyelashes & Eyebrows', 'desc' => 'Enhancement and shaping services.'],
                        ['name' => 'Nails', 'desc' => 'Manicures, pedicures, and nail art.'],
                        ['name' => 'Personal Shoppers', 'desc' => 'Dedicated shopping assistance and styling.'],
                    ]
                ],
                'Legal Services' => [
                    'icon' => 'Scale',
                    'services' => [
                        ['name' => 'Business/Corporate Law', 'desc' => 'Corporate structuring and legal advisory.'],
                        ['name' => 'Real Estate Law', 'desc' => 'Property transactions and dispute resolution.'],
                        ['name' => 'Employment & Labor Law', 'desc' => 'Workplace compliance and contract advisory.'],
                        ['name' => 'Intellectual Property (IP) Law', 'desc' => 'Trademarks, patents, and copyright protection.'],
                    ]
                ],
                'Financial Services' => [
                    'icon' => 'Landmark',
                    'services' => [
                        ['name' => 'Banking', 'desc' => 'Corporate banking solutions and advisory.'],
                        ['name' => 'Insurance', 'desc' => 'Comprehensive risk matching and coverage.'],
                        ['name' => 'Financial Asset Management', 'desc' => 'Investment and portfolio structuring.'],
                        ['name' => 'Wealth Management', 'desc' => 'Private wealth advisory.'],
                    ]
                ],
                'Commercial Real Estate' => [
                    'icon' => 'Building',
                    'services' => [
                        ['name' => 'Corporate Property Services', 'desc' => 'Leasing and commercial property administration.'],
                        ['name' => 'Business Brokerage', 'desc' => 'Buying and selling commercial entities.'],
                    ]
                ],
                'Professional Services' => [
                    'icon' => 'Briefcase',
                    'services' => [
                        ['name' => 'Consulting', 'desc' => 'Strategic business and management consulting.'],
                        ['name' => 'Business Support', 'desc' => 'Administrative and back-office solutions.'],
                        ['name' => 'Corporate Services', 'desc' => 'Registration and compliance services.'],
                    ]
                ],
                'Technology & IT Services' => [
                    'icon' => 'Laptop',
                    'services' => [
                        ['name' => 'Tech Support', 'desc' => 'On-demand hardware and network assistance.'],
                        ['name' => 'IT Consulting', 'desc' => 'Systems architecture and digital transformation.'],
                        ['name' => 'Cloud Services', 'desc' => 'Cloud migration and infrastructure management.'],
                    ]
                ],
                'HR Services' => [
                    'icon' => 'Users',
                    'services' => [
                        ['name' => 'Staffing Agencies', 'desc' => 'Temporary and permanent staff placement.'],
                        ['name' => 'Payroll Management', 'desc' => 'Outsourced payroll processing and compliance.'],
                        ['name' => 'Recruitment Firms', 'desc' => 'Executive search and talent acquisition.'],
                    ]
                ],
            ];

            foreach ($newCategories as $catName => $data) {
                $category = ServiceCategory::updateOrCreate(
                    ['name' => $catName],
                    ['description' => "Professional {$catName} services in Kenya.", 'icon_url' => $data['icon']]
                );

                foreach ($data['services'] as $sData) {
                    Service::updateOrCreate(
                        ['name' => $sData['name']],
                        ['category_id' => $category->id, 'description' => $sData['desc'], 'is_featured' => true]
                    );
                }
            }

            DB::commit();
            $this->command->info('Categories updated successfully without data loss.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error updating categories: ' . $e->getMessage());
        }
    }
}
