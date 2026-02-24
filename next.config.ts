import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable type checking during build for faster compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure CSS is properly handled
  transpilePackages: [],
};

export default nextConfig;
