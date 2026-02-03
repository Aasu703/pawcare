import type { NextConfig } from "next";

const backendUrl = 
process.env.API_BASE_URL || "http://localhost:5000";
const IsDEV = backendUrl.startsWith("http://localhost");

const config: NextConfig = {
  images:{
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  }
}

export default config;