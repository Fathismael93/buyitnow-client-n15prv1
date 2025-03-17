// sentry.server.config.mjs
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProd = process.env.NODE_ENV === 'production';

if (isProd && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5,

    // Environnement et version
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',

    // Performance du serveur
    serverName: process.env.HOSTNAME || 'unknown',

    // Intégrations serveur
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express(),
      new Sentry.Integrations.Mongo({
        useMongoose: true,
      }),
    ],
  });
}
