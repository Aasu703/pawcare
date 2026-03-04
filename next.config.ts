import type { NextConfig } from "next";

const backendUrl =
process.env.NEXT_PUBLIC_API_BASE_URL ||
process.env.API_BASE_URL ||
"http://localhost:5050";
const IsDEV = backendUrl.startsWith("http://localhost");
const normalizedBackendUrl = backendUrl.replace(/\/+$/, "");
const backendOrigin = normalizedBackendUrl.replace(/\/api$/, "");

const config: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
  images:{
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5050',
        pathname: '/uploads/**',
      },
    ],
  }
}

export default config;
