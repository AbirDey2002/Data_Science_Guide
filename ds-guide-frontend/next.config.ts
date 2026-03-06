import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Data_Science_Guide',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
