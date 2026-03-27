<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\VerificationDocument;
use App\Services\ProviderQualityService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ComplianceController extends Controller
{
    protected ProviderQualityService $qualityService;

    public function __construct(ProviderQualityService $qualityService)
    {
        $this->qualityService = $qualityService;
    }

    /**
     * Get aggregate overview of compliance stats.
     */
    public function overview(): JsonResponse
    {
        $pendingReviews = VerificationDocument::where('status', 'pending')->count();
        
        $expiringSoon = Provider::where('compliance_status', 'expiring_soon')->count();
        $nonCompliant = Provider::where('compliance_status', 'non_compliant')->count();
        $compliant = Provider::where('compliance_status', 'compliant')->count();
        $pendingPros = Provider::where('compliance_status', 'pending')->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'pending_document_reviews' => $pendingReviews,
                'providers_expiring_soon' => $expiringSoon,
                'providers_non_compliant' => $nonCompliant,
                'providers_compliant' => $compliant,
                'providers_pending' => $pendingPros,
            ]
        ]);
    }

    /**
     * Get paginated list of providers with their compliance details.
     */
    public function providers(Request $request): JsonResponse
    {
        $status = $request->query('status'); // e.g., 'pending', 'non_compliant'
        
        $query = Provider::with(['user:id,first_name,last_name,email,avatar_url', 'verificationDocuments'])
                         ->withCount([
                             'verificationDocuments as total_docs',
                             'verificationDocuments as pending_docs' => function ($q) {
                                 $q->where('status', 'pending');
                             }
                         ]);

        if ($status) {
            $query->where('compliance_status', $status);
        }

        $providers = $query->orderBy('quality_score', 'asc')->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $providers
        ]);
    }

    /**
     * Get documents for a specific provider.
     */
    public function providerDocuments(Provider $provider): JsonResponse
    {
        $documents = $provider->verificationDocuments()->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $documents
        ]);
    }

    /**
     * Review/Update a specific document.
     */
    public function reviewDocument(Request $request, VerificationDocument $document): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'expires_at' => 'nullable|date',
            'rejection_reason' => 'nullable|string|max:500'
        ]);

        $document->update($validated);

        // Recalculate provider quality score and status after document update
        $provider = $document->provider;
        $this->qualityService->recalculate($provider);
        
        // Refresh supplier to get the new calculated data
        $provider->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Document reviewed successfully',
            'data' => [
                'document' => $document,
                'provider_compliance_status' => $provider->compliance_status,
                'provider_quality_score' => $provider->quality_score,
            ]
        ]);
    }
}
