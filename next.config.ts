/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lovable.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // If you need to transpile specific modules
  transpilePackages: [],
  devIndicators: false,
};

export default nextConfig;