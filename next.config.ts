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
  }
}

export default nextConfig
