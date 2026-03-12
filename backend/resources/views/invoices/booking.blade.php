<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $booking->booking_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 40px;
        }
        .header-content {
            display: table-cell;
            vertical-align: top;
        }
        .header-left {
            width: 50%;
        }
        .header-right {
            width: 50%;
            text-align: right;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0284c7; /* sky-600 */
            margin: 0;
            padding: 0;
        }
        .title {
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        .details-box {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        th {
            background-color: #f8fafc;
            color: #64748b;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
        }
        .totals {
            width: 50%;
            float: right;
            margin-top: 20px;
        }
        .totals td {
            border: none;
            padding: 8px 12px;
        }
        .totals .total-row td {
            border-top: 2px solid #e2e8f0;
            font-weight: bold;
            font-size: 18px;
            color: #0f172a;
        }
        .footer {
            margin-top: 80px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <div class="header">
            <div class="header-content header-left">
                <h1 class="logo">KUBA Services</h1>
                <p>123 Service Str, Tech City<br>support@kuba.com<br>+1 234 567 8900</p>
            </div>
            <div class="header-content header-right">
                <h2 class="title">Invoice</h2>
                <p><strong>Invoice #:</strong> INV-{{ $booking->booking_number }}<br>
                <strong>Date:</strong> {{ $date }}<br>
                <strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID</span></p>
            </div>
        </div>

        <div style="display: table; width: 100%; margin-bottom: 30px;">
            <div style="display: table-cell; width: 50%; vertical-align: top;">
                <div class="details-box">
                    <h4 style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Billed To:</h4>
                    <strong>{{ $customer->name }}</strong><br>
                    {{ $customer->email }}<br>
                    {{ $customer->phone ?? 'N/A' }}
                </div>
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 20px;">
                <div class="details-box">
                    <h4 style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Provider:</h4>
                    <strong>{{ $provider->user->name }}</strong><br>
                    {{ $provider->user->email }}<br>
                    {{ $provider->company_name ?? 'Independent Professional' }}
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Date Scheduled</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>{{ $service->name }}</strong><br>
                        <span style="font-size: 12px; color: #64748b;">Booking Ref: {{ $booking->booking_number }}</span>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($booking->scheduled_date)->format('M d, Y h:i A') }}</td>
                    <td style="text-align: right;">${{ number_format($payment->provider_amount, 2) }}</td>
                </tr>
                <tr>
                    <td>Platform Service Fee</td>
                    <td>-</td>
                    <td style="text-align: right;">${{ number_format($payment->platform_fee, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <table class="totals">
            <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">${{ number_format($payment->amount, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Total Paid</td>
                <td style="text-align: right;">${{ number_format($payment->amount, 2) }}</td>
            </tr>
        </table>
        
        <div style="clear: both;"></div>

        <div class="footer">
            Thank you for using KUBA. If you have any questions concerning this invoice, contact support@kuba.com.
            <br><br>
            <i>Transaction ID: {{ $payment->transaction_id }} • Gateway: {{ strtoupper($payment->payment_gateway) }}</i>
        </div>
    </div>
</body>
</html>
