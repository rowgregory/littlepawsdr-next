import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.0.0.89'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.rescuegroups.org',
        pathname: '/5798/**'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      }
    ]
  },
  async redirects() {
    return [
      { source: '/available', destination: '/dachshunds', permanent: true },
      { source: '/store', destination: '/merch', permanent: true },
      { source: '/donate/welcome-wieners', destination: '/welcomewieners', permanent: true },
      { source: '/donate/shop-to-help', destination: '/shoptohelp', permanent: true },
      { source: '/donate/feed-a-foster', destination: '/feed', permanent: true },
      { source: '/volunteer/volunteer-application', destination: '/volunteer/application', permanent: true },
      { source: '/volunteer/foster-application', destination: '/volunteer/foster', permanent: true },
      { source: '/volunteer/transport-application', destination: '/volunteer/transport', permanent: true }
    ]
  }
}

export default nextConfig
