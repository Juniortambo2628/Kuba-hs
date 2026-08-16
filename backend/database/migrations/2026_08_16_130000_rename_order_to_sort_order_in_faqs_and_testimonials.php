<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->renameColumn('order', 'sort_order');
        });
        Schema::table('testimonials', function (Blueprint $table) {
            $table->renameColumn('order', 'sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->renameColumn('sort_order', 'order');
        });
        Schema::table('testimonials', function (Blueprint $table) {
            $table->renameColumn('sort_order', 'order');
        });
    }
};
