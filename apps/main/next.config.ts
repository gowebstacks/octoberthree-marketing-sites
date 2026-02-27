import type { NextConfig } from "next";

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
    ]
  },
};

export default nextConfig;
