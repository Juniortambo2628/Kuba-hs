<?php

use App\Models\Setting;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel if needed, but we'll run this via 'php artisan tinker' style or just a direct script
// For simplicity, we'll use a direct DB insert if we can, or just provide the logic for the user to run in tinker.

$settings = [
    ['key' => 'commercial_thesis_title', 'value' => 'Consolidated Excellence for Modern Enterprise', 'group' => 'sections', 'label' => 'Commercial Thesis Title', 'type' => 'text'],
    ['key' => 'commercial_thesis_body', 'value' => 'Kuba provides a unified service infrastructure for organizations that demand quality and accountability. From daily janitorial needs to complex facility management, we scale with your business.', 'group' => 'sections', 'label' => 'Commercial Thesis Body', 'type' => 'textarea'],
    ['key' => 'cooperatives_thesis_title', 'value' => 'Stronger Together through Shared Services', 'group' => 'sections', 'label' => 'Cooperatives Thesis Title', 'type' => 'text'],
    ['key' => 'cooperatives_thesis_body', 'value' => 'We help gated communities and SACCOs leverage collective bargaining power to secure premium home services at negotiated rates, managed via a single platform.', 'group' => 'sections', 'label' => 'Cooperatives Thesis Body', 'type' => 'textarea'],
];

foreach ($settings as $s) {
    if (!DB::table('settings')->where('key', $s['key'])->exists()) {
        DB::table('settings')->insert(array_merge($s, [
            'created_at' => now(),
            'updated_at' => now(),
        ]));
        echo "Inserted: {$s['key']}\n";
    } else {
        echo "Skipped (exists): {$s['key']}\n";
    }
}
