import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  date,
  time,
  real,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  domain: varchar("domain", { length: 32 }).notNull().default("CONAMA"),
  name: text("name").notNull(),
  municipality: text("municipality"),
  lat: real("lat"),
  lon: real("lon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const readings = pgTable(
  "readings",
  {
    id: serial("id").primaryKey(),
    stationId: integer("station_id")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    hour: time("hour").notNull(),
    pm25: real("pm25"),
    pm10: real("pm10"),
    so2: real("so2"),
    no2: real("no2"),
    co: real("co"),
    o3: real("o3"),
    preliminary: boolean("preliminary").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("readings_station_date_hour_idx").on(table.stationId, table.date, table.hour),
    index("readings_station_date_idx").on(table.stationId, table.date),
  ],
);

export type Station = typeof stations.$inferSelect;
export type NewStation = typeof stations.$inferInsert;
export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
