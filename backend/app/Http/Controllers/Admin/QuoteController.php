<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CustomQuoteStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CustomQuoteResource;
use App\Models\CustomQuote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    /**
     * Display a listing of custom quotes.
     */
    public function index() {
        $quotes = CustomQuote::latest()->paginate(20);

        return response()->json($quotes);
    }

    /**
     * Display the specified custom quote.
     */
    public function show(CustomQuote $quote) {
        return new CustomQuoteResource($quote);
    }

    /**
     * Update the status of a custom quote.
     */
    public function updateStatus(Request $request, CustomQuote $quote) {
        $validated = $request->validate([
            'status' => 'required|string|in:'.implode(',', array_column(CustomQuoteStatus::cases(), 'value')),
        ]);

        $quote->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Quote status updated successfully',
            'quote' => new CustomQuoteResource($quote),
        ]);
    }

    /**
     * Remove the specified custom quote from storage.
     */
    public function destroy(CustomQuote $quote) {
        $quote->delete();

        return response()->json(['message' => 'Quote deleted successfully']);
    }
}
