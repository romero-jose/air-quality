import { asc, desc } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import type { Db } from "../db/client.js";
import { formatZodError } from "../http/validation.js";

type ReadingsRoutesOptions = {
  db: Db;
};

const dateSchema = z.iso.date();

const toStationCodes = (value: unknown) => {
  if (value === undefined) return undefined;

  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) => String(item).split(","))
    .map((code) => code.trim())
    .filter(Boolean);
};

const readingsQuerySchema = z
  .object({
    stationCode: z.preprocess(
      toStationCodes,
      z.array(z.string().min(1).max(16)).max(100).optional(),
    ),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
    limit: z.coerce.number().int().positive().max(5000).default(500),
  })
  .refine(({ from, to }) => !from || !to || from <= to, {
    path: ["from"],
    message: "from must be before or equal to to",
  });

export const readingsRoutes: FastifyPluginAsync<ReadingsRoutesOptions> = async (
  app,
  { db },
) => {
  app.get("/readings", async (request, reply) => {
    const result = readingsQuerySchema.safeParse(request.query);
    if (!result.success) {
      return reply.code(400).send(formatZodError(result.error));
    }

    const { stationCode, from, to, limit } = result.data;

    const data = await db.query.stations.findMany({
      where: {
        code: {
          in: stationCode,
        },
      },
      with: {
        readings: {
          where: {
            date: {
              gte: from,
              lte: to,
            },
          },
          orderBy: (t) => [desc(t.date), desc(t.hour)],
          limit: limit,
        },
      },
      orderBy: (t) => [asc(t.code)],
    });

    return { data };
  });
};
