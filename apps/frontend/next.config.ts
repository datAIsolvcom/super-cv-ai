import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Optimize Three.js imports for tree-shaking
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'three',
      'gsap',
    ],
  },

  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},

  // Webpack config for production builds with bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...((config.optimization?.splitChunks as { cacheGroups?: Record<string, unknown> })?.cacheGroups || {}),
            // Three.js and React Three in separate chunk
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three-vendor',
              priority: 10,
              reuseExistingChunk: true,
            },
            // GSAP in separate chunk
            gsap: {
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              name: 'gsap-vendor',
              priority: 9,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;