<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('custom_quotes', 'source')) {
            Schema::table('custom_quotes', function (Blueprint $table) {
                $table->string('source', 64)->nullable();
            });
        }

        // Data moved to SiteSettingsDataSeeder.
    }

    public function down(): void
    {
        if (Schema::hasColumn('custom_quotes', 'source')) {
            Schema::table('custom_quotes', function (Blueprint $table) {
                $table->dropColumn('source');
            });
        }
    }
};
