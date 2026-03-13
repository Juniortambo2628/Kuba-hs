"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            if (!code) {
                setError("No authorization code received from Google.");
                return;
            }

            try {
                // Send code to backend to complete the login
                // Socialite's handleGoogleCallback usually expects to pick the code from its own request
                // So we can proxy the request to the backend with the same query params
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                await axiosInstance.get(`/auth/google/callback?code=${code}`);
                
                // Refresh auth state in frontend
                await checkAuth();
                
                // Redirect user
                router.push("/dashboard");
            } catch (err: any) {
                console.error("Google Auth Error:", err);
                setError(err.response?.data?.message || "Google authentication failed.");
            }
        };

        handleCallback();
    }, [searchParams, router, checkAuth]);

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <h1 className="text-2xl font-bold text-red-500">Authentication Failed</h1>
                    <p className="text-gray-400">{error}</p>
                    <button 
                        onClick={() => router.push("/login")}
                        className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all font-semibold"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                <p className="text-gray-400 font-medium">Finalizing secure connection...</p>
            </div>
        </div>
    );
}
