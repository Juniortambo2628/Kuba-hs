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
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['provider_id']);
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['application_status']);
            $table->dropIndex(['availability_status']);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_featured']);
        });

        Schema::table('provider_services', function (Blueprint $table) {
            $table->dropIndex(['provider_id']);
            $table->dropIndex(['service_id']);
            $table->dropIndex(['provider_id', 'service_id']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['booking_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['provider_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('user_favorites', function (Blueprint $table) {
            $table->index('user_id');
        });
    }
};
