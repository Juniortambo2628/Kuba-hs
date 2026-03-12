<?php

namespace Database\Seeders;

use App\Models\LoyaltyTier;
use Illuminate\Database\Seeder;

class LoyaltyTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = [
            [
                'name' => 'Bronze',
                'min_points' => 0,
                'benefits' => ['5% discount on first booking', 'Basic support'],
                'icon' => 'award',
                'is_active' => true,
            ],
            [
                'name' => 'Silver',
                'min_points' => 500,
                'benefits' => ['10% discount on all bookings', 'Priority support', 'Exclusive deals'],
                'icon' => 'medal',
                'is_active' => true,
            ],
            [
                'name' => 'Gold',
                'min_points' => 1500,
                'benefits' => ['15% discount on all bookings', '24/7 dedicated support', 'Free seasonal inspection'],
                'icon' => 'crown',
                'is_active' => true,
            ],
            [
                'name' => 'Platinum',
                'min_points' => 5000,
                'benefits' => ['25% discount on all bookings', 'Personal concierge', 'Complimentary annual deep cleaning'],
                'icon' => 'gem',
                'is_active' => true,
            ],
        ];

        foreach ($tiers as $tier) {
            LoyaltyTier::updateOrCreate(
                ['name' => $tier['name']],
                $tier
            );
        }
    }
}
