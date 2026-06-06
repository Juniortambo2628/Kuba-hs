<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('reviews') || !Schema::hasColumn('reviews', 'status')) {
            return;
        }

        DB::table('reviews')
            ->where(function ($q) {
                $q->whereNull('status')->orWhere('status', '');
            })
            ->update(['status' => 'published']);
    }

    public function down(): void
    {
        // Non-destructive rollback: leave column as-is
    }
};
