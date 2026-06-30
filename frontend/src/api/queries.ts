import { queryOptions } from "@tanstack/react-query";

import { fetchReadings, fetchStations } from "./airQuality";

export const stationsQuery = () =>
  queryOptions({
    queryKey: ["stations"],
    queryFn: fetchStations,
    staleTime: 1000 * 60 * 10,
  });

export const readingsQuery = (options: { stationCode?: string, limit?: number, from?: string, to?: string }) =>
  queryOptions({
    queryKey: ["readings", options],
    queryFn: () => fetchReadings(options),
    staleTime: 1000 * 60 * 5,
  });
