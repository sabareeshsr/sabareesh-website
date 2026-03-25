import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Netlify production
      {
        protocol: 'https',
        hostname: '**.netlify.app',
        pathname: '/media/**',
      },
      // Local dev
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/media/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
