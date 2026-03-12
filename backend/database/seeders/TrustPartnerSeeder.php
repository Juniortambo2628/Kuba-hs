<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrustPartner;

class TrustPartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            ['name' => 'Google', 'logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'],
            ['name' => 'Microsoft', 'logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'],
            ['name' => 'Amazon', 'logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'],
            ['name' => 'Airbnb', 'logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg'],
            ['name' => 'Uber', 'logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg'],
            ['name' => 'Stripe', 'logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg'],
        ];

        foreach ($partners as $partner) {
            TrustPartner::create($partner);
        }
    }
}
