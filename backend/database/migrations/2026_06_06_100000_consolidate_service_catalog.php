<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
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

    private const SERVICE_REASSIGNMENTS = [
        'IT & Tech Support' => 'Technology & IT Services',
        'HR & Staffing Support' => 'HR Services',
    ];

    private const RETIRED_CATEGORIES = ['Plumbing'];

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
        $legacy = DB::table('service_categories')->where('name', 'Financial & Legal')->first();
        if (! $legacy) {
            return;
        }

        $now = now()->toDateTimeString();

        $legalId = $this->findOrCreateCategory('Legal Services', 'commercial', 'briefcase', 'Professional Legal Services services in Kenya.', 110, $now);
        $financialId = $this->findOrCreateCategory('Financial Services', 'commercial', 'building', 'Professional Financial Services services in Kenya.', 120, $now);
        $professionalId = $this->findOrCreateCategory('Professional Services', 'commercial', 'briefcase', 'Professional Professional Services services in Kenya.', 140, $now);

        $services = DB::table('services')->where('category_id', $legacy->id)->get();
        foreach ($services as $service) {
            $name = Str::lower($service->name);
            $target = $professionalId;
            if (Str::contains($name, ['legal', 'law', 'documentation', 'compliance'])) {
                $target = $legalId;
            } elseif (Str::contains($name, ['tax', 'sacco', 'banking', 'insurance', 'wealth', 'financial', 'advisory'])) {
                $target = $financialId;
            }
            DB::table('services')->where('id', $service->id)->update(['category_id' => $target]);
        }

        DB::table('service_categories')->where('id', $legacy->id)->delete();
    }

    private function findOrCreateCategory(string $name, string $type, string $icon, string $description, int $sort, string $now): string
    {
        $existing = DB::table('service_categories')->where('name', $name)->first();
        if ($existing) {
            return $existing->id;
        }

        $id = Str::uuid()->toString();
        DB::table('service_categories')->insert([
            'id' => $id,
            'name' => $name,
            'type' => $type,
            'icon_url' => $icon,
            'description' => $description,
            'sort_order' => $sort,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $id;
    }

    private function reassignMisplacedServices(): void
    {
        foreach (self::SERVICE_REASSIGNMENTS as $serviceName => $categoryName) {
            $category = DB::table('service_categories')->where('name', $categoryName)->first();
            if (! $category) {
                continue;
            }
            DB::table('services')->where('name', $serviceName)->update(['category_id' => $category->id]);
        }
    }

    private function retireLegacyCategories(): void
    {
        $cleaning = DB::table('service_categories')->where('name', 'Cleaning & Maintenance')->first();

        foreach (self::RETIRED_CATEGORIES as $name) {
            $cat = DB::table('service_categories')->where('name', $name)->first();
            if (! $cat || ! $cleaning) {
                continue;
            }
            DB::table('services')->where('category_id', $cat->id)->update(['category_id' => $cleaning->id]);
            DB::table('service_categories')->where('id', $cat->id)->delete();
        }
    }

    private function applyTaxonomy(): void
    {
        foreach (self::TAXONOMY as $name => $meta) {
            DB::table('service_categories')->where('name', $name)->update([
                'type' => $meta['type'],
                'icon_url' => $meta['icon'],
                'sort_order' => $meta['sort'],
            ]);
        }

        $knownNames = array_keys(self::TAXONOMY);
        $others = DB::table('service_categories')->whereNotIn('name', $knownNames)->orderBy('name')->get();
        foreach ($others as $index => $cat) {
            DB::table('service_categories')->where('id', $cat->id)->update(['sort_order' => 900 + $index]);
        }
    }

    private function dedupeServicesByName(): void
    {
        $duplicates = DB::table('services')
            ->select('name')
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('name');

        foreach ($duplicates as $name) {
            $rows = DB::table('services')->where('name', $name)->orderBy('created_at')->get();
            $keep = $rows->first();
            foreach ($rows->slice(1) as $duplicate) {
                DB::table('provider_services')
                    ->where('service_id', $duplicate->id)
                    ->update(['service_id' => $keep->id]);
                DB::table('services')->where('id', $duplicate->id)->delete();
            }
        }
    }
};
