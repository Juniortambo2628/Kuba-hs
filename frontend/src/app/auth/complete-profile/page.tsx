"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Building2, ShieldCheck, Mail, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function CompleteProfileForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();

    const roleParam = searchParams.get("role");
    const initialRole =
        roleParam === "provider" || roleParam === "customer" ? roleParam : ("" as "" | "customer" | "provider");

    const [formData, setFormData] = useState({
        first_name: searchParams.get("first_name") || "",
        last_name: searchParams.get("last_name") || "",
        email: searchParams.get("email") || "",
        google_id: searchParams.get("google_id") || "",
        role: initialRole,
        phone: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.role) {
            toast.error("Please select your account type");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.post("/api/auth/complete-profile", formData);
            toast.success("Profile completed successfully");
            await checkAuth();
            router.push(response.data.redirect || "/dashboard");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to complete profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg"
            >
                <div className="space-y-2 mb-10 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <ShieldCheck className="w-7 h-7 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Complete Your Profile</h1>
                    <p className="text-muted-foreground text-sm">One more step to connect your Google account with Kuba.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Type</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "customer" })}
                                className={`
                                    p-5 rounded-2xl border-2 transition-all duration-300 text-left relative group
                                    ${formData.role === "customer" 
                                        ? "border-primary bg-primary/5 shadow-md" 
                                        : "border-border bg-muted/50 hover:border-muted-foreground/20 hover:bg-muted"
                                    }
                                `}
                            >
                                <User className={`w-5 h-5 mb-3 ${formData.role === "customer" ? "text-primary" : "text-muted-foreground"}`} />
                                <p className="text-sm font-semibold text-foreground">Customer</p>
                                <p className="text-xs text-muted-foreground mt-1 leading-tight">Request home services and manage bookings.</p>
                                {formData.role === "customer" && (
                                    <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-primary" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "provider" })}
                                className={`
                                    p-5 rounded-2xl border-2 transition-all duration-300 text-left relative group
                                    ${formData.role === "provider" 
                                        ? "border-primary bg-primary/5 shadow-md" 
                                        : "border-border bg-muted/50 hover:border-muted-foreground/20 hover:bg-muted"
                                    }
                                `}
                            >
                                <Building2 className={`w-5 h-5 mb-3 ${formData.role === "provider" ? "text-primary" : "text-muted-foreground"}`} />
                                <p className="text-sm font-semibold text-foreground">Service Provider</p>
                                <p className="text-xs text-muted-foreground mt-1 leading-tight">Offer professional services and grow your business.</p>
                                {formData.role === "provider" && (
                                    <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-primary" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Data Fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input 
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="h-10"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input 
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="h-10"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input 
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-10"
                                placeholder="+254 7XX XXX XXX"
                            />
                        </div>

                        <div className="space-y-2 opacity-60">
                            <Label>Email (from Google)</Label>
                            <Input 
                                value={formData.email}
                                disabled
                                className="h-10 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading || !formData.role}
                        className="w-full h-10"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Complete Setup"
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}

export default function CompleteProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        }>
            <CompleteProfileForm />
        </Suspense>
    );
}
