import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Payload media served locally in dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      // Payload media on Netlify production
      {
        protocol: 'https',
        hostname: 'sabareesh-website.netlify.app',
        pathname: '/api/media/**',
      },
      // Any Netlify preview deploys
      {
        protocol: 'https',
        hostname: '**.netlify.app',
        pathname: '/api/media/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
