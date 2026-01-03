/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
  },
  optimizePackageImports: [
    "@prisma/client",
  ],
};

export default nextConfig;
