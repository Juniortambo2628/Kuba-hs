<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run()
    {
        $templates = [
            [
                'key' => 'booking_confirmation_customer',
                'name' => 'Booking Confirmation (Customer)',
                'subject' => 'Confirmed: Your booking #{{booking_number}} is ready!',
                'body' => "# Booking Confirmed\n\nHi {{customer_name}},\n\nYour booking for **{{service_name}}** has been successfully created. \n\n**Booking Details:**\n- **Number:** {{booking_number}}\n- **Date:** {{scheduled_date}}\n- **Provider:** {{provider_name}}\n\nYou can track the status of your booking in your dashboard.\n\n[View Dashboard]({{dashboard_url}})",
                'variables' => ['customer_name', 'service_name', 'booking_number', 'scheduled_date', 'provider_name', 'dashboard_url']
            ],
            [
                'key' => 'booking_confirmation_provider',
                'name' => 'New Booking Request (Provider)',
                'subject' => 'New Request: Booking #{{booking_number}}',
                'body' => "# New Booking Request\n\nHi {{provider_name}},\n\nYou have received a new booking request for **{{service_name}}**.\n\n**Request Details:**\n- **Number:** {{booking_number}}\n- **Date:** {{scheduled_date}}\n- **Client:** {{customer_name}}\n\nPlease sign in to your dashboard to accept or decline this request.\n\n[View Dashboard]({{dashboard_url}})",
                'variables' => ['provider_name', 'service_name', 'booking_number', 'scheduled_date', 'customer_name', 'dashboard_url']
            ],
            [
                'key' => 'booking_status_updated_customer',
                'name' => 'Booking Status Update (Customer)',
                'subject' => 'Update: Your booking #{{booking_number}} is now {{status}}',
                'body' => "# Booking Update\n\nHi {{customer_name}},\n\nThe status of your booking #{{booking_number}} ({{service_name}}) has been updated to: **{{status}}**.\n\n[View Details]({{dashboard_url}})",
                'variables' => ['customer_name', 'booking_number', 'service_name', 'status', 'dashboard_url']
            ],
            [
                'key' => 'booking_status_updated_provider',
                'name' => 'Booking Status Update (Provider)',
                'subject' => 'Update: Booking #{{booking_number}} is now {{status}}',
                'body' => "# Booking Update\n\nHi {{provider_name}},\n\nThe status of booking #{{booking_number}} for {{customer_name}} has been updated to: **{{status}}**.\n\n[View Details]({{dashboard_url}})",
                'variables' => ['provider_name', 'booking_number', 'customer_name', 'status', 'dashboard_url']
            ],
            [
                'key' => 'payment_received_customer',
                'name' => 'Payment Confirmation (Customer)',
                'subject' => 'Receipt: Payment for Booking #{{booking_number}}',
                'body' => "# Payment Received\n\nHi {{customer_name}},\n\nWe've successfully received your payment of **{{amount}}** for booking #{{booking_number}} ({{service_name}}).\n\nThank you for choose our service!\n\n[Download Invoice]({{invoice_url}})",
                'variables' => ['customer_name', 'amount', 'booking_number', 'service_name', 'invoice_url']
            ],
            [
                'key' => 'new_review_received_provider',
                'name' => 'New Review Received (Provider)',
                'subject' => 'New Feedback: Someone reviewed your service!',
                'body' => "# New Review Received\n\nHi {{provider_name}},\n\nA client just left a **{{rating}} star** review for your service on booking #{{booking_number}}.\n\n**Client Comment:**\n\"{{comment}}\"\n\n[View Reviews]({{reviews_url}})",
                'variables' => ['provider_name', 'rating', 'booking_number', 'reviews_url', 'comment']
            ],
            [
                'key' => 'new_booking_request_provider',
                'name' => 'New Booking Request (Provider)',
                'subject' => 'New Request: Booking #{{booking_number}}',
                'body' => "# New Booking Request\n\nHi {{provider_name}},\n\nYou have received a new booking request for **{{service_name}}**.\n\n**Request Details:**\n- **Number:** {{booking_number}}\n- **Date:** {{scheduled_date}}\n- **Client:** {{customer_name}}\n\nPlease sign in to your dashboard to accept or decline this request.\n\n[View Dashboard]({{dashboard_url}})",
                'variables' => ['provider_name', 'service_name', 'booking_number', 'scheduled_date', 'customer_name', 'dashboard_url']
            ],
            [
                'key' => 'investor_inquiry_admin_alert',
                'name' => 'Investor Inquiry Admin Alert',
                'subject' => 'URGENT: New Investor Inquiry from {{name}}',
                'body' => "# New Investor Inquiry\n\n**Name:** {{name}}\n**Email:** {{email}}\n**Company:** {{company}}\n**Investment Range:** {{investment_range}}\n\n**Message:**\n{{message}}",
                'variables' => ['name', 'email', 'company', 'investment_range', 'message']
            ],
            [
                'key' => 'passkey_created',
                'name' => 'Passkey Created',
                'subject' => 'New Passkey Added to Your Account',
                'body' => "# New Passkey Added\n\nHi {{user_name}},\n\nA new passkey has been added to your Kuba account:\n\n**Passkey Name:** {{passkey_name}}\n**Added On:** {{created_at}}\n\nIf you did not add this passkey, please remove it immediately from your security settings.\n\n[Manage Passkeys]({{dashboard_url}})",
                'variables' => ['user_name', 'passkey_name', 'created_at', 'dashboard_url']
            ],
            [
                'key' => 'sign_in_log',
                'name' => 'Sign-In Log',
                'subject' => 'New Sign-In to Your Account',
                'body' => "# New Sign-In Detected\n\nHi {{user_name}},\n\nA new sign-in was detected on your account:\n\n**Method:** {{sign_in_method}}\n**Time:** {{sign_in_time}}\n**IP Address:** {{ip_address}}\n**Device:** {{device}}\n\nIf this was you, no action is needed. If you don't recognize this sign-in, please change your password immediately.\n\n[Review Account]({{dashboard_url}})",
                'variables' => ['user_name', 'sign_in_method', 'sign_in_time', 'ip_address', 'device', 'dashboard_url']
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(['key' => $template['key']], $template);
        }
    }
}
