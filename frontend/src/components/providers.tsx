"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import { CMSProvider } from "@/contexts/CMSContext"
import { Toaster } from "@/components/ui/sonner"
import { GlobalNotificationListener } from "@/components/notifications/GlobalNotificationListener"
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { SWRConfig } from 'swr'
import axiosInstance from '@/lib/axios'

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <NuqsAdapter>
        <SWRConfig value={{ 
          fetcher: (url: string) => axiosInstance.get(url).then(res => res.data),
          revalidateOnFocus: false,
          dedupingInterval: 5000 
        }}>
          <CMSProvider>
            <AuthProvider>
              {children}
              <GlobalNotificationListener />
              <Toaster />
            </AuthProvider>
          </CMSProvider>
        </SWRConfig>
      </NuqsAdapter>
    </NextThemesProvider>
  )
}
