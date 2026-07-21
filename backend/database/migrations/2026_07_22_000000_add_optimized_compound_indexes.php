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
        Schema::table('bookings', function (Blueprint $table) {
            $table->index(['customer_id', 'status', 'created_at'], 'idx_bookings_cust_status');
            $table->index(['provider_id', 'status', 'created_at'], 'idx_bookings_prov_status');
        });

        Schema::table('verification_documents', function (Blueprint $table) {
            $table->index(['provider_id', 'status'], 'idx_verif_docs_prov_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('idx_bookings_cust_status');
            $table->dropIndex('idx_bookings_prov_status');
        });

        Schema::table('verification_documents', function (Blueprint $table) {
            $table->dropIndex('idx_verif_docs_prov_status');
        });
    }
};
