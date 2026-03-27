"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
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
      const response = await axiosInstance.get("/api/user");
      setUser(response.data);
    } catch (error: any) {
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

  const login = async (data: any) => {
    try {
      await axiosInstance.get("/sanctum/csrf-cookie");
      await axiosInstance.post("/login", data);
      await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    await axiosInstance.get("/sanctum/csrf-cookie");
    await axiosInstance.post("/register", data);
    await checkAuth();
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.warn("Logout request failed, cleaning up local state anyway:", error);
    } finally {
      setUser(null);
      router.push("/"); // Redirect to homepage
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
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
