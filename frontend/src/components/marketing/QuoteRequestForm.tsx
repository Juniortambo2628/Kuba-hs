"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { designSystem } from "@/lib/design-system";

export interface QuoteRequestFormValues {
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  organization_type: "commercial" | "cooperative" | "other";
  service_category: string;
  description: string;
}

const initialValues: QuoteRequestFormValues = {
  organization_name: "",
  contact_person: "",
  email: "",
  phone: "",
  organization_type: "commercial",
  service_category: "",
  description: "",
};

interface QuoteRequestFormProps {
  /** Tracks submission channel for admin (e.g. landing_corporate) */
  source?: string;
  onSuccess?: () => void;
  submitLabel?: string;
  compact?: boolean;
}

export function QuoteRequestForm({
  source = "landing_corporate",
  onSuccess,
  submitLabel = "Submit request",
  compact = false,
}: QuoteRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuoteRequestFormValues>(initialValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/quotes", { ...formData, source });
      toast.success("Request submitted — our team will contact you shortly.");
      setFormData(initialValues);
      onSuccess?.();
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
        ?.response?.data?.errors;
      const firstError = errors && Object.values(errors)[0]?.[0];
      const message =
        firstError ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to submit request.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = compact
    ? "h-11 rounded-xl text-sm font-medium"
    : designSystem.typography.auth.input;
  const labelClass = designSystem.typography.auth.label;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className={labelClass}>Organization name</Label>
        <Input
          required
          className={inputClass}
          value={formData.organization_name}
          onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
          placeholder="e.g. Acme Corp"
        />
      </div>

      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "grid grid-cols-2 gap-4"}>
        <div className="space-y-2">
          <Label className={labelClass}>Contact person</Label>
          <Input
            required
            className={inputClass}
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Entity type</Label>
          <select
            className={inputClass + " w-full flex border border-input bg-background px-3"}
            value={formData.organization_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                organization_type: e.target.value as QuoteRequestFormValues["organization_type"],
              })
            }
          >
            <option value="commercial">Commercial business</option>
            <option value="cooperative">Cooperative / group</option>
            <option value="other">Other organization</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={labelClass}>Email</Label>
          <Input
            type="email"
            required
            className={inputClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>Phone</Label>
          <Input
            className={inputClass}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>Services needed</Label>
        <Input
          required
          className={inputClass}
          value={formData.service_category}
          onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
          placeholder="e.g. Cleaning, maintenance, security"
        />
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>Tell us about your requirements</Label>
        <Textarea
          required
          minLength={20}
          className={inputClass + " min-h-[100px] pt-3 resize-y"}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Locations, volume, timeline, and any specific needs…"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={
          compact
            ? "w-full h-11 rounded-xl font-bold"
            : designSystem.typography.auth.button + " group"
        }
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
        ) : (
          <>
            {submitLabel}
            <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
