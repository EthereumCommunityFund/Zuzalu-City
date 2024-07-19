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
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'scarlet-binding-hummingbird-437.mypinata.cloud',
        pathname: '/ipfs/**',
        port: '',
      },
      // https://gateway.lighthouse.storage
      {
        protocol: 'https',
        hostname: 'gateway.lighthouse.storage',
        pathname: '/ipfs/**',
        port: '',
      },
    ],
  },
  swcMinify: false,
};

export default nextConfig;
