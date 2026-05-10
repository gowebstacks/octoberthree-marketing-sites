import type { NextConfig } from "next";
import { octoberthreeRedirects } from "./redirects.config";

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
        source: '/octoberthree-main/:path*',
        destination: '/:path*',
        permanent: false, 
      },
      {
        source: '/component-sample-page',
        destination: '/',
        permanent: false, 
      },
      ...octoberthreeRedirects
    ]
  },
};

export default nextConfig;
