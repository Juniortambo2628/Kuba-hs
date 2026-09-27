<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrustPartner;

class TrustPartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            ['name' => 'Google', 'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'],
            ['name' => 'Microsoft', 'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'],
            ['name' => 'Amazon', 'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'],
            ['name' => 'Airbnb', 'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg'],
            ['name' => 'Uber', 'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg'],
            ['name' => 'Stripe', 'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg'],
        ];

        foreach ($partners as $partner) {
            TrustPartner::create($partner);
        }
    }
}
