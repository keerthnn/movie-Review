import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // If using Cloudinary
      },
      {
        protocol: "https",
        hostname: "ntvb.tmsimg.com", // ADD THIS!
      },
    ],
  },
};

export default nextConfig;
