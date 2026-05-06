import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Cloudflare Pages serves from root, no basePath needed
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
