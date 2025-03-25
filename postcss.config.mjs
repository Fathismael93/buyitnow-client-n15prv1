/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Importation des variables CSS
    // 'postcss-import': {},

    'postcss-flexbugs-fixes': {},

    // Support des variables CSS personnalisées
    'postcss-custom-properties': {},

    // Support des fonctionnalités CSS modernes
    'postcss-preset-env': {
      stage: 4,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
      autoprefixer: {
        grid: true,
        flexbox: 'no-2009',
      },
      browsers: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not IE 11',
      ],
    },

    // Traitement Tailwind CSS
    '@tailwindcss/postcss': {},

    // Optimisations de production
    ...(process.env.NODE_ENV === 'production'
      ? {
          // Minifier le CSS
          cssnano: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                minifyFontValues: true,
                minifyGradients: true,
                mergeLonghand: true,
                colormin: true,
                zindex: false, // Éviter les problèmes de z-index
                reduceIdents: false, // Éviter les problèmes avec animations/keyframes
              },
            ],
          },

          // Vérifier les problèmes potentiels
          // 'postcss-reporter': {
          //   clearReportedMessages: true,
          // },
        }
      : {}),

    // En développement uniquement: alertes de compatibilité navigateur
    ...(process.env.NODE_ENV !== 'production'
      ? {
          'postcss-browser-reporter': {},
        }
      : {}),
  },
};

// Validation de sécurité: vérifier l'environnement d'exécution
// try {
//   // Prévention contre l'exécution dans des contextes non sécurisés
//   if (
//     process.env.NODE_ENV === 'production' &&
//     process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
//   ) {
//     console.warn(
//       'Running in preview mode - some optimizations might be limited',
//     );
//   }
// } catch (error) {
//   console.error('Error in PostCSS config:', error);
// }

export default config;
