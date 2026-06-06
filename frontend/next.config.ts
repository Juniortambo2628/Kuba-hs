import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',

    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard/customer",
        destination: "/dashboard/client",
        permanent: false,
      },
      {
        source: "/dashboard/customer/:path*",
        destination: "/dashboard/client/:path*",
        permanent: false,
      },
      { source: "/categories", destination: "/services", permanent: true },
      {
        source: "/categories/:categorySlug/:serviceSlug",
        destination: "/services/:serviceSlug",
        permanent: true,
      },
      {
        source: "/categories/:categorySlug",
        destination: "/services?category=:categorySlug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');
    return [
      {
        source: '/auth/:path*',
        destination: `${apiOrigin}/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: '/sanctum/:path*',
        destination: `${apiOrigin}/sanctum/:path*`,
      },
      {
        source: '/cms-assets/:path*',
        destination: `${apiOrigin}/cms-assets/:path*`,
      },
      {
        source: '/assets/:path*',
        destination: `${apiOrigin}/assets/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
