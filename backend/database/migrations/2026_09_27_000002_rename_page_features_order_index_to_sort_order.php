<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('page_features', function (Blueprint $table) {
            $table->renameColumn('order_index', 'sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('page_features', function (Blueprint $table) {
            $table->renameColumn('sort_order', 'order_index');
        });
    }
};
