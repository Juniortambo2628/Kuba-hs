<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvestorInquiryStatus;
use App\Http\Controllers\Controller;
use App\Models\InvestorInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestorInquiryController extends Controller
{
    public function index() {
        return \App\Http\Resources\InvestorInquiryResource::collection(InvestorInquiry::latest()->get());
    }

    public function show(InvestorInquiry $investorInquiry) {
        if ($investorInquiry->status === InvestorInquiryStatus::Pending) {
            $investorInquiry->update(['status' => InvestorInquiryStatus::Reviewed]);
        }

        return new \App\Http\Resources\InvestorInquiryResource($investorInquiry);
    }

    public function updateStatus(Request $request, InvestorInquiry $investorInquiry) {
        $validated = $request->validate([
            'status' => 'required|string|in:'.implode(',', array_column(InvestorInquiryStatus::cases(), 'value')),
        ]);

        $investorInquiry->update($validated);

        return response()->json([
            'message' => 'Inquiry status updated successfully',
            'inquiry' => $investorInquiry,
        ]);
    }

    public function destroy(InvestorInquiry $investorInquiry) {
        $investorInquiry->delete();

        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}
