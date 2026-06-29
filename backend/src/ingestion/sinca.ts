import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { readings, stations, type NewReading } from "../db/schema.js";
import { fetchStationReadings } from "../scraper/sinca.js";

export type IngestionResult = {
  stations: number;
  scrapedReadings: number;
  writtenReadings: number;
  failedStations: Array<{
    code: string;
    error: string;
  }>;
};

type Db = PostgresJsDatabase<Record<string, never>>;

function toReadingValues(
  stationId: number,
  scraped: Awaited<ReturnType<typeof fetchStationReadings>>,
): NewReading[] {
  return scraped.map((reading) => ({
    stationId,
    date: reading.date,
    hour: reading.hour,
    pm25: reading.pm25,
    pm10: reading.pm10,
    so2: reading.so2,
    no2: reading.no2,
    co: reading.co,
    o3: reading.o3,
    preliminary: reading.preliminary,
  }));
}

export async function ingestSincaReadings(db: Db): Promise<IngestionResult> {
  const configuredStations = await db.select().from(stations);

  const result: IngestionResult = {
    stations: configuredStations.length,
    scrapedReadings: 0,
    writtenReadings: 0,
    failedStations: [],
  };

  for (const station of configuredStations) {
    try {
      const scraped = await fetchStationReadings(station.code, station.domain);
      result.scrapedReadings += scraped.length;

      const values = toReadingValues(station.id, scraped);
      if (values.length === 0) {
        continue;
      }

      await db
        .insert(readings)
        .values(values)
        .onConflictDoUpdate({
          target: [readings.stationId, readings.date, readings.hour],
          set: {
            pm25: sql`excluded.pm25`,
            pm10: sql`excluded.pm10`,
            so2: sql`excluded.so2`,
            no2: sql`excluded.no2`,
            co: sql`excluded.co`,
            o3: sql`excluded.o3`,
            preliminary: sql`excluded.preliminary`,
            updatedAt: new Date(),
          },
        });

      result.writtenReadings += values.length;
    } catch (error) {
      result.failedStations.push({
        code: station.code,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}
