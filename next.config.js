/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  // 确保动态路由正常工作
  trailingSlash: false,
  // 禁用静态优化以确保服务端渲染
  staticPageGenerationTimeout: 0
}

module.exports = nextConfig
