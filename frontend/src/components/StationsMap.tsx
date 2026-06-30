import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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

import "../styles/map.css";

const SANTIAGO_CENTER: [number, number] = [-33.4489, -70.6693];
const DEFAULT_ZOOM = 11;

const statusLabels: Record<ReturnType<typeof getStatus>, string> = {
  good: "Good",
  caution: "Caution",
  unhealthy: "Unhealthy",
  missing: "No data",
};

function formatValue(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}

function createMarkerIcon(status: ReturnType<typeof getStatus>) {
  return L.divIcon({
    className: "station-marker",
    html: `<span class="station-marker-dot" data-status="${status}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
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
    return <div role="status" aria-live="polite">Loading map…</div>;
  }

  if (stationsResult.isError) {
    return <div role="alert">Couldn't load station data: {stationsResult.error.message}</div>;
  }

  return (
    <MapContainer
      center={SANTIAGO_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "500px", width: "100%" }}
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
            icon={createMarkerIcon(status)}
          >
            <Popup>
              <strong>{station.name}</strong> ({station.code})
              <br />
              {latest ? (
                <>
                  {formatDateTime(latest)}
                  <br />
                  PM2.5: {formatValue(value)} {pollutantMeta.pm25.unit} — {statusLabels[status]}
                </>
              ) : (
                "No readings available"
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};