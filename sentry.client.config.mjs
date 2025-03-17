// sentry.client.config.mjs
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProd = process.env.NODE_ENV === 'production';

if (isProd && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5, // Ajustez selon vos besoins (0.0 à 1.0)
    replaysSessionSampleRate: 0.1, // Échantillonnage des sessions (10%)
    replaysOnErrorSampleRate: 1.0, // Capture toutes les sessions avec erreurs

    // Environnement et version
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',

    // Performance
    enableInnerHtml: true,
    autoSessionTracking: true,

    // Intégrations
    integrations: [
      new Sentry.BrowserTracing({
        // Filtres de traces personnalisés
        tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
      }),
      new Sentry.Replay({
        // Options supplémentaires pour Replay
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}
