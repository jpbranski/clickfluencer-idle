/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Production optimizations
  compiler: {
    // Remove console.logs in production (keep warn and error)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Experimental features
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['framer-motion'], // Tree-shake heavy dependencies
  },

  // PWA configuration stub - uncomment and install @ducanh2912/next-pwa when ready
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
};

// Uncomment when adding PWA support:
// import withPWA from '@ducanh2912/next-pwa';
// export default withPWA(nextConfig);

export default nextConfig;
