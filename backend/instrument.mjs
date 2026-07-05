import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: "https://298a48813f508531ff7dca219bb7ea2c@o4511684992237568.ingest.us.sentry.io/4511685001478144",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#tracesSampleRate
  tracesSampleRate: 1.0,
  // Enable profiling for a percentage of sessions
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#profileSessionSampleRate
  profileSessionSampleRate: 1.0,
  // Enable logs to be sent to Sentry
  enableLogs: true,
});