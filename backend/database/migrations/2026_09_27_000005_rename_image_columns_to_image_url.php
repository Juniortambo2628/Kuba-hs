<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->renameColumn('image', 'image_url');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('avatar_url', 'image_url');
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->renameColumn('avatar', 'image_url');
        });

        Schema::table('trust_partners', function (Blueprint $table) {
            $table->renameColumn('logo_path', 'image_url');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->renameColumn('image_url', 'image');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('image_url', 'avatar_url');
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->renameColumn('image_url', 'avatar');
        });

        Schema::table('trust_partners', function (Blueprint $table) {
            $table->renameColumn('image_url', 'logo_path');
        });
    }
};
