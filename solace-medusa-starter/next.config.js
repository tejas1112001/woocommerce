const checkEnvVariables = require('./check-env-variables')

checkEnvVariables()
// Updated logo and favicon public assets

/**
 * @type {import('next').NextConfig}
 */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  reactStrictMode: true,
  // Allow cross-origin requests from local dev servers
  allowedDevOrigins: ['localhost:9000', '127.0.0.1:9000'],
  images: {
    // In development, skip Next.js image optimization to avoid the
    // "resolved to private ip" error when backend runs on localhost
    unoptimized: isDev,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '66.116.232.174',
      },
      {
        protocol: 'https',
        hostname: '66.116.232.174',
      },
      {
        protocol: 'https',
        hostname: 'swamiomenterprises.in',
      },
      {
        protocol: 'https',
        hostname: 'www.swamiomenterprises.in',
      },
      {
        protocol: 'https',
        hostname: 'api.swamiomenterprises.in',
      },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
      },
      // Only include remote patterns when the env value is a non-empty string
      ...(process.env.NEXT_PUBLIC_SPACE_DOMAIN
        ? [{ protocol: 'https', hostname: process.env.NEXT_PUBLIC_SPACE_DOMAIN }]
        : []),
      ...(process.env.NEXT_PUBLIC_CDN_SPACE_DOMAIN
        ? [{ protocol: 'https', hostname: process.env.NEXT_PUBLIC_CDN_SPACE_DOMAIN }]
        : []),
      ...(process.env.NEXT_PUBLIC_SPACE_ENDPOINT
        ? [{ protocol: 'https', hostname: process.env.NEXT_PUBLIC_SPACE_ENDPOINT }]
        : []),
    ],
  },
}

module.exports = nextConfig
