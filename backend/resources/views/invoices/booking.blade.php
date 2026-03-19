<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $booking->booking_number }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #0F172A;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background-color: #FFFFFF;
        }
        .header-bg {
            background-color: #0F172A;
            color: #FFFFFF;
            padding: 50px 40px;
            margin-bottom: 40px;
        }
        .container {
            width: 100%;
            margin: 0 auto;
            padding: 0 40px 40px 40px;
        }
        .logo {
            font-size: 32px;
            font-weight: 900;
            letter-spacing: -1px;
            margin: 0;
        }
        .logo span {
            color: #38BDF8;
        }
        .title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 4px;
            font-weight: 800;
            opacity: 0.6;
            margin-top: 5px;
        }
        .invoice-meta {
            margin-top: 30px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .details-grid {
            width: 100%;
            margin-bottom: 50px;
        }
        .details-col {
            vertical-align: top;
            width: 50%;
        }
        .section-label {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748B;
            margin-bottom: 12px;
        }
        .address-box {
            font-size: 13px;
            color: #1E293B;
        }
        .address-box strong {
            display: block;
            font-size: 15px;
            margin-bottom: 4px;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 40px;
        }
        table.items th {
            text-align: left;
            padding: 15px 10px;
            border-bottom: 2px solid #0F172A;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #0F172A;
        }
        table.items td {
            padding: 20px 10px;
            border-bottom: 1px solid #E2E8F0;
            font-size: 13px;
            vertical-align: top;
        }
        .totals-table {
            width: 300px;
            float: right;
            margin-top: 40px;
        }
        .totals-table td {
            padding: 8px 10px;
            font-size: 13px;
        }
        .totals-table .grand-total {
            background-color: #F8FAFC;
            font-weight: 900;
            font-size: 18px;
            border-top: 2px solid #0F172A;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #ECFDF5;
            color: #059669;
            font-size: 10px;
            font-weight: 800;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .footer {
            position: fixed;
            bottom: 40px;
            left: 40px;
            right: 40px;
            border-top: 1px solid #E2E8F0;
            padding-top: 25px;
            text-align: center;
            font-size: 10px;
            color: #94A3B8;
            font-weight: 500;
        }
        .transaction-id {
            background: #F1F5F9;
            padding: 4px 10px;
            border-radius: 4px;
            font-family: monospace;
            display: inline-block;
            margin-top: 15px;
            color: #64748B;
        }
    </style>
</head>
<body>
    <div class="header-bg">
        <div style="float: left;">
            <h1 class="logo">KUBA<span>.</span></h1>
            <p class="title">Official Transaction Record</p>
        </div>
        <div style="float: right; text-align: right;">
            <div class="status-badge">Payment Successful</div>
            <div class="invoice-meta">
                INV-{{ $booking->booking_number }}<br>
                {{ \Carbon\Carbon::parse($date)->format('d F Y') }}
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>

    <div class="container">
        <table class="details-grid">
            <tr>
                <td class="details-col">
                    <div class="section-label">Billed To</div>
                    <div class="address-box">
                        <strong>{{ $customer->name }}</strong>
                        {{ $customer->email }}<br>
                        {{ $customer->phone ?? 'Contact not provided' }}
                    </div>
                </td>
                <td class="details-col" style="padding-left: 50px;">
                    <div class="section-label">Service Provider</div>
                    <div class="address-box">
                        <strong>{{ $provider->user->name }}</strong>
                        {{ $provider->user->email }}<br>
                        {{ $provider->company_name ?? 'Premium Partner' }}
                    </div>
                </td>
            </tr>
        </table>

        <table class="items">
            <thead>
                <tr>
                    <th width="50%">Description</th>
                    <th width="30%">Service Date</th>
                    <th width="20%" style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div style="font-weight: 700; font-size: 15px; margin-bottom: 5px;">{{ $service->name }}</div>
                        <div style="color: #64748B; font-size: 11px;">Reference: #{{ $booking->booking_number }}</div>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($booking->scheduled_date)->format('M d, Y') }}<br><span style="font-size: 11px; opacity: 0.7;">{{ \Carbon\Carbon::parse($booking->scheduled_date)->format('h:i A') }}</span></td>
                    <td style="text-align: right; font-weight: 700;">KES {{ number_format($payment->provider_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="2" style="font-size: 11px; color: #64748B; font-weight: 600;">PLATFORM MAINTENANCE & ESCROW FEE</td>
                    <td style="text-align: right; font-weight: 700;">KES {{ number_format($payment->platform_fee, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <table class="totals-table">
            <tr>
                <td style="color: #64748B; font-weight: 600;">Subtotal</td>
                <td style="text-align: right; font-weight: 700;">KES {{ number_format($payment->amount, 2) }}</td>
            </tr>
            <tr class="grand-total">
                <td style="text-transform: uppercase; letter-spacing: 1px;">Total Paid</td>
                <td style="text-align: right;">KES {{ number_format($payment->amount, 2) }}</td>
            </tr>
        </table>
        
        <div style="clear: both;"></div>

        <div class="footer">
            <p>This is a computer-generated document. For any inquiries, please contact our support team at support@kuba.com</p>
            <p>Kuba Infrastructure Ltd. • Tech City North • Service Hub</p>
            <div class="transaction-id">TXID: {{ $payment->transaction_id }} • Gateway: {{ strtoupper($payment->payment_gateway) }}</div>
        </div>
    </div>
</body>
</html>
