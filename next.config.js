/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  swcMinify: false
};

module.exports = nextConfig;
