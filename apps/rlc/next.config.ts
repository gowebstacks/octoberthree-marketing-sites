import type { NextConfig } from "next";
import { retirementlcRedirects } from "./redirects.config";

const nextConfig: NextConfig = {
  /* config options here */
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
        pathname: '/**',          
      },
      {
        protocol: 'https',
        hostname: 'img2.storyblok.com',
      },
      {
        protocol: 'https',
        hostname: '*.storyblok.com',
      },
    ],
  },
   async redirects() {
    return [
      {
        source: '/rlc/:path*',
        destination: '/:path*',
        permanent: false, 
      },
      ...retirementlcRedirects
    ]
  },
};

export default nextConfig;
