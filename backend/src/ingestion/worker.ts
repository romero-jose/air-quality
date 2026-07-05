import type { Db } from "../db/client.js";
import type { AppLogger } from "../logging.js";
import { ingestSincaReadings } from "./sinca.js";

const DEFAULT_INGESTION_INTERVAL_MS = 15 * 60 * 1000;

export type IngestionWorker = {
  stop: () => void;
};

const getIngestionIntervalMs = () => {
  const raw = process.env.INGESTION_INTERVAL_MS;
  if (!raw) return DEFAULT_INGESTION_INTERVAL_MS;

  const interval = Number(raw);
  if (!Number.isFinite(interval) || interval <= 0) {
    throw new Error("INGESTION_INTERVAL_MS must be a positive number");
  }

  return interval;
};

type IngestionOptions = {
  logger: AppLogger;
};

export const runIngestion = async (db: Db, { logger }: IngestionOptions) => {
  const startedAt = new Date();
  logger.info({ startedAt: startedAt.toISOString() }, "ingestion started");

  const result = await ingestSincaReadings(db);

  logger.info(
    {
      stations: result.stations,
      scrapedReadings: result.scrapedReadings,
      writtenReadings: result.writtenReadings,
      failedStations: result.failedStations.length,
    },
    "ingestion finished",
  );

  for (const failure of result.failedStations) {
    logger.error({ stationCode: failure.code, error: failure.error }, "station ingestion failed");
  }
};

export const startIngestionWorker = async (db: Db, { logger }: IngestionOptions) => {
  let ingestionRunning = false;
  const intervalMs = getIngestionIntervalMs();

  await runIngestion(db, { logger });

  const interval = setInterval(() => {
    if (ingestionRunning) {
      logger.warn("previous ingestion run is still active; skipping this tick");
      return;
    }

    ingestionRunning = true;
    runIngestion(db, { logger })
      .catch((error: unknown) => {
        logger.error({ err: error }, "unexpected ingestion failure");
      })
      .finally(() => {
        ingestionRunning = false;
      });
  }, intervalMs);

  logger.info({ intervalMs }, "ingestion worker started");

  return {
    stop: () => {
      clearInterval(interval);
      logger.info("ingestion worker stopped");
    },
  };
};
