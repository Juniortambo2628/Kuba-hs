<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Split hero_media group: images → hero_backgrounds, text → hero_text
        DB::table('site_settings')
            ->where('group', 'hero_media')
            ->where('type', 'image')
            ->update(['group' => 'hero_backgrounds']);

        DB::table('site_settings')
            ->where('group', 'hero_media')
            ->whereIn('type', ['text', 'textarea'])
            ->update(['group' => 'hero_text']);
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->whereIn('group', ['hero_backgrounds', 'hero_text'])
            ->update(['group' => 'hero_media']);
    }
};
