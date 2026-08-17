const checkEnvVariables = require('./check-env-variables')

checkEnvVariables()
// Updated logo and favicon public assets

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // TO DO: Fix this in the future
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
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
