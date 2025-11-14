/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'grind-city'; // Replace with your actual repo name

const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [],
  },

  // Only add basePath in production for GitHub Pages
  // Format: /repository-name
  basePath: isProduction ? `/${repoName}` : '',

  // Ensure trailing slashes for static export
  trailingSlash: true,

  // Disable API routes (not supported in static export)
  // Your app should use client-side auth with Supabase
  
  reactStrictMode: true,

  // Configure webpack for better optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;