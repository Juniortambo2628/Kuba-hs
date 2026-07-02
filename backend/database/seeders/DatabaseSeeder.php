<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Convention: schema changes (DDL) go in migrations, data seeding goes here.
     * Data fixes that depend on a schema change (e.g. backfilling a new column)
     * stay as migrations. Pure inserts of default/reference data belong in seeders.
     */
    public function run(): void
    {
        $this->call([
            SiteSettingsDataSeeder::class,
            ProductionDataSeeder::class,
            LoyaltyTierSeeder::class,
            EmailTemplateSeeder::class,
        ]);
    }
}
