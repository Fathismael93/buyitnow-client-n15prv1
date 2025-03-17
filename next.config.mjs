/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';

// Détection de l'environnement
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

// Bundle Analyzer - actif uniquement lors de l'analyse explicite
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Configuration des headers de sécurité
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // Personnalisez votre CSP selon vos besoins
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.cloudinary.com; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:;`,
  },
];

const nextConfig = {
  // Optimisations de performance
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,

  // Configuration d'images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**',
      },
    ],
  },

  // Configuration de l'internationalisation (si nécessaire)
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: true,
  },

  // Configuration des headers HTTP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Ajout de headers de cache pour les ressources statiques
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // Configuration des redirections
  async redirects() {
    return [
      // Exemple: redirection HTTP vers HTTPS
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        permanent: true,
        destination: 'https://www.example.com/:path*',
      },
      // Autres redirections selon vos besoins
    ];
  },

  // Configuration des rewrites (si nécessaire)
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrites avant les fichiers statiques
      ],
      afterFiles: [
        // Rewrites après les fichiers statiques mais avant les routes dynamiques
      ],
      fallback: [
        // Rewrites de repli si rien d'autre ne correspond
      ],
    };
  },

  // Optimisations expérimentales
  experimental: {
    optimizePackageImports: [
      'icon-library',
      'lodash',
      'date-fns',
      '@mui/material',
      '@mui/icons-material',
    ],
    // Configuration pour transpiler les modules npm (si nécessaire)
    transpilePackages: ['module-requiring-transpilation'],
    // Ajoutez des drapeaux de fonctionnalités selon vos besoins
    serverActions: true,
    typedRoutes: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' },
      },
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },

  // Optimisation pour les environnements serverless
  output: 'standalone',

  // Optimisations webpack supplémentaires
  webpack: (config, { dev, isServer }) => {
    // Optimisations pour la production uniquement
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          // Créez des groupes spécifiques pour les grosses dépendances
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    // Optimisations côté serveur
    if (isServer) {
      // Optimisations spécifiques au serveur
    }

    // Optimisations côté client
    if (!isServer) {
      // Optimisations spécifiques au client
    }

    return config;
  },

  // Gestion du cache des pages statiques
  generateEtags: true,
};

// Configuration Sentry pour le monitoring des erreurs en production
const sentryWebpackPluginOptions = {
  org: 'benew',
  project: 'buyitnow',
  // Token d'authentification pour télécharger les source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: false,
  // Désactiver le téléchargement des source maps en développement
  disableServerWebpackPlugin: !isProd && isDev,
  disableClientWebpackPlugin: !isProd && isDev,
};

// Exportation de la configuration avec les plugins appropriés
// Make sure adding Sentry options is the last code to run before exporting
const configWithPlugins = isProd
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;

export default bundleAnalyzer(configWithPlugins);
