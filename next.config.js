/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? '/viral-quiz-engine' : '',
  assetPrefix: isProd ? '/viral-quiz-engine/' : '',
}
module.exports = nextConfig
