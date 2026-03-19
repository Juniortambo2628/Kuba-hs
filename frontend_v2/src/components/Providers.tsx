"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import { GlobalNotificationListener } from "@/components/notifications/GlobalNotificationListener"
import { PrimeReactProvider } from 'primereact/api';
import { LayoutProvider } from '@/layout/context/layoutcontext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider>
      <LayoutProvider>
        <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              {children}
              <GlobalNotificationListener />
              <Toaster />
            </AuthProvider>
        </NextThemesProvider>
      </LayoutProvider>
    </PrimeReactProvider>
  )
}
