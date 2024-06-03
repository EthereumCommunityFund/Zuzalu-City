/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        pathname: '/images/',
        port: '',
      },
    ],
  },
  swcMinify: false
};

export default nextConfig;
