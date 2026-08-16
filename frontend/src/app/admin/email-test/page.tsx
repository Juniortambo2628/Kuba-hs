"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/hooks/useData";
import type { EmailTemplate } from "@/types";

interface EmailTestResult {
  success: boolean;
  message: string;
}

export default function AdminEmailTestPage() {
  const { data: templates, isLoading: templatesLoading } = useData<EmailTemplate[]>(
    "/api/admin/email-test/templates",
    { initialData: [] }
  );

  const [email, setEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customSubject, setCustomSubject] = useState("Kuba - Test Email");
  const [customBody, setCustomBody] = useState(
    "This is a test email from Kuba. If you received this, your email configuration is working correctly."
  );
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<EmailTestResult | null>(null);

  // Get template variables when template is selected
  const selectedTemplateData = templates.find((t) => t.key === selectedTemplate);
  const templateVariables: string[] = selectedTemplateData?.variables || [];

  // Reset variables when template changes
  useEffect(() => {
    if (selectedTemplate && templateVariables.length > 0) {
      const initialVars: Record<string, string> = {};
      templateVariables.forEach((v) => {
        initialVars[v] = "";
      });
      setVariables(initialVars);
    } else {
      setVariables({});
    }
  }, [selectedTemplate, templateVariables.length]);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsSending(true);

    try {
      const payload: {
        email: string;
        template_key?: string;
        variables?: Record<string, string>;
        subject?: string;
        body?: string;
      } = { email };

      if (selectedTemplate) {
        payload.template_key = selectedTemplate;
        // Only include non-empty variables
        const nonEmptyVars: Record<string, string> = {};
        Object.entries(variables).forEach(([key, value]) => {
          if (value.trim()) {
            nonEmptyVars[key] = value;
          }
        });
        if (Object.keys(nonEmptyVars).length > 0) {
          payload.variables = nonEmptyVars;
        }
      } else {
        payload.subject = customSubject;
        payload.body = customBody;
      }

      const res = await axiosInstance.post("/api/admin/email-test/send", payload);
      setResult(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to send test email";
      setResult({ success: false, message });
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="Email Testing"
        description="Send test emails to verify your email configuration is working correctly."
        icon={Mail}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Test Email Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Test Email
            </CardTitle>
            <CardDescription>
              Configure and send a test email to verify your setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendTest} className="space-y-6">
              {/* Recipient Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Email Template (Optional)</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                  disabled={templatesLoading}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue
                      placeholder={templatesLoading ? "Loading templates..." : "Select a template or send plain email"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Plain email (no template)
                      </div>
                    </SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.key} value={template.key}>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Variables */}
              {selectedTemplate && templateVariables.length > 0 && (
                <div className="space-y-3 rounded-xl border border-border p-4 bg-muted/30">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Settings className="h-4 w-4" />
                    Template Variables
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Override default values by filling in the fields below. Leave empty to use defaults.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {templateVariables.map((varName) => (
                      <div key={varName} className="space-y-1">
                        <Label htmlFor={`var-${varName}`} className="text-xs">
                          {varName}
                        </Label>
                        <Input
                          id={`var-${varName}`}
                          placeholder={`Default: ${varName}`}
                          value={variables[varName] || ""}
                          onChange={(e) =>
                            setVariables((prev) => ({
                              ...prev,
                              [varName]: e.target.value,
                            }))
                          }
                          className="h-9 rounded-lg text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Email (no template) */}
              {(!selectedTemplate || selectedTemplate === "plain") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Email subject"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Body</Label>
                    <Textarea
                      id="body"
                      placeholder="Email body content"
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      rows={5}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Send Button */}
              <Button
                type="submit"
                disabled={!email || isSending}
                className="w-full h-11 rounded-xl"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result & Info */}
        <div className="space-y-6">
          {/* Result Card */}
          {result && (
            <Card
              className={
                result.success
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-destructive/50 bg-destructive/5"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        result.success ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"
                      }`}
                    >
                      {result.success ? "Email Sent Successfully" : "Failed to Send"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mail Driver:</span>
                  <span className="font-mono">{process.env.NEXT_PUBLIC_MAIL_DRIVER || "log"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">From Address:</span>
                  <span className="font-mono">{process.env.NEXT_PUBLIC_MAIL_FROM || "noreply@kuba.com"}</span>
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">How it works:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Select a template to send a formatted email with variables</li>
                  <li>Or send a plain email with custom subject and body</li>
                  <li>Check your inbox (or mail log) for the test email</li>
                  <li>If using <code className="bg-muted px-1 rounded">MAIL_MAILER=log</code>, check <code className="bg-muted px-1 rounded">storage/logs/laravel.log</code></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageContainer>
  );
}
