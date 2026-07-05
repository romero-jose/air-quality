import type { Logger as DrizzleLogger } from "drizzle-orm/logger";
import pino, { type Logger, type LoggerOptions } from "pino";

export type AppLogger = Logger;

const redactPaths = [
  "DATABASE_URL",
  "PGPASSWORD",
  "password",
  "*.password",
  "authorization",
  "headers.authorization",
  "req.headers.authorization",
  "cookie",
  "headers.cookie",
  "req.headers.cookie",
];

export const createLogger = () =>
  pino({
    level: process.env.LOG_LEVEL ?? "info",
    base: {
      service: "air-quality-backend",
      env: process.env.NODE_ENV ?? "development",
    },
    redact: {
      paths: redactPaths,
      censor: "[redacted]",
    },
  } satisfies LoggerOptions);

export const createDrizzleLogger = (logger: AppLogger): DrizzleLogger => ({
  logQuery(query, params) {
    logger.debug({ query, params }, "database query");
  },
});
