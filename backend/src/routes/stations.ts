import { asc, eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import type { Db } from "../db/client.js";
import { stations } from "../db/schema.js";
import { formatZodError } from "../http/validation.js";

type StationsRoutesOptions = {
  db: Db;
};

const stationParamsSchema = z.object({
  code: z.string().min(1).max(16),
});

export const stationsRoutes: FastifyPluginAsync<StationsRoutesOptions> = async (app, { db }) => {
  app.get("/stations", async () => {
    const rows = await db.select().from(stations).orderBy(asc(stations.code));
    return { data: rows };
  });

  app.get("/stations/:code", async (request, reply) => {
    const params = stationParamsSchema.safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send(formatZodError(params.error));
    }

    const [station] = await db
      .select()
      .from(stations)
      .where(eq(stations.code, params.data.code))
      .limit(1);

    if (!station) {
      return reply.code(404).send({ error: "Station not found" });
    }

    return { data: station };
  });
};
