CREATE TABLE "readings" (
	"id" serial PRIMARY KEY,
	"station_id" integer NOT NULL,
	"date" date NOT NULL,
	"hour" time NOT NULL,
	"pm25" real,
	"pm10" real,
	"so2" real,
	"no2" real,
	"co" real,
	"o3" real,
	"preliminary" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" serial PRIMARY KEY,
	"code" varchar(16) NOT NULL UNIQUE,
	"domain" varchar(32) DEFAULT 'CONAMA' NOT NULL,
	"name" text NOT NULL,
	"municipality" text,
	"lat" real,
	"lon" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "readings_station_date_hour_idx" ON "readings" ("station_id","date","hour");--> statement-breakpoint
CREATE INDEX "readings_station_date_idx" ON "readings" ("station_id","date");--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_station_id_stations_id_fkey" FOREIGN KEY ("station_id") REFERENCES "stations"("id") ON DELETE CASCADE;