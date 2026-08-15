<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bookings — most queried table, missing FK indexes
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('provider_id');
            $table->index('customer_id');
            $table->index('status');
            $table->index('created_at');
        });

        // Providers — compliance and search queries
        Schema::table('providers', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('application_status');
            $table->index('availability_status');
        });

        // Services — listing filters
        Schema::table('services', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('is_featured');
        });

        // Pivot table FK indexes (SQLite doesn't auto-create)
        Schema::table('provider_services', function (Blueprint $table) {
            $table->index('provider_id');
            $table->index('service_id');
        });

        // Payments — financial reports
        Schema::table('payments', function (Blueprint $table) {
            $table->index('booking_id');
            $table->index('status');
        });

        // Reviews — provider page and admin moderation
        Schema::table('reviews', function (Blueprint $table) {
            $table->index('provider_id');
            $table->index('status');
        });

        // CMS content filters
        Schema::table('faqs', function (Blueprint $table) {
            $table->index('is_active');
        });
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->index('is_published');
        });
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index('status');
        });

        // Unique composite to prevent duplicate service assignments
        Schema::table('provider_services', function (Blueprint $table) {
            $table->unique(['provider_id', 'service_id']);
        });

        // Remove redundant individual index on user_favorites
        // (the unique constraint on (user_id, provider_id) covers user_id lookups)
        Schema::table('user_favorites', function (Blueprint $table) {
            $table->dropIndex('user_favorites_user_id_index');
        });
    }

    public function down(): void
    {
        $dropIndexSafely = function (string $table, $columns) {
            try {
                Schema::table($table, function (Blueprint $table) use ($columns) {
                    $table->dropIndex($columns);
                });
            } catch (\Exception $e) {
                // Index may not exist (e.g., SQLite behaves differently with composite indexes)
            }
        };

        $dropIndexSafely('bookings', ['provider_id']);
        $dropIndexSafely('bookings', ['customer_id']);
        $dropIndexSafely('bookings', ['status']);
        $dropIndexSafely('bookings', ['created_at']);

        $dropIndexSafely('providers', ['user_id']);
        $dropIndexSafely('providers', ['application_status']);
        $dropIndexSafely('providers', ['availability_status']);

        $dropIndexSafely('services', ['is_active']);
        $dropIndexSafely('services', ['is_featured']);

        $dropIndexSafely('provider_services', ['provider_id']);
        $dropIndexSafely('provider_services', ['service_id']);
        $dropIndexSafely('provider_services', ['provider_id', 'service_id']);

        $dropIndexSafely('payments', ['booking_id']);
        $dropIndexSafely('payments', ['status']);

        $dropIndexSafely('reviews', ['provider_id']);
        $dropIndexSafely('reviews', ['status']);

        $dropIndexSafely('faqs', ['is_active']);
        $dropIndexSafely('blog_posts', ['is_published']);
        $dropIndexSafely('contact_messages', ['status']);

        $dropIndexSafely('user_favorites', ['user_id']);

        Schema::table('user_favorites', function (Blueprint $table) {
            $table->index('user_id');
        });
    }
};
