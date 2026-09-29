declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  export interface PWAOptions {
    dest?: string;
    sw?: string;
    scope?: string;
    register?: boolean;
    disable?: boolean;
    skipWaiting?: boolean;
    buildExcludes?: Array<string | RegExp>;
    fallbacks?: boolean;
    publicExcludes?: Array<string | RegExp>;
  }

  export default function withPWA(
    options?: PWAOptions
  ): (nextConfig?: NextConfig) => NextConfig;
}
