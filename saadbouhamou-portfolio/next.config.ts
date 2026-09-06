import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Extra 500px breakpoint so desktop project cards (~387–499px rendered)
    // stop falling through to the 640px device-size step.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; media-src 'self' https://res.cloudinary.com; frame-src 'self' https://player.vimeo.com https://vimeo.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
