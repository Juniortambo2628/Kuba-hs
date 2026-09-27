<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->unique('slug');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->unique('slug');
        });

        $this->backfill(ServiceCategory::class, 'service_categories');
        $this->backfill(Service::class, 'services');
    }

    public function down(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }

    /**
     * Every existing row gets a slug, duplicates get -2, -3 ... so the unique
     * index holds and two rows of the same name no longer share one URL.
     * Soft-deleted rows are included: they keep the slug they were using.
     */
    private function backfill(string $model, string $table): void
    {
        $used = [];

        foreach ($model::withTrashed()->orderBy('id')->get(['id', 'name']) as $row) {
            $base = \Illuminate\Support\Str::slug((string) $row->name);

            if ($base === '') {
                $base = 'item-'.$row->id;
            }

            $slug = $base;
            $suffix = 2;

            while (isset($used[$slug])) {
                $slug = $base.'-'.$suffix;
                $suffix++;
            }

            $used[$slug] = true;

            $row->slug = $slug;
            $row->saveQuietly();
        }
    }
};
