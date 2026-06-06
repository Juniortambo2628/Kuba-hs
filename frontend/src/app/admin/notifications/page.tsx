"use client";

import Link from "next/link";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, ArrowRight } from "lucide-react";

const NOTIFICATION_EVENTS = [
  { key: "booking_confirmation", label: "Booking confirmation", channel: "Email + in-app" },
  { key: "booking_status_updated", label: "Booking status updates", channel: "Email + in-app" },
  { key: "new_booking_received", label: "New booking (provider)", channel: "Email + in-app" },
  { key: "payment_receipt", label: "Payment receipts", channel: "Email" },
];

export default function AdminNotificationsPage() {
  return (
    <DashboardPageContainer className="space-y-10">
      <DashboardPageHeader
        title="Notifications & Templates"
        subtitle="Transactional emails and in-app alerts are managed via email templates and Laravel notification classes."
      />

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            How notifications work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            Email copy is edited under <strong>Email Templates</strong>. In-app notifications use the
            same events and are stored in the user notifications table when sent.
          </p>
          <Button asChild className="rounded-xl font-bold">
            <Link href="/admin/email-templates">
              <Mail className="w-4 h-4 mr-2" />
              Manage email templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NOTIFICATION_EVENTS.map((ev) => (
          <Card key={ev.key} className="border border-border">
            <CardContent className="p-5">
              <p className="font-bold text-foreground">{ev.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{ev.channel}</p>
              <p className="text-[10px] font-mono text-muted-foreground/70 mt-2">{ev.key}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardPageContainer>
  );
}
