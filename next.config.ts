import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Serve modern formats for the project imagery / thumbnails.
    formats: ["image/avif", "image/webp"],
    // When you connect Sanity later, allow its CDN here:
    // remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
