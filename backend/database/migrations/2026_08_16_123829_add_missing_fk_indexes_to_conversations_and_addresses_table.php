<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->index('customer_id');
            $table->index('provider_id');
        });

        Schema::table('addresses', function (Blueprint $table) {
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['provider_id']);
        });

        Schema::table('addresses', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });
    }
};
