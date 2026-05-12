import type { NextConfig } from "next";
import { retirementlcRedirects } from "./redirects.config";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img2.storyblok.com",
      },
    ],
  },
   async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/rlc/:path*",
        destination: "/:path*",
        permanent: false,
      },
      ...retirementlcRedirects,
    ];
  },
};

export default nextConfig;
