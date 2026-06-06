<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        $q = trim((string) ($request->query('search') ?? $request->query('q') ?? ''));

        if (strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $like = '%' . $q . '%';
        $results = [];

        if ($user->role === 'customer') {
            $results = array_merge(
                $results,
                $this->searchClientBookings($user->id, $like, $q),
                $this->searchClientAddresses($user->id, $like),
                $this->searchClientPayments($user->id, $like)
            );
        } elseif ($user->role === 'provider') {
            $provider = $user->ensureProviderProfile();
            if ($provider) {
                $results = array_merge(
                    $results,
                    $this->searchProviderBookings($provider->id, $like, $q),
                    $this->searchProviderServices($provider->id, $like)
                );
            }
        } elseif ($user->role === 'admin') {
            $results = array_merge(
                $results,
                $this->searchAdminUsers($like, $q),
                $this->searchAdminBookings($like, $q),
                $this->searchAdminProviders($like, $q),
                $this->searchAdminServices($like)
            );
        }

        return response()->json(['data' => array_slice($results, 0, 15)]);
    }

    private function searchClientBookings(string $userId, string $like, string $q): array
    {
        return Booking::query()
            ->where('customer_id', $userId)
            ->with('service')
            ->where(function ($query) use ($like, $q) {
                $query->where('booking_number', 'like', $like)
                    ->orWhere('id', 'like', $like)
                    ->orWhereHas('service', fn ($sq) => $sq->where('name', 'like', $like));
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Booking $b) => [
                'id' => 'booking-' . $b->id,
                'title' => $b->service?->name ?? 'Booking',
                'description' => '#' . ($b->booking_number ?? $b->id),
                'url' => '/dashboard/client/bookings?search=' . urlencode($q),
                'category' => 'Bookings',
            ])
            ->all();
    }

    private function searchClientAddresses(string $userId, string $like): array
    {
        return Address::query()
            ->where('user_id', $userId)
            ->where(function ($query) use ($like) {
                $query->where('street_address', 'like', $like)
                    ->orWhere('city', 'like', $like)
                    ->orWhere('postal_code', 'like', $like);
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Address $a) => [
                'id' => 'address-' . $a->id,
                'title' => $a->street_address,
                'description' => trim("{$a->city}, {$a->state}"),
                'url' => '/dashboard/client/services?search=' . urlencode($a->street_address),
                'category' => 'Addresses',
            ])
            ->all();
    }

    private function searchClientPayments(string $userId, string $like): array
    {
        return Payment::query()
            ->where('customer_id', $userId)
            ->with(['booking.service'])
            ->where(function ($query) use ($like) {
                $query->where('transaction_id', 'like', $like)
                    ->orWhere('id', 'like', $like)
                    ->orWhereHas('booking', function ($bq) use ($like) {
                        $bq->where('booking_number', 'like', $like)
                            ->orWhereHas('service', fn ($sq) => $sq->where('name', 'like', $like));
                    });
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Payment $p) {
                $serviceName = $p->booking?->service?->name ?? 'Payment';

                return [
                    'id' => 'payment-' . $p->id,
                    'title' => $serviceName,
                    'description' => $p->transaction_id ?? ('KES ' . number_format((float) $p->amount, 0)),
                    'url' => '/dashboard/client/billing?search=' . urlencode($serviceName),
                    'category' => 'Billing',
                ];
            })
            ->all();
    }

    private function searchProviderBookings(string $providerId, string $like, string $q): array
    {
        return Booking::query()
            ->where('provider_id', $providerId)
            ->with(['service', 'customer'])
            ->where(function ($query) use ($like) {
                $query->where('booking_number', 'like', $like)
                    ->orWhereHas('service', fn ($sq) => $sq->where('name', 'like', $like))
                    ->orWhereHas('customer', function ($cq) use ($like) {
                        $cq->where('first_name', 'like', $like)
                            ->orWhere('last_name', 'like', $like)
                            ->orWhere('email', 'like', $like);
                    });
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Booking $b) => [
                'id' => 'booking-' . $b->id,
                'title' => $b->service?->name ?? 'Job',
                'description' => ($b->customer?->name ?? 'Client') . ' · #' . ($b->booking_number ?? $b->id),
                'url' => '/dashboard/provider/bookings?search=' . urlencode($q),
                'category' => 'Bookings',
            ])
            ->all();
    }

    private function searchProviderServices(string $providerId, string $like): array
    {
        return ProviderService::query()
            ->where('provider_id', $providerId)
            ->with('service.category')
            ->whereHas('service', fn ($sq) => $sq->where('name', 'like', $like))
            ->limit(5)
            ->get()
            ->map(function (ProviderService $ps) {
                $name = $ps->service?->name ?? 'Service';

                return [
                    'id' => 'offering-' . $ps->id,
                    'title' => $name,
                    'description' => $ps->service?->category?->name ?? 'Your offering',
                    'url' => '/dashboard/provider/services?search=' . urlencode($name),
                    'category' => 'Services',
                ];
            })
            ->all();
    }

    private function searchAdminUsers(string $like, string $q): array
    {
        return User::query()
            ->where(function ($query) use ($like) {
                $query->where('email', 'like', $like)
                    ->orWhere('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('phone', 'like', $like);
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (User $u) => [
                'id' => 'user-' . $u->id,
                'title' => $u->name ?: trim("{$u->first_name} {$u->last_name}"),
                'description' => $u->email . ' · ' . $u->role,
                'url' => '/admin/users?search=' . urlencode($q),
                'category' => 'Users',
            ])
            ->all();
    }

    private function searchAdminBookings(string $like, string $q): array
    {
        return Booking::query()
            ->with(['service', 'customer'])
            ->where(function ($query) use ($like) {
                $query->where('booking_number', 'like', $like)
                    ->orWhereHas('service', fn ($sq) => $sq->where('name', 'like', $like))
                    ->orWhereHas('customer', function ($cq) use ($like) {
                        $cq->where('first_name', 'like', $like)
                            ->orWhere('last_name', 'like', $like)
                            ->orWhere('email', 'like', $like);
                    });
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Booking $b) => [
                'id' => 'booking-' . $b->id,
                'title' => $b->service?->name ?? 'Booking',
                'description' => ($b->customer?->name ?? 'Client') . ' · #' . ($b->booking_number ?? $b->id),
                'url' => '/admin/bookings?search=' . urlencode($q),
                'category' => 'Bookings',
            ])
            ->all();
    }

    private function searchAdminProviders(string $like, string $q): array
    {
        return Provider::query()
            ->with('user')
            ->where(function ($query) use ($like) {
                $query->where('business_name', 'like', $like)
                    ->orWhere('location_name', 'like', $like)
                    ->orWhereHas('user', function ($uq) use ($like) {
                        $uq->where('email', 'like', $like)
                            ->orWhere('first_name', 'like', $like)
                            ->orWhere('last_name', 'like', $like);
                    });
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Provider $p) => [
                'id' => 'provider-' . $p->id,
                'title' => $p->business_name,
                'description' => $p->location_name ?? ($p->user?->email ?? 'Provider'),
                'url' => '/admin/providers?search=' . urlencode($q),
                'category' => 'Providers',
            ])
            ->all();
    }

    private function searchAdminServices(string $like): array
    {
        return Service::query()
            ->with('category')
            ->where('name', 'like', $like)
            ->limit(5)
            ->get()
            ->map(fn (Service $s) => [
                'id' => 'service-' . $s->id,
                'title' => $s->name,
                'description' => $s->category?->name ?? 'Catalog service',
                'url' => '/admin/categories?search=' . urlencode($s->name),
                'category' => 'Services',
            ])
            ->all();
    }
}
