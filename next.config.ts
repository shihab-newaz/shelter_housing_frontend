import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kjxtqhztubatdkhjocjo.supabase.co',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add this line to disable optimization for Supabase signed URLs
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // This is the key addition - unoptimized: true will bypass Next.js image optimization
    // for all images, which will fix the signed URL issue
    unoptimized: true,
  },
};

export default nextConfig
