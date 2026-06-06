"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyForm: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function useContactSubmit() {
  const [formData, setFormData] = useState<ContactFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.get("/sanctum/csrf-cookie");
      const res = await axiosInstance.post("/api/contact", formData);
      toast.success(res.data.message || "Message sent successfully!");
      setIsSubmitted(true);
      setFormData(emptyForm);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmitted = () => setIsSubmitted(false);

  return {
    formData,
    setFormData,
    isSubmitting,
    isSubmitted,
    handleSubmit,
    resetSubmitted,
  };
}
