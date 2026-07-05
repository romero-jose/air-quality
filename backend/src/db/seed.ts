import "dotenv/config";

import { createDb } from "./client.js";
import { stations } from "./schema.js";
import { createLogger } from "../logging.js";

const seedStations = [
  {
    code: "D14",
    domain: "CONAMA",
    name: "Parque O'Higgins",
    municipality: "Santiago",
    lat: -33.4641765,
    lon: -70.6607023,
  },
  {
    code: "D13",
    domain: "CONAMA",
    name: "Las Condes",
    municipality: "Las Condes",
    lat: -33.376776,
    lon: -70.5232561,
  },
];

const logger = createLogger().child({ component: "seed" });
const { client, db } = createDb({ logger });

try {
  const seededStations = [];

  for (const station of seedStations) {
    const [seededStation] = await db
      .insert(stations)
      .values(station)
      .onConflictDoUpdate({
        target: stations.code,
        set: {
          domain: station.domain,
          name: station.name,
          municipality: station.municipality,
          lat: station.lat,
          lon: station.lon,
        },
      })
      .returning({
        id: stations.id,
        code: stations.code,
        name: stations.name,
        municipality: stations.municipality,
        lat: stations.lat,
        lon: stations.lon,
      });

    seededStations.push(seededStation);
  }

  logger.info({ stations: seededStations }, "seeded stations");
} finally {
  await client.end();
}
