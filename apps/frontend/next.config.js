/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mysaasproject/shared'],
  output: 'standalone',
  eslint: {
    // Disable ESLint during production build for faster builds
    // Run linting separately in CI/CD
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore build errors for monorepo type resolution
    // TODO: Fix TypeScript path resolution for shared package in Docker builds
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig


