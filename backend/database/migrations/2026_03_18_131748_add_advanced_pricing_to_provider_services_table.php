<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('provider_services', function (Blueprint $table) {
            $table->integer('min_hours')->default(1);
            $table->decimal('travel_fee', 10, 2)->default(0);
            $table->boolean('equipment_included')->default(false);
            $table->json('extra_configs')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('provider_services', function (Blueprint $table) {
            $table->dropColumn(['min_hours', 'travel_fee', 'equipment_included', 'extra_configs']);
        });
    }
};
