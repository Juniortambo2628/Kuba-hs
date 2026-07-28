<?php

use App\Models\Booking;
use App\Models\BookingActivityLog;
use App\Models\User;
use App\Services\BookingActivityLogService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('BookingActivityLogService', function () {
    beforeEach(function () {
        $this->service = new BookingActivityLogService;
        $this->booking = Booking::factory()->create();
        $this->user = User::factory()->create(['role' => 'admin']);
    });

    it('logs a booking activity', function () {
        $log = $this->service->log(
            $this->booking,
            'created',
            $this->user,
            'Booking created',
            ['status' => 'pending']
        );

        expect($log)->not->toBeNull();
        expect($log->booking_id)->toBe($this->booking->id);
        expect($log->user_id)->toBe($this->user->id);
        expect($log->action)->toBe('created');
        expect($log->description)->toBe('Booking created');
        expect($log->metadata)->toBe(['status' => 'pending']);
    });

    it('logs with null user', function () {
        $log = $this->service->log(
            $this->booking,
            'system_event',
            null,
            'System triggered event'
        );

        expect($log->user_id)->toBeNull();
        expect($log->action)->toBe('system_event');
    });

    it('logs a status change', function () {
        $log = $this->service->logStatusChange($this->booking, $this->user, 'pending', 'confirmed');

        expect($log->action)->toBe('status_changed');
        expect($log->description)->toBe('Status changed from pending to confirmed');
        expect($log->metadata)->toBe(['from' => 'pending', 'to' => 'confirmed']);
    });
});
