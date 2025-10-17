/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the root directory to prevent workspace detection issues
  outputFileTracingRoot: undefined,
  
  // Disable static optimization for pages with dynamic content
  experimental: {
    optimizePackageImports: ["react"],
  },
};

module.exports = nextConfig;
