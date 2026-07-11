import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: 'https://b74292bf9a2c7c2743da7913f2ea8726@o4511684992237568.ingest.us.sentry.io/4511685206605824',
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
