import type { NextConfig } from "next";
import { o3edgeRedirects } from "./redirects.confi";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self' https://app.storyblok.com",
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
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/edge/:path*",
        destination: "/:path*",
        permanent: false,
      },
      ...o3edgeRedirects,
    ];
  },
};

export default nextConfig;
