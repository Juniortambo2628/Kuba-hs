<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestorInquiry;
use App\Models\EmailTemplate;
use App\Mail\DynamicMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InvestorInquiryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'investment_range' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $inquiry = InvestorInquiry::create($validated);

        // Send alert to admin using DynamicMail
        $adminEmail = config('mail.from.address', 'admin@example.com');
        Mail::to($adminEmail)->send(new DynamicMail('investor_inquiry_admin_alert', $validated));

        return response()->json([
            'message' => 'Your inquiry has been submitted successfully. Our investment team will contact you shortly.',
        ], 201);
    }
}
