import { z } from "zod";

const apiBaseUrl =
  import.meta.env['VITE_API_BASE_URL'] ?? "https://air-quality-mte7.onrender.com";

const numberFromApiSchema = z.union([z.number(), z.string()]).pipe(z.coerce.number());
const nullableNumberFromApiSchema = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => (value === null ? null : Number(value)));

export const pollutantKeys = ["pm25", "pm10", "no2", "o3", "co", "so2"] as const;

export type PollutantKey = (typeof pollutantKeys)[number];

export const pollutantMeta: Record<
  PollutantKey,
  {
    label: string;
    unit: string;
    caution: number;
    unhealthy: number;
  }
> = {
  pm25: { label: "PM2.5", unit: "ug/m3", caution: 15, unhealthy: 35 },
  pm10: { label: "PM10", unit: "ug/m3", caution: 45, unhealthy: 150 },
  no2: { label: "NO2", unit: "ppb", caution: 53, unhealthy: 100 },
  o3: { label: "O3", unit: "ppb", caution: 54, unhealthy: 70 },
  co: { label: "CO", unit: "ppm", caution: 4.4, unhealthy: 9.4 },
  so2: { label: "SO2", unit: "ppb", caution: 35, unhealthy: 75 },
};

export const stationSchema = z.object({
  id: numberFromApiSchema,
  code: z.string(),
  domain: z.string(),
  name: z.string(),
  municipality: z.string().nullable(),
  lat: nullableNumberFromApiSchema,
  lon: nullableNumberFromApiSchema,
  createdAt: z.string(),
});

export const readingSchema = z.object({
  id: numberFromApiSchema,
  stationId: numberFromApiSchema,
  date: z.string(),
  hour: z.string(),
  pm25: nullableNumberFromApiSchema,
  pm10: nullableNumberFromApiSchema,
  so2: nullableNumberFromApiSchema,
  no2: nullableNumberFromApiSchema,
  co: nullableNumberFromApiSchema,
  o3: nullableNumberFromApiSchema,
  preliminary: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const stationsResponseSchema = z.object({
  data: z.array(stationSchema),
});

const readingsResponseSchema = z.object({
  data: z.array(
    stationSchema.extend({
      readings: z.array(readingSchema),
    }),
  ),
});

export type Station = z.infer<typeof stationSchema>;
export type Reading = z.infer<typeof readingSchema>;
export type StationReadings = z.infer<typeof readingsResponseSchema>["data"][number];

const assertResponse = async (response: Response) => {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return response;
};

const getJson = async (path: string, params?: URLSearchParams) => {
  const url = new URL(path, apiBaseUrl);
  params?.forEach((value, key) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await assertResponse(await fetch(url));
  return response.json() as Promise<unknown>;
};

export const fetchStations = async () => {
  const json = await getJson("/stations");
  return stationsResponseSchema.parse(json).data;
};

export const fetchReadings = async ({ stationCode, from, to, limit = 500 } : {
  stationCode?: string;
  from?: string;
  to?: string;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (stationCode) params.set("stationCode", stationCode);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  params.set("limit", String(limit));

  const json = await getJson("/readings", params);
  return readingsResponseSchema.parse(json).data;
};

export const getReadingValue = (reading: Reading, pollutant: PollutantKey) => reading[pollutant];

export const getStatus = (value: number | null, pollutant: PollutantKey) => {
  if (value === null) return "missing";

  const meta = pollutantMeta[pollutant];
  if (value >= meta.unhealthy) return "unhealthy";
  if (value >= meta.caution) return "caution";
  return "good";
};

export const formatDateTime = (reading: Reading | undefined) => {
  if (!reading) return "No readings";

  return `${reading.date} ${reading.hour.slice(0, 5)}`;
};
