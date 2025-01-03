import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // i18n: {
  //   locales: ['en', 'fr', 'ar', 'tr', 'ur', 'hi'],
  //   defaultLocale: 'en',
  // },
};

export default nextConfig;
