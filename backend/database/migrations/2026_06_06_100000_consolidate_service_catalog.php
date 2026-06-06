<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /** Canonical category order for megamenu (residential then commercial). */
    private const TAXONOMY = [
        'Cleaning & Maintenance' => ['type' => 'residential', 'icon' => 'sparkles', 'sort' => 10],
        'Health & Wellness' => ['type' => 'residential', 'icon' => 'heart', 'sort' => 20],
        'Personal & Grooming' => ['type' => 'residential', 'icon' => 'sparkles', 'sort' => 30],
        'Education & Training' => ['type' => 'residential', 'icon' => 'briefcase', 'sort' => 40],
        'Food & Hospitality' => ['type' => 'residential', 'icon' => 'home', 'sort' => 50],
        'Electrical' => ['type' => 'residential', 'icon' => 'bolt', 'sort' => 60],
        'Legal Services' => ['type' => 'commercial', 'icon' => 'briefcase', 'sort' => 110],
        'Financial Services' => ['type' => 'commercial', 'icon' => 'building', 'sort' => 120],
        'Commercial Real Estate' => ['type' => 'commercial', 'icon' => 'building', 'sort' => 130],
        'Professional Services' => ['type' => 'commercial', 'icon' => 'briefcase', 'sort' => 140],
        'Technology & IT Services' => ['type' => 'commercial', 'icon' => 'bolt', 'sort' => 150],
        'HR Services' => ['type' => 'commercial', 'icon' => 'briefcase', 'sort' => 160],
        'Commercial Logistics' => ['type' => 'commercial', 'icon' => 'building', 'sort' => 170],
    ];

    /** Services to move from Commercial Logistics into the right category. */
    private const SERVICE_REASSIGNMENTS = [
        'IT & Tech Support' => 'Technology & IT Services',
        'HR & Staffing Support' => 'HR Services',
    ];

    /** Legacy category — services are split then category removed. */
    private const RETIRED_CATEGORIES = ['Financial & Legal', 'Plumbing'];

    public function up(): void
    {
        DB::transaction(function () {
            $this->consolidateFinancialAndLegal();
            $this->reassignMisplacedServices();
            $this->retireLegacyCategories();
            $this->applyTaxonomy();
            $this->dedupeServicesByName();
        });

        Cache::forget('api_categories_all');
        Cache::forget('api_featured_services');
    }

    public function down(): void
    {
        // Data cleanup is not reversed automatically.
    }

    private function consolidateFinancialAndLegal(): void
    {
        $legacy = ServiceCategory::where('name', 'Financial & Legal')->first();
        if (! $legacy) {
            return;
        }

        $legal = ServiceCategory::firstOrCreate(
            ['name' => 'Legal Services'],
            ['type' => 'commercial', 'icon_url' => 'briefcase', 'description' => 'Professional Legal Services services in Kenya.', 'sort_order' => 110]
        );
        $financial = ServiceCategory::firstOrCreate(
            ['name' => 'Financial Services'],
            ['type' => 'commercial', 'icon_url' => 'building', 'description' => 'Professional Financial Services services in Kenya.', 'sort_order' => 120]
        );
        $professional = ServiceCategory::firstOrCreate(
            ['name' => 'Professional Services'],
            ['type' => 'commercial', 'icon_url' => 'briefcase', 'description' => 'Professional Professional Services services in Kenya.', 'sort_order' => 140]
        );

        $services = Service::where('category_id', $legacy->id)->get();
        foreach ($services as $service) {
            $name = Str::lower($service->name);
            $target = $professional->id;
            if (Str::contains($name, ['legal', 'law', 'documentation', 'compliance'])) {
                $target = $legal->id;
            } elseif (Str::contains($name, ['tax', 'sacco', 'banking', 'insurance', 'wealth', 'financial', 'advisory'])) {
                $target = $financial->id;
            }
            $service->update(['category_id' => $target]);
        }

        $legacy->delete();
    }

    private function reassignMisplacedServices(): void
    {
        foreach (self::SERVICE_REASSIGNMENTS as $serviceName => $categoryName) {
            $category = ServiceCategory::where('name', $categoryName)->first();
            if (! $category) {
                continue;
            }
            Service::where('name', $serviceName)->update(['category_id' => $category->id]);
        }
    }

    private function retireLegacyCategories(): void
    {
        $cleaning = ServiceCategory::where('name', 'Cleaning & Maintenance')->first();

        foreach (self::RETIRED_CATEGORIES as $name) {
            if ($name === 'Financial & Legal') {
                continue;
            }
            $cat = ServiceCategory::where('name', $name)->first();
            if (! $cat || ! $cleaning) {
                continue;
            }
            Service::where('category_id', $cat->id)->update(['category_id' => $cleaning->id]);
            $cat->delete();
        }
    }

    private function applyTaxonomy(): void
    {
        foreach (self::TAXONOMY as $name => $meta) {
            ServiceCategory::where('name', $name)->update([
                'type' => $meta['type'],
                'icon_url' => $meta['icon'],
                'sort_order' => $meta['sort'],
            ]);
        }

        ServiceCategory::query()
            ->whereNotIn('name', array_keys(self::TAXONOMY))
            ->orderBy('name')
            ->get()
            ->each(function (ServiceCategory $cat, int $index) {
                $cat->update(['sort_order' => 900 + $index]);
            });
    }

    private function dedupeServicesByName(): void
    {
        $duplicates = Service::query()
            ->select('name')
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('name');

        foreach ($duplicates as $name) {
            $rows = Service::where('name', $name)->orderBy('created_at')->get();
            $keep = $rows->first();
            foreach ($rows->slice(1) as $duplicate) {
                DB::table('provider_services')
                    ->where('service_id', $duplicate->id)
                    ->update(['service_id' => $keep->id]);
                $duplicate->delete();
            }
        }
    }
};
