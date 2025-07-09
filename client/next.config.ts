import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: Resolve hostname instead of direct link to image
    remotePatterns: [new URL("https://lh3.googleusercontent.com/a/ACg8ocJnIHFbpxBJNZ7Y_dTJDCAbfjfgqCTGi5Xd9myR7x1LsOzwwFll=s96-c")]
  }
};

export default nextConfig;
