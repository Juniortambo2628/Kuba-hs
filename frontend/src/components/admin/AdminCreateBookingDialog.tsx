"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useApiData } from "@/hooks/useApiData";

interface AdminCreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function AdminCreateBookingDialog({
  open,
  onOpenChange,
  onCreated,
}: AdminCreateBookingDialogProps) {
  const { data: clients } = useApiData<{ id: string; name: string; email: string }[]>(
    open ? "/api/admin/users?role=client&per_page=100" : "",
    { initialData: [] }
  );
  const { data: providers } = useApiData<{ id: string; business_name: string }[]>(
    open ? "/api/admin/providers?per_page=100" : "",
    { initialData: [] }
  );

  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_id: "",
    provider_id: "",
    service_id: "",
    scheduled_date: "",
    scheduled_time: "",
    service_type: "residential",
    quantity: 1,
    location_name: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    if (!open || !form.provider_id) {
      setServices([]);
      return;
    }
    setLoadingServices(true);
    axiosInstance
      .get(`/api/providers/${form.provider_id}`)
      .then((res) => {
        const p = res.data.data ?? res.data;
        const list = (p?.services ?? [])
          .filter((s: { is_available?: boolean }) => s.is_available !== false)
          .map((s: { service_id: string; name?: string; service?: { name?: string } }) => ({
            id: s.service_id,
            name: s.name ?? s.service?.name ?? String(s.service_id),
          }));
        setServices(list);
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, [open, form.provider_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.post("/api/admin/bookings", form);
      toast.success("Booking created");
      onOpenChange(false);
      onCreated();
      setForm({
        customer_id: "",
        provider_id: "",
        service_id: "",
        scheduled_date: "",
        scheduled_time: "",
        service_type: "residential",
        quantity: 1,
        location_name: "",
        description: "",
        status: "pending",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create booking";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create booking (admin)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select
              value={form.customer_id}
              onValueChange={(v) => setForm((f) => ({ ...f, customer_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {(clients || []).map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={form.provider_id}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, provider_id: v, service_id: "" }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select
              value={form.service_id}
              onValueChange={(v) => setForm((f) => ({ ...f, service_id: v }))}
              disabled={!form.provider_id || loadingServices}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingServices ? "Loading…" : "Select service"} />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                required
                value={form.scheduled_date}
                onChange={(e) => setForm((f) => ({ ...f, scheduled_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={form.scheduled_time}
                onChange={(e) => setForm((f) => ({ ...f, scheduled_time: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.service_type}
                onValueChange={(v) => setForm((f) => ({ ...f, service_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="large_scale">Large scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: parseInt(e.target.value, 10) || 1 }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={form.location_name}
              onChange={(e) => setForm((f) => ({ ...f, location_name: e.target.value }))}
              placeholder="Service address or area"
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving} className="w-full rounded-xl font-bold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
