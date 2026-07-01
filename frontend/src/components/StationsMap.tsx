import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { readingsQuery } from "../api/queries";
import {
  getReadingValue,
  getStatus,
  formatDateTime,
  pollutantMeta,
  type StationReadings,
} from "../api/airQuality";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

import "../styles/map.css";

const SANTIAGO_CENTER: [number, number] = [-33.4489, -70.6693];
const DEFAULT_ZOOM = 11;

const statusLabels: Record<ReturnType<typeof getStatus>, string> = {
  good: "Good",
  caution: "Caution",
  unhealthy: "Unhealthy",
  missing: "No data",
};

const statusBadgeVariant: Record<
  ReturnType<typeof getStatus>,
  "secondary" | "default" | "destructive" | "outline"
> = {
  good: "secondary",
  caution: "default",
  unhealthy: "destructive",
  missing: "outline",
};

function formatValue(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}

function formatMarkerValue(value: number | null) {
  return value === null ? "—" : Math.round(value).toString();
}

function createMarkerIcon(status: ReturnType<typeof getStatus>, value: number | null) {
  return L.divIcon({
    className: "station-marker",
    html: `<span class="station-marker-value" data-status="${status}">${formatMarkerValue(value)}</span>`,
    iconSize: [36, 22],
    iconAnchor: [18, 11],
  });
}

export const StationsMap = () => {
  const stationsResult = useQuery(readingsQuery({ limit: 1 }));

  const stationsWithLocation = useMemo(() => {
    if (!stationsResult.data) return [];
    return stationsResult.data.filter(
      (station): station is StationReadings & { lat: number; lon: number } =>
        station.lat !== null && station.lon !== null,
    );
  }, [stationsResult.data]);

  if (stationsResult.isLoading) {
    return <Skeleton className="h-[500px] w-full" role="status" aria-live="polite" />;
  }

  if (stationsResult.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load station data</AlertTitle>
        <AlertDescription>{stationsResult.error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <MapContainer
      center={SANTIAGO_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-[500px] w-full overflow-hidden rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stationsWithLocation.map((station) => {
        const latest = station.readings[0];
        const value = latest ? getReadingValue(latest, "pm25") : null;
        const status = getStatus(value, "pm25");

        return (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={createMarkerIcon(status, value)}
          >
            <Popup>
              <Link
                to={`/stations/$stationCode`}
                params={{ stationCode: station.code }}
                className="font-medium hover:underline"
              >
                {station.name} ({station.code})
              </Link>
              {latest ? (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>
                    {formatDateTime(latest)} · PM2.5 {formatValue(value)}{" "}
                    {pollutantMeta.pm25.unit}
                  </span>
                  <Badge variant={statusBadgeVariant[status]}>
                    {statusLabels[status]}
                  </Badge>
                </div>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  No readings available
                </p>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
