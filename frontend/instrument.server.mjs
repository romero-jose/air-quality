import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: 'https://b74292bf9a2c7c2743da7913f2ea8726@o4511684992237568.ingest.us.sentry.io/4511685206605824',
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
})

