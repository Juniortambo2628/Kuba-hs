<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminProviderResource;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = Provider::query()
            ->with(['user:id,first_name,last_name,email,phone,is_active,avatar_url'])
            ->withCount(['providerServices', 'reviews'])
            ->withAvg('reviews', 'rating');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                    ->orWhere('location_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('email', 'like', "%{$search}%")
                            ->orWhere('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('compliance_status')) {
            $query->where('compliance_status', $request->compliance_status);
        }

        if ($request->filled('application_status')) {
            $query->where('application_status', $request->application_status);
        }

        if ($request->filled('is_verified')) {
            $query->where('is_verified', filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN));
        }

        $providers = $query->latest()->paginate(15)->withQueryString();

        $providers->getCollection()->transform(function (Provider $provider) {
            $provider->bookings_count = Booking::where('provider_id', $provider->id)->count();
            return $provider;
        });

        return AdminProviderResource::collection($providers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'location_name' => 'nullable|string|max:255',
            'application_status' => ['nullable', Rule::in(['pending', 'approved', 'active', 'rejected', 'suspended'])],
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'first_name' => $validated['first_name'] ?? $validated['business_name'],
                'last_name' => $validated['last_name'] ?? '',
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => 'provider',
                'is_active' => true,
                'is_verified' => false,
            ]);

            $provider = Provider::create([
                'user_id' => $user->id,
                'business_name' => $validated['business_name'],
                'bio' => $validated['bio'] ?? null,
                'experience_years' => $validated['experience_years'] ?? 0,
                'location_name' => $validated['location_name'] ?? null,
                'application_status' => $validated['application_status'] ?? 'approved',
                'availability_status' => 'available',
                'compliance_status' => 'pending',
                'is_verified' => false,
            ]);

            $provider->load('user');
            $provider->bookings_count = 0;
            $provider->provider_services_count = 0;
            $provider->reviews_count = 0;

            return (new AdminProviderResource($provider))
                ->response()
                ->setStatusCode(201);
        });
    }

    public function show(Provider $provider)
    {
        $provider->load(['user', 'verificationDocuments'])
            ->loadCount(['providerServices', 'reviews'])
            ->loadAvg('reviews', 'rating');

        $provider->bookings_count = Booking::where('provider_id', $provider->id)->count();

        return new AdminProviderResource($provider);
    }

    public function update(Request $request, Provider $provider)
    {
        $validated = $request->validate([
            'business_name' => 'sometimes|required|string|max:255',
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'location_name' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'service_radius' => 'nullable|integer|min:1|max:500',
            'specialized_skills' => 'nullable|array',
            'specialized_skills.*' => 'string|max:255',
            'availability_status' => ['nullable', Rule::in(['available', 'busy', 'offline'])],
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($provider->user_id)],
        ]);

        if ($provider->user) {
            $userData = array_filter([
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
            ], fn ($v) => $v !== null);

            if ($userData !== []) {
                $provider->user->update($userData);
            }
        }

        $provider->update(collect($validated)->only([
            'business_name',
            'bio',
            'experience_years',
            'location_name',
            'latitude',
            'longitude',
            'service_radius',
            'specialized_skills',
            'availability_status',
        ])->filter(fn ($v) => $v !== null)->all());

        $provider->load(['user', 'verificationDocuments'])
            ->loadCount(['providerServices', 'reviews'])
            ->loadAvg('reviews', 'rating');
        $provider->bookings_count = Booking::where('provider_id', $provider->id)->count();

        return response()->json([
            'message' => 'Provider updated successfully.',
            'provider' => new AdminProviderResource($provider),
        ]);
    }

    public function updateStatus(Request $request, Provider $provider)
    {
        $validated = $request->validate([
            'application_status' => ['nullable', Rule::in(['pending', 'approved', 'active', 'rejected', 'suspended'])],
            'is_verified' => 'nullable|boolean',
            'availability_status' => ['nullable', Rule::in(['available', 'busy', 'offline'])],
            'compliance_status' => ['nullable', Rule::in(['pending', 'compliant', 'non_compliant', 'expiring_soon'])],
        ]);

        $provider->update(array_filter($validated, fn ($v) => $v !== null));

        if (isset($validated['application_status']) && in_array($validated['application_status'], ['active', 'approved'], true)) {
            $provider->update(['is_verified' => $validated['is_verified'] ?? true]);
        }

        if (isset($validated['application_status']) && $validated['application_status'] === 'suspended') {
            $provider->user?->update(['is_active' => false]);
            $provider->update(['availability_status' => 'offline']);
        }

        $provider->load('user');

        return response()->json([
            'message' => 'Provider status updated.',
            'provider' => new AdminProviderResource($provider),
        ]);
    }

    public function destroy(Provider $provider)
    {
        if ($provider->user) {
            $provider->user->update(['is_active' => false]);
        }

        $provider->update([
            'application_status' => 'suspended',
            'availability_status' => 'offline',
        ]);

        return response()->json([
            'message' => 'Provider deactivated successfully.',
        ]);
    }
}
