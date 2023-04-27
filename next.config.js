const path = require('path')
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const chatGPTAppUrl = process.env.CHAT_GPT_APP_URL
const chatGPTAppOrigin= process.env.CHAT_GPT_APP_HREF

function dynamicRemotes(remoteUrl, scope) {
  return `promise new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '${remoteUrl}'
    script.async = true
    script.onload = () => {
      const proxy = {
        get: (request) => {
          try {
            return ${scope}.get(request)
          } catch(e) {
            console.error('[ERROR] Load remote error: Making request error:', e)
          }
        },
        init: (arg) => {
          try {
            return ${scope}.init(arg)
          } catch(e) {
            console.log('remote container already initialized')
          }
        }
      }
      resolve(proxy)
    }
    script.onerror = (error) => {
      console.error('error loading remote container[${scope}]', error)
      const proxy = {
        get: (request) => {
          return Promise.reject(error);
        },
        init: (arg) => {
          return;
        }
      }
      resolve(proxy)
    }
    document.head.appendChild(script);
  })`
}

const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    'chatgptNext': dynamicRemotes(`${chatGPTAppUrl}/_next/static/${location}/remoteEntry.js`, 'chatgptNext'),
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
        destination: `${chatGPTAppOrigin}/api/chat/:path*`,
        basePath: false,
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
