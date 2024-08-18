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
      {
        protocol: 'https',
        hostname:
          'bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link',
        pathname: '**',
        port: '',
      },
    ],
  },
  swcMinify: false,
};

export default nextConfig;
