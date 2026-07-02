<?php

namespace App\Http\Controllers\Api;

use App\Enums\ProviderApplicationStatus;
use App\Enums\UserRole;
use App\Enums\VerificationDocumentStatus;
use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\VerificationDocument;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role === UserRole::Admin) {
            return VerificationDocument::with('provider.user')->latest()->get();
        }

        $provider = $user->ensureProviderProfile();
        if (! $provider) {
            return response()->json(['message' => 'Not a provider'], 403);
        }

        return \App\Http\Resources\VerificationDocumentResource::collection(
            $provider->verificationDocuments()->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->ensureProviderProfile();
        if (! $provider) {
            return response()->json(['message' => 'Not a provider'], 403);
        }

        $validated = $request->validate([
            'document_type' => 'required|string|in:id_card,business_license,certification',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ], [
            'file.required' => 'Please choose a file to upload.',
            'file.mimes' => 'Use PDF, JPG, or PNG (max 5MB).',
            'file.max' => 'File must be 5MB or smaller.',
            'document_type.in' => 'Invalid document type selected.',
        ]);

        $file = $request->file('file');
        $optimizer = app(ImageOptimizationService::class);

        if (str_starts_with($file->getMimeType() ?? '', 'image/')) {
            $path = $optimizer->storeAndOptimize(
                $file,
                'verification_docs',
                'public',
                ImageOptimizationService::PRESET_DOCUMENT
            );
        } else {
            $path = $file->store('verification_docs', 'public');
        }

        $doc = VerificationDocument::create([
            'provider_id' => $provider->id,
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'status' => VerificationDocumentStatus::Pending,
        ]);

        // Update provider application status to reviewed if it was rejected previously
        if ($provider->application_status === ProviderApplicationStatus::Rejected) {
            $provider->update(['application_status' => ProviderApplicationStatus::Pending]);
        }

        return response()->json([
            'message' => 'Document submitted for verification',
            'document' => new \App\Http\Resources\VerificationDocumentResource($doc),
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        if ($request->user()->role !== UserRole::Admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|string|nullable',
        ]);

        $doc = VerificationDocument::findOrFail($id);
        $doc->update($request->only('status', 'rejection_reason'));

        $provider = $doc->provider;

        // Check if all required docs are approved
        // Simple logic: if at least 2 docs (ID and License) are approved, mark provider as verified
        $approvedCount = $provider->verificationDocuments()->where('status', 'approved')->count();

        if ($approvedCount >= 2 && $request->status === 'approved') {
            $provider->update([
                'is_verified' => true,
                'application_status' => 'active',
            ]);
        } elseif ($request->status === 'rejected') {
            $provider->update([
                'is_verified' => false,
                'application_status' => 'rejected',
            ]);
        }

        return response()->json([
            'message' => 'Verification status updated',
            'document' => $doc,
            'provider_status' => $provider->application_status,
        ]);
    }
}
