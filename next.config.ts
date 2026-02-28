import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  skipTrailingSlashRedirect: true,

  experimental: {
    optimizePackageImports: [
      "@tanstack/react-query",
      "@tanstack/react-table",
      "lucide-react",
      "zod",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL || "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
