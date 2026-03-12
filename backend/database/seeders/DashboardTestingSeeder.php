<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\LoyaltyPoint;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DashboardTestingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Test Client
        $client = User::updateOrCreate(
            ['email' => 'client@example.com'],
            [
                'first_name' => 'Jane',
                'last_name' => 'Client',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_verified' => true,
            ]
        );

        // 2. Create Test Provider
        $providerUser = User::updateOrCreate(
            ['email' => 'provider@example.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Provider',
                'password' => Hash::make('password'),
                'role' => 'provider',
                'is_verified' => true,
            ]
        );

        $provider = Provider::updateOrCreate(
            ['user_id' => $providerUser->id],
            [
                'business_name' => 'Expert Home Care',
                'bio' => 'Professional home service provider with over 10 years of experience in various residential repairs.',
                'experience_years' => 10,
                'location_name' => 'New York, NY',
                'is_verified' => true,
            ]
        );

        // 3. Create Address for Client
        $address = \App\Models\Address::updateOrCreate(
            [
                'user_id' => $client->id,
                'is_default' => true,
            ],
            [
                'address_type' => 'residential',
                'street_address' => '123 Test Street',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'USA',
            ]
        );

        // 4. Link Services to Provider
        $services = Service::take(3)->get();
        foreach ($services as $service) {
            ProviderService::updateOrCreate(
                [
                    'provider_id' => $provider->id,
                    'service_id' => $service->id,
                ],
                [
                    'base_price' => rand(50, 150),
                    'pricing_type' => 'hourly',
                    'is_available' => true,
                ]
            );
        }

        // 5. Seed Bookings in different statuses
        $statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        
        foreach ($statuses as $index => $status) {
            $booking = Booking::create([
                'id' => Str::uuid(),
                'customer_id' => $client->id,
                'provider_id' => $provider->id,
                'service_id' => $services->random()->id,
                'address_id' => $address->id,
                'booking_number' => 'BK-' . strtoupper(Str::random(8)),
                'scheduled_date' => now()->addDays($index + 1),
                'scheduled_end_date' => now()->addDays($index + 1)->addHours(2),
                'status' => $status,
                'description' => "This is a test booking for {$status} status.",
                'service_type' => 'residential',
                'quantity' => 1,
                'estimated_price' => 100.00,
                'final_price' => $status === 'completed' ? 100.00 : null,
                'payment_status' => $status === 'completed' ? 'paid' : 'pending',
            ]);

            // 6. Seed Review for Completed Booking
            if ($status === 'completed') {
                Review::create([
                    'booking_id' => $booking->id,
                    'customer_id' => $client->id,
                    'provider_id' => $provider->id,
                    'rating' => 5,
                    'comment' => "Excellent service! Highly recommended.",
                ]);

                // Seed Loyalty Points for completed booking
                LoyaltyPoint::create([
                    'user_id' => $client->id,
                    'points' => 50,
                    'description' => "Points earned for booking {$booking->booking_number}",
                    'transaction_type' => 'earn',
                ]);
            }
        }

        // Add some more points to client
        LoyaltyPoint::create([
            'user_id' => $client->id,
            'points' => 1000,
            'description' => "Welcome bonus points",
            'transaction_type' => 'earn',
        ]);
    }
}
