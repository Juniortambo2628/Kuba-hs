"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useContactSubmit } from "@/hooks/useContactSubmit";

interface ContactFormProps {
  title?: string;
  description?: string;
}

export function ContactForm({
  title = "Send us a Message",
  description = "Fill out the form below and our team will get back to you within 24 hours.",
}: ContactFormProps) {
  const { formData, setFormData, isSubmitting, isSubmitted, handleSubmit, resetSubmitted } =
    useContactSubmit();

  if (isSubmitted) {
    return (
      <Card className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 rounded-3xl overflow-hidden shadow-xl">
        <CardContent className="p-12 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Message Sent!</h3>
          <p className="text-emerald-600 dark:text-emerald-300">
            Thank you for reaching out. Our team will get back to you within 24 hours.
          </p>
          <Button
            onClick={resetSubmitted}
            variant="outline"
            className="mt-4 border-emerald-300 text-emerald-700 rounded-xl"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <p className="text-muted-foreground dark:text-gray-400">{description}</p>
      </div>
      <Card className="bg-muted dark:bg-white/5 border-border dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <CardContent className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Full Name
                </label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
              <Input
                placeholder="How can we help?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Message</label>
              <Textarea
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="bg-white dark:bg-white/5 border-border dark:border-white/10 rounded-2xl min-h-[150px] focus-visible:ring-blue-500 pt-4"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
