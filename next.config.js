/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  // images: {
  //   domains: ['contentscore.cloudd.in'],
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'contentscore.cloudd.in',
  //       port: '',
  //       pathname: '/ScoreNodeLive/**',
  //     },
  //   ],
  // },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.sportish.io/:path*',
      },
    ];
  },
};

module.exports = nextConfig;