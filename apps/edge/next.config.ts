import type { NextConfig } from "next";
import { o3edgeRedirects } from "./redirects.confi";

const nextConfig: NextConfig = {
  /* config options here */
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
