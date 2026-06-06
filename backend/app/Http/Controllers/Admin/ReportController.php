<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminExportLog;
use App\Models\Booking;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function generate(Request $request)
    {
        $type = $request->query('type', 'bookings');

        if (! in_array($type, ['bookings', 'users', 'revenue'], true)) {
            return response()->json(['error' => 'Invalid report type'], 400);
        }

        AdminExportLog::create([
            'user_id' => $request->user()->id,
            'report_type' => $type,
            'ip_address' => $request->ip(),
        ]);

        return match ($type) {
            'bookings' => $this->exportBookings(),
            'users' => $this->exportUsers(),
            'revenue' => $this->exportRevenue(),
        };
    }

    public function history(Request $request)
    {
        $logs = AdminExportLog::with('user:id,first_name,last_name,email')
            ->latest()
            ->paginate(25);

        return response()->json(['data' => $logs]);
    }

    private function exportBookings()
    {
        $bookings = Booking::with(['customer', 'service'])->latest()->get();
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=kuba_bookings_report.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function() use ($bookings) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Number', 'Customer', 'Service', 'Date', 'Status', 'Price']);

            foreach ($bookings as $booking) {
                fputcsv($file, [
                    $booking->id,
                    $booking->booking_number,
                    $booking->customer?->name,
                    $booking->service?->name,
                    $booking->scheduled_date?->format('Y-m-d H:i') ?? 'N/A',
                    $booking->status,
                    $booking->final_price ?? $booking->estimated_price ?? '0.00',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportUsers()
    {
        $users = User::latest()->get();
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=kuba_users_report.csv',
        ];

        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined']);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    $user->is_active ? 'Active' : 'Suspended',
                    $user->created_at,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportRevenue()
    {
        $payments = Payment::with('booking')->where('status', 'completed')->latest()->get();
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=kuba_revenue_report.csv',
        ];

        $callback = function() use ($payments) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Booking Ref', 'Amount', 'Fee', 'Provider Net', 'Date']);

            foreach ($payments as $payment) {
                fputcsv($file, [
                    $payment->id,
                    $payment->booking?->booking_number,
                    $payment->amount,
                    $payment->platform_fee,
                    $payment->amount - $payment->platform_fee,
                    $payment->created_at,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
