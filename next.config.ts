import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Unsplash is the image source now and stays the source once Firebase lands.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
