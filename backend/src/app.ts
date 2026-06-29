import cors from "@fastify/cors";
import Fastify from "fastify";

import type { Db } from "./db/client.js";
import { healthRoutes } from "./routes/health.js";
import { readingsRoutes } from "./routes/readings.js";
import { stationsRoutes } from "./routes/stations.js";

type CreateAppOptions = {
  db: Db;
};

export const createApp = ({ db }: CreateAppOptions) => {
  const app = Fastify({
    logger: true,
  });

  void app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? true,
  });

  void app.register(healthRoutes);
  void app.register(stationsRoutes, { db });
  void app.register(readingsRoutes, { db });

  return app;
};
