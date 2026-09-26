<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingPaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    use AuthorizesRequests;

    /**
     * Download the invoice for a specific booking.
     */
    public function download(Request $request, $bookingId): Response
    {
        $booking = Booking::with(['customer', 'provider.user', 'service', 'payment'])
            ->findOrFail($bookingId);

        // Customer, owning provider or admin - the same rule as everywhere else.
        $this->authorize('view', $booking);

        // Must be paid to have an invoice
        if ($booking->payment_status !== BookingPaymentStatus::Paid || ! $booking->payment) {
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

            return $pdf->download('invoice-'.$booking->booking_number.'.pdf');

        } catch (\Exception $e) {
            Log::error('Invoice Generation Error: '.$e->getMessage());

            return response()->json(['message' => 'Failed to generate invoice.'], 500);
        }
    }
}
