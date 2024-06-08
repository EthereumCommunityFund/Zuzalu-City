/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        pathname: '/images/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
        pathname: '/**',
        port: '',
      },
    ],
  },
  swcMinify: false,
};

export default nextConfig;
