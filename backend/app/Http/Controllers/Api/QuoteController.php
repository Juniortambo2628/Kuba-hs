<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomQuote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuoteController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'organization_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'organization_type' => 'required|string|in:commercial,cooperative,other',
            'service_category' => 'required|string',
            'description' => 'required|string|min:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $quote = CustomQuote::create($request->all());

        // In a real app, send notification to admin here
        
        return response()->json([
            'message' => 'Quote request submitted successfully. Our team will contact you shortly.',
            'quote' => $quote
        ], 201);
    }
}
