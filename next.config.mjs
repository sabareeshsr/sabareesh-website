import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp'],
  images: {
    remotePatterns: [
      // Payload media served locally in dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**',
      },
      // Payload media on Netlify production
      {
        protocol: 'https',
        hostname: 'sabareesh-website.netlify.app',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'sabareesh-website.netlify.app',
        pathname: '/media/**',
      },
      // Any Netlify preview deploys
      {
        protocol: 'https',
        hostname: '**.netlify.app',
        pathname: '/**',
      },
      // Cloudinary CDN
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Cloudflare R2 storage
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
