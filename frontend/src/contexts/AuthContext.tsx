"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<User | null>;
  register: (data: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<string>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/api/user", {
        validateStatus: (status) => status === 200 || status === 401,
      });
      if (response.status === 401) {
        setUser(null);
        return;
      }
      const payload = response.data?.data ?? response.data;
      setUser(payload);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Skip auth check if no session cookie exists (anonymous visitor)
    const hasSession = document.cookie.includes('laravel_session') || 
                       document.cookie.includes('XSRF-TOKEN');
    if (hasSession) {
      checkAuth().catch(() => {});
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: any): Promise<User | null> => {
    await axiosInstance.get("/sanctum/csrf-cookie");
    const response = await axiosInstance.post("/api/auth/login", data);
    await checkAuth();
    const fromLogin = response.data?.user;
    if (fromLogin?.role) {
      return fromLogin as User;
    }
    try {
      const me = await axiosInstance.get("/api/user");
      return (me.data?.data ?? me.data) as User;
    } catch {
      return null;
    }
  };

  const register = async (data: any) => {
    await axiosInstance.get("/sanctum/csrf-cookie");
    await axiosInstance.post("/api/auth/register", data);
    await checkAuth();
  };

  const forgotPassword = async (email: string) => {
    await axiosInstance.get("/sanctum/csrf-cookie");
    const res = await axiosInstance.post("/api/auth/forgot-password", { email });
    return (res.data?.message as string) || "We have emailed your password reset link.";
  };

  const resetPassword = async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    await axiosInstance.get("/sanctum/csrf-cookie");
    const res = await axiosInstance.post("/api/auth/reset-password", data);
    return (res.data?.message as string) || "Your password has been reset.";
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.warn("Logout request failed, cleaning up local state anyway:", error);
    } finally {
      setUser(null);
      router.push("/"); // Redirect to homepage
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, forgotPassword, resetPassword, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
