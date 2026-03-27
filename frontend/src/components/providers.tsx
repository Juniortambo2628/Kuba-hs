"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import { CMSProvider } from "@/contexts/CMSContext"
import { Toaster } from "@/components/ui/sonner"
import { GlobalNotificationListener } from "@/components/notifications/GlobalNotificationListener"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <NuqsAdapter>
        <CMSProvider>
          <AuthProvider>
            {children}
            <GlobalNotificationListener />
            <Toaster />
          </AuthProvider>
        </CMSProvider>
      </NuqsAdapter>
    </NextThemesProvider>
  )
}
