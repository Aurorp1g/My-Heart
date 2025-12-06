/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/My-Heart',
  assetPrefix: '/My-Heart/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_ASSET_PREFIX: "/My-Heart",
  },
};

export default nextConfig;