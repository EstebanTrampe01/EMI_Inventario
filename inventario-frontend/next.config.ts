import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // We'll fix lint issues later during the migration
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
