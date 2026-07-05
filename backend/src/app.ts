import cors from "@fastify/cors";
import Fastify from "fastify";

import type { Db } from "./db/client.js";
import type { AppLogger } from "./logging.js";
import { healthRoutes } from "./routes/health.js";
import { readingsRoutes } from "./routes/readings.js";
import { stationsRoutes } from "./routes/stations.js";

type CreateAppOptions = {
  db: Db;
  logger: AppLogger;
};

export const createApp = ({ db, logger }: CreateAppOptions) => {
  const app = Fastify({
    loggerInstance: logger,
  });

  void app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? true,
  });

  void app.register(healthRoutes);
  void app.register(stationsRoutes, { db });
  void app.register(readingsRoutes, { db });

  return app;
};
