<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tables whose Eloquent model uses SoftDeletes, and therefore gets a
     * `WHERE deleted_at IS NULL` predicate on every read.
     */
    private array $softDeleteTables = [
        'bookings',
        'conversations',
        'loyalty_points',
        'messages',
        'payments',
        'payouts',
        'promo_codes',
        'providers',
        'reviews',
        'service_categories',
        'services',
        'users',
    ];

    public function up(): void
    {
        // Chat lists sort by the newest message (Api\ChatController:29, Admin\AdminChatController:15).
        Schema::table('conversations', function (Blueprint $table) {
            $table->index('last_message_at');
        });

        // Admin user listing filters on role/is_active and sorts by created_at.
        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
            $table->index('is_active');
            $table->index('created_at');
        });

        // M-Pesa callback resolves the booking by checkout id (Api\MpesaController:104).
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('mpesa_checkout_id');
        });

        // Finance/payment listings filter and group over these.
        Schema::table('payments', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('payment_method');
        });

        // Admin settings page groups every row by group.
        Schema::table('site_settings', function (Blueprint $table) {
            $table->index('group');
        });

        Schema::table('page_features', function (Blueprint $table) {
            $table->index('order_index');
            $table->index('is_active');
        });

        // Unread-message counts and mark-as-read updates (Api\ChatController:63,161).
        Schema::table('messages', function (Blueprint $table) {
            $table->index('read_at');
        });

        Schema::table('service_categories', function (Blueprint $table) {
            $table->index('name');
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->index('is_verified');
        });

        // Public FAQ/testimonial reads: where is_active = true order by sort_order.
        Schema::table('faqs', function (Blueprint $table) {
            $table->index(['is_active', 'sort_order']);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->index(['is_active', 'sort_order']);
        });

        foreach ($this->softDeleteTables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->index('deleted_at');
            });
        }
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropIndex(['last_message_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['mpesa_checkout_id']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['payment_method']);
        });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropIndex(['group']);
        });

        Schema::table('page_features', function (Blueprint $table) {
            $table->dropIndex(['order_index']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['read_at']);
        });

        Schema::table('service_categories', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->dropIndex(['is_verified']);
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'sort_order']);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'sort_order']);
        });

        foreach ($this->softDeleteTables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropIndex(['deleted_at']);
            });
        }
    }
};
