<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $settingId = (string) Str::uuid();
        
        DB::table('site_settings')->insert([
            'id' => $settingId,
            'key' => 'category_detail_hero_image',
            'value' => null,
            'label' => 'Category Detail View Hero',
            'type' => 'image',
            'group' => 'hero_backgrounds',
            'description' => 'The customizable background image for individual service category pages (e.g., viewing Electrician category).',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('site_settings')
            ->where('key', 'category_detail_hero_image')
            ->delete();
    }
};
