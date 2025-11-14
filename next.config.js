/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'rise-of-a-yn'; // ← CHANGE THIS!

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

module.exports = nextConfig;