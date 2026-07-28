<?php

use App\Models\Provider;
use App\Models\User;

describe('provider dashboard API', function () {
    beforeEach(function () {
        $this->user = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->user->id]);
    });

    it('returns dashboard stats for provider', function () {
        $response = $this->actingAs($this->user)
            ->getJson('/api/provider/dashboard');

        $response->assertOk();
        $response->assertJsonStructure([
            'stats' => [
                'total_earnings',
                'active_bookings',
                'completed_bookings',
                'avg_rating',
                'reputation_score',
            ],
            'recent_bookings',
            'profile',
            'verification',
        ]);
    });

    it('returns 403 if provider profile not found', function () {
        $userWithoutProvider = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($userWithoutProvider)
            ->getJson('/api/provider/dashboard');

        $response->assertForbidden();
    });
});
