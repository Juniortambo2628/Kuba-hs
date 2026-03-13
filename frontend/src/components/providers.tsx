"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import { GlobalNotificationListener } from "@/components/notifications/GlobalNotificationListener"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <NuqsAdapter>
        <AuthProvider>
          {children}
          <GlobalNotificationListener />
          <Toaster />
        </AuthProvider>
      </NuqsAdapter>
    </NextThemesProvider>
  )
}
