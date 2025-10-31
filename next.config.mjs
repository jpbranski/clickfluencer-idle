/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // PWA configuration stub - uncomment and install @ducanh2912/next-pwa when ready
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },

  // Experimental features for Next.js 16
  experimental: {
    // Add experimental features here as needed
  },
};

// Uncomment when adding PWA support:
// import withPWA from '@ducanh2912/next-pwa';
// export default withPWA(nextConfig);

export default nextConfig;
