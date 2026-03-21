<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VerificationDocument;
use App\Models\Provider;
\Illuminate\Support\Facades\DB::beginTransaction();
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VerificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            return VerificationDocument::with('provider.user')->latest()->get();
        }

        if (!$user->provider) {
            return response()->json(['message' => 'Not a provider'], 403);
        }

        return $user->provider->verificationDocuments;
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->provider) {
            return response()->json(['message' => 'Not a provider'], 403);
        }

        $request->validate([
            'document_type' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $path = $request->file('file')->store('verification_docs', 'public');

        $doc = VerificationDocument::create([
            'provider_id' => $user->provider->id,
            'document_type' => $request->document_type,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        // Update provider application status to reviewed if it was rejected previously
        if ($user->provider->application_status === 'rejected') {
            $user->provider->update(['application_status' => 'pending']);
        }

        return response()->json([
            'message' => 'Document submitted for verification',
            'document' => $doc
        ], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
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
                'application_status' => 'active'
            ]);
        } elseif ($request->status === 'rejected') {
            $provider->update([
                'is_verified' => false,
                'application_status' => 'rejected'
            ]);
        }

        return response()->json([
            'message' => 'Verification status updated',
            'document' => $doc,
            'provider_status' => $provider->application_status
        ]);
    }
}
