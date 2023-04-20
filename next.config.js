const path = require('path')
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const mainAppUrl = process.env.MAIN_APP_URL
const chatGPTAppUrl = process.env.CHAT_GPT_APP_URL

const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    main: `main@${mainAppUrl}/_next/static/${location}/remoteEntry.js`,
    'chatgptNext': `chatgptNext@${chatGPTAppUrl}/_next/static/${location}/remoteEntry.js`,
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    config.plugins.push(
      new NextFederationPlugin({
        name: 'main',
        filename: 'static/chunks/remoteEntry.js',
        remotes: remotes(isServer),
        exposes: {
          './markdown': './components/Markdown.tsx'
        },
        shared: {
          '@mui/icons-material': {
            singleton: true,
            requiredVersion: '5.11.0',
          },
          '@mui/material': {
            singleton: true,
            requiredVersion: false,
          },
          'react-markdown/lib/react-markdown': {
            singleton: true,
            requiredVersion: false,
          },
          'remark-gfm': {
            singleton: true,
            requiredVersion: false,
          },
          'remark-math': {
            singleton: true,
            requiredVersion: false,
          },
          'remark-breaks': {
            singleton: true,
            requiredVersion: false,
          },
        },
        extraOptions:{
          automaticAsyncBoundary: true
        }
      })
    )
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/chat/:path*',
        destination: `${chatGPTAppUrl}/api/chat/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: ''
      }
    ]
  }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)
