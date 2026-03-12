<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    /**
     * Download the invoice for a specific booking.
     */
    public function download(Request $request, $bookingId)
    {
        $user = $request->user();
        
        $booking = Booking::with(['customer', 'provider.user', 'service', 'payment'])
            ->findOrFail($bookingId);

        // Authorization: Only the customer or provider of this booking can download
        if ($user->id !== $booking->customer_id && ($booking->provider && $user->id !== $booking->provider->user_id)) {
            // Check if admin
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        // Must be paid to have an invoice
        if ($booking->payment_status !== 'paid' || !$booking->payment) {
            return response()->json(['message' => 'Invoice is only available for paid bookings.'], 400);
        }

        try {
            $data = [
                'booking' => $booking,
                'customer' => $booking->customer,
                'provider' => $booking->provider,
                'service' => $booking->service,
                'payment' => $booking->payment,
                'date' => now()->format('Y-m-d H:i:s'),
            ];

            $pdf = Pdf::loadView('invoices.booking', $data);
            
            return $pdf->download('invoice-' . $booking->booking_number . '.pdf');
            
        } catch (\Exception $e) {
            Log::error("Invoice Generation Error: " . $e->getMessage());
            return response()->json(['message' => 'Failed to generate invoice.'], 500);
        }
    }
}
