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
      console.log("Checking auth status...");
      const response = await axiosInstance.get("/api/user");
      console.log("Auth success:", response.data);
      setUser(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log("User is not authenticated (silent check)");
      } else {
        console.error("Auth check failed:", error.response?.status, error.message);
      }
      setUser(null);
      // throw error; // Removed to avoid blocking initial load if 401
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth().catch(() => {}); // Handle initial check silently
  }, []);

  const login = async (data: any) => {
    try {
      // Sanctum CSRF protection initialization
      console.log("Fetching CSRF cookie...");
      await axiosInstance.get("/sanctum/csrf-cookie");
      
      // Login request
      console.log("Attempting login...");
      const loginRes = await axiosInstance.post("/login", data);
      console.log("Login response:", loginRes.status);
      
      // Fetch user details after successful login
      await checkAuth();
    } catch (error) {
      console.error("Login process failed:", error);
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
