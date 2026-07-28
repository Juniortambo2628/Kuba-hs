<?php

use App\Enums\BookingStatus;
use App\Enums\BookingPaymentStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProviderApplicationStatus;
use App\Enums\ProviderAvailabilityStatus;
use App\Enums\ProviderComplianceStatus;
use App\Enums\PayoutStatus;
use App\Enums\ReviewStatus;
use App\Enums\UserRole;

describe('Enums', function () {
    it('has correct BookingStatus cases', function () {
        expect(BookingStatus::cases())->toHaveCount(5);
        expect(BookingStatus::Pending->value)->toBe('pending');
        expect(BookingStatus::Confirmed->value)->toBe('confirmed');
        expect(BookingStatus::InProgress->value)->toBe('in_progress');
        expect(BookingStatus::Completed->value)->toBe('completed');
        expect(BookingStatus::Cancelled->value)->toBe('cancelled');
    });

    it('returns correct BookingStatus labels', function () {
        expect(BookingStatus::Pending->label())->toBe('Pending');
        expect(BookingStatus::InProgress->label())->toBe('In Progress');
        expect(BookingStatus::Cancelled->label())->toBe('Cancelled');
    });

    it('has correct BookingPaymentStatus cases', function () {
        expect(BookingPaymentStatus::cases())->toHaveCount(3);
        expect(BookingPaymentStatus::Pending->value)->toBe('pending');
        expect(BookingPaymentStatus::Paid->value)->toBe('paid');
        expect(BookingPaymentStatus::Refunded->value)->toBe('refunded');
    });

    it('has correct PaymentStatus cases', function () {
        expect(PaymentStatus::cases())->toHaveCount(5);
        expect(PaymentStatus::Completed->value)->toBe('completed');
        expect(PaymentStatus::Failed->value)->toBe('failed');
    });

    it('has correct UserRole cases', function () {
        expect(UserRole::cases())->toHaveCount(3);
        expect(UserRole::Customer->value)->toBe('customer');
        expect(UserRole::Provider->value)->toBe('provider');
        expect(UserRole::Admin->value)->toBe('admin');
    });

    it('returns correct UserRole labels', function () {
        expect(UserRole::Customer->label())->toBe('Customer');
        expect(UserRole::Provider->label())->toBe('Provider');
        expect(UserRole::Admin->label())->toBe('Admin');
    });

    it('has correct ReviewStatus cases', function () {
        expect(ReviewStatus::cases())->toHaveCount(3);
        expect(ReviewStatus::Published->value)->toBe('published');
        expect(ReviewStatus::Hidden->value)->toBe('hidden');
        expect(ReviewStatus::Resolved->value)->toBe('resolved');
    });

    it('has correct ProviderApplicationStatus cases', function () {
        expect(ProviderApplicationStatus::cases())->toHaveCount(5);
        expect(ProviderApplicationStatus::Pending->value)->toBe('pending');
        expect(ProviderApplicationStatus::Approved->value)->toBe('approved');
        expect(ProviderApplicationStatus::Active->value)->toBe('active');
        expect(ProviderApplicationStatus::Rejected->value)->toBe('rejected');
        expect(ProviderApplicationStatus::Suspended->value)->toBe('suspended');
    });

    it('has correct ProviderAvailabilityStatus cases', function () {
        expect(ProviderAvailabilityStatus::cases())->toHaveCount(3);
        expect(ProviderAvailabilityStatus::Available->value)->toBe('available');
        expect(ProviderAvailabilityStatus::Busy->value)->toBe('busy');
        expect(ProviderAvailabilityStatus::Offline->value)->toBe('offline');
    });

    it('has correct ProviderComplianceStatus cases', function () {
        expect(ProviderComplianceStatus::cases())->toHaveCount(4);
        expect(ProviderComplianceStatus::Pending->value)->toBe('pending');
        expect(ProviderComplianceStatus::Compliant->value)->toBe('compliant');
        expect(ProviderComplianceStatus::NonCompliant->value)->toBe('non_compliant');
        expect(ProviderComplianceStatus::ExpiringSoon->value)->toBe('expiring_soon');
    });

    it('has correct PayoutStatus cases', function () {
        expect(PayoutStatus::cases())->toHaveCount(5);
        expect(PayoutStatus::Pending->value)->toBe('pending');
        expect(PayoutStatus::Paid->value)->toBe('paid');
        expect(PayoutStatus::Rejected->value)->toBe('rejected');
    });

    it('returns correct label for all ProviderApplicationStatus', function () {
        expect(ProviderApplicationStatus::Pending->label())->toBe('Pending');
        expect(ProviderApplicationStatus::Approved->label())->toBe('Approved');
        expect(ProviderApplicationStatus::Active->label())->toBe('Active');
        expect(ProviderApplicationStatus::Rejected->label())->toBe('Rejected');
        expect(ProviderApplicationStatus::Suspended->label())->toBe('Suspended');
    });

    it('returns correct label for all ProviderAvailabilityStatus', function () {
        expect(ProviderAvailabilityStatus::Available->label())->toBe('Available');
        expect(ProviderAvailabilityStatus::Busy->label())->toBe('Busy');
        expect(ProviderAvailabilityStatus::Offline->label())->toBe('Offline');
    });

    it('returns correct label for all PayoutStatus', function () {
        expect(PayoutStatus::Pending->label())->toBe('Pending');
        expect(PayoutStatus::Approved->label())->toBe('Approved');
        expect(PayoutStatus::Processing->label())->toBe('Processing');
        expect(PayoutStatus::Paid->label())->toBe('Paid');
        expect(PayoutStatus::Rejected->label())->toBe('Rejected');
    });
});
