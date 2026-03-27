<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvestorInquiry;
use Illuminate\Http\Request;

class InvestorInquiryController extends Controller
{
    public function index()
    {
        return \App\Http\Resources\InvestorInquiryResource::collection(InvestorInquiry::latest()->get());
    }

    public function show(InvestorInquiry $investorInquiry)
    {
        if ($investorInquiry->status === 'pending') {
            $investorInquiry->update(['status' => 'reviewed']);
        }
        return new \App\Http\Resources\InvestorInquiryResource($investorInquiry);
    }

    public function updateStatus(Request $request, InvestorInquiry $investorInquiry)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,reviewed,contacted,rejected'
        ]);

        $investorInquiry->update($validated);

        return response()->json([
            'message' => 'Inquiry status updated successfully',
            'inquiry' => $investorInquiry
        ]);
    }

    public function destroy(InvestorInquiry $investorInquiry)
    {
        $investorInquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}

