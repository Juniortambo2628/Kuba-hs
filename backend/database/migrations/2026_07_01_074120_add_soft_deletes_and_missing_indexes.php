<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Soft deletes for financial/compliance records
        Schema::table('payouts', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('loyalty_points', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('promo_codes', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Missing FK indexes
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('promo_code_id');
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->index('author_id');
        });
    }

    public function down(): void
    {
        Schema::table('payouts', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('loyalty_points', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('promo_codes', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['promo_code_id']);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex(['author_id']);
        });
    }
};
