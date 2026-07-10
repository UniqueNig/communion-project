import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/give/solar-media",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
