<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('providers', 'verification_documents')) {
            Schema::table('providers', function (Blueprint $table) {
                $table->dropColumn('verification_documents');
            });
        }

        if (!Schema::hasTable('loyalty_points') || !Schema::hasColumn('loyalty_points', 'user_id')) {
            return;
        }

        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        $database = Schema::getConnection()->getDatabaseName();
        $existing = collect(DB::select(
            'SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
             WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_TYPE = ?',
            [$database, 'loyalty_points', 'FOREIGN KEY']
        ))->pluck('CONSTRAINT_NAME')->all();

        if (!in_array('loyalty_points_user_id_foreign', $existing, true)) {
            Schema::table('loyalty_points', function (Blueprint $table) {
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('providers', 'verification_documents')) {
            Schema::table('providers', function (Blueprint $table) {
                $table->json('verification_documents')->nullable();
            });
        }
    }
};
