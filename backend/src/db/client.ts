import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(process.env.DATABASE_URL, { prepare: false });
  const db = drizzle({ client });

  return { client, db };
}
