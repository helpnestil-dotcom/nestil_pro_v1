/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. FIX THE CROSS-ORIGIN WARNING
  experimental: {
    serverActions: {
      allowedOrigins: [
        '3000-firebase-studio-1771129502154.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev'
      ]
    }
  },
  
  // 2. ENABLE LOGGING TO SEE THE 500 ERROR CAUSE
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  typescript: {
    // Fail the build on TypeScript errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Fail the build on ESLint errors
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
