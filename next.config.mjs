/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['repostisur.vercel.app'],
    unoptimized: false,
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
