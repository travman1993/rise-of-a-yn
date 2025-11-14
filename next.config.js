/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'rise-of-a-yn'; // ← CHANGE THIS!

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProduction ? `/${repoName}` : '',
  trailingSlash: true,
  reactStrictMode: true,
  turbopack: {},
};

module.exports = nextConfig;