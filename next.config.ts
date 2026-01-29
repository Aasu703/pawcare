import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "images.unsplash.com",
      }
  ],
  },
};

export default nextConfig;
