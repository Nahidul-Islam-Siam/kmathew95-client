import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http", // Allow HTTP protocol for localhost
        hostname: "localhost",
        port: "6565", // 👈 Correct port
      },
    ],
  },
};

export default nextConfig;
