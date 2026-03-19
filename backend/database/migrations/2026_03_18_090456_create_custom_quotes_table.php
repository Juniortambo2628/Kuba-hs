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
        Schema::create('custom_quotes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('organization_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('organization_type'); // commercial, cooperative, other
            $table->string('service_category');
            $table->string('estimated_volume')->nullable();
            $table->text('description');
            $table->string('status')->default('pending'); // pending, reviewed, contacted, closed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_quotes');
    }
};
