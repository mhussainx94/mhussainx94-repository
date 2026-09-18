/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Linting is handled in editors/CI; kept out of the build gate so
    // the production build stays deterministic in any environment.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
