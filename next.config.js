import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configure trailing slash behavior
  trailingSlash: true,
  
  // Compress output
  compress: true,
  
  // PoweredBy header removal
  poweredByHeader: false,
  
  // React strict mode
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);