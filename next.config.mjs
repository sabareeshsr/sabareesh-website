import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow serving uploaded media from /public/media
  images: {
    remotePatterns: [],
  },
}

export default withPayload(nextConfig)
