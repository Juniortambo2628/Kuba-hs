<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bookings — additional performance indexes
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('service_type');
            $table->index('scheduled_date');
            $table->index(['customer_id', 'status']);
            $table->index(['provider_id', 'status']);
        });

        // Providers — compliance and quality queries
        Schema::table('providers', function (Blueprint $table) {
            $table->index('compliance_status');
            $table->index('quality_score');
        });

        // Promo codes — validation lookups
        Schema::table('promo_codes', function (Blueprint $table) {
            $table->index('is_active');
        });

        // Loyalty points — user history queries
        Schema::table('loyalty_points', function (Blueprint $table) {
            $table->index(['user_id', 'transaction_type']);
        });

        // Payouts — management queries
        Schema::table('payouts', function (Blueprint $table) {
            $table->index('status');
            $table->index('provider_id');
        });

        // Verification documents — compliance checks
        Schema::table('verification_documents', function (Blueprint $table) {
            $table->index('status');
        });

        // Admin export logs — audit queries
        Schema::table('admin_export_logs', function (Blueprint $table) {
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['service_type']);
            $table->dropIndex(['scheduled_date']);
            $table->dropIndex(['customer_id', 'status']);
            $table->dropIndex(['provider_id', 'status']);
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->dropIndex(['compliance_status']);
            $table->dropIndex(['quality_score']);
        });

        Schema::table('promo_codes', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('loyalty_points', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'transaction_type']);
        });

        Schema::table('payouts', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['provider_id']);
        });

        Schema::table('verification_documents', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('admin_export_logs', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });
    }
};
