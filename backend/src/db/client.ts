import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { createDrizzleLogger, type AppLogger } from "../logging.js";
import { relations } from "./relations.js";

type CreateDbOptions = {
  logger?: AppLogger;
};

export const createDb = ({ logger }: CreateDbOptions = {}) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(process.env.DATABASE_URL, { prepare: false });
  const db = drizzle({
    client,
    relations,
    logger: logger ? createDrizzleLogger(logger.child({ component: "database" })) : false,
  });

  return { client, db };
};

export type Db = ReturnType<typeof createDb>["db"];
