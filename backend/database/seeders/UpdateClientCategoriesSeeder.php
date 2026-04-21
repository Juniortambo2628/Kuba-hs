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

            // 4. Ensure some specific services exist for new categories if they don't
            $extraServices = [
                'Legal Services' => [
                    ['name' => 'Business/Corporate Law', 'desc' => 'Corporate structuring and legal advisory.'],
                    ['name' => 'Real Estate Law', 'desc' => 'Property transactions and dispute resolution.'],
                ],
                'Financial Services' => [
                    ['name' => 'Banking', 'desc' => 'Corporate banking solutions and advisory.'],
                    ['name' => 'Insurance', 'desc' => 'Comprehensive risk matching and coverage.'],
                ],
                'HR Services' => [
                    ['name' => 'Staffing Agencies', 'desc' => 'Temporary and permanent staff placement.'],
                    ['name' => 'Payroll Management', 'desc' => 'Outsourced payroll processing and compliance.'],
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
