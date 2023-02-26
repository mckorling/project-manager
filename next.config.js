/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['bcrypt'], // added bc this file might be imported by a server component
  },
}

module.exports = nextConfig
