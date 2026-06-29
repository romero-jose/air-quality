import {defineRelations} from "drizzle-orm";
import {readings, stations} from "./schema.js";

export const relations = defineRelations({readings, stations}, (r) => ({
    stations: {
        readings: r.many.readings(),
    },
    readings: {
        station: r.one.stations({
            from: r.readings.stationId,
            to: r.stations.id,
        }),
    },
}));
