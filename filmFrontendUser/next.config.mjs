/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Vô hiệu hóa module Node.js như fs cho frontend
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
 
};

export default nextConfig;
