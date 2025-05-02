import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/tickets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
