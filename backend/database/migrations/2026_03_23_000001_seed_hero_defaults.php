<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $defaults = [
            'services_hero_image' => 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop', // Cleaning/Service
            'providers_hero_image' => 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop', // Professionals
            'journal_hero_image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop', // Office/Journal
            'contact_hero_image' => 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop', // Contact/Support
            'commercial_hero_image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop', // Business
            'investors_hero_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2072&auto=format&fit=crop', // Growth/Investors
            'about_hero_image' => 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop', // Team/About
            'cooperatives_hero_image' => 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2070&auto=format&fit=crop', // Community/Coperative
        ];

        foreach ($defaults as $key => $value) {
            DB::table('site_settings')
                ->where('key', $key)
                ->where(function($query) {
                    $query->whereNull('value')->orWhere('value', '');
                })
                ->update(['value' => $value]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down migration needed as this just fills empty defaults
    }
};
