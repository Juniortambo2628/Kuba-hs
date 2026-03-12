<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvestorInquiry;
use Illuminate\Http\Request;

class InvestorInquiryController extends Controller
{
    public function index()
    {
        return InvestorInquiry::latest()->get();
    }

    public function show(InvestorInquiry $investorInquiry)
    {
        if ($investorInquiry->status === 'pending') {
            $investorInquiry->update(['status' => 'reviewed']);
        }
        return $investorInquiry;
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
}
