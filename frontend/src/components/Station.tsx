import { useQuery } from "@tanstack/react-query";
import { readingsQuery } from "../api/queries";
import {
  pollutantKeys,
  pollutantMeta,
  getReadingValue,
  getStatus,
  formatDateTime,
  type Reading,
} from "../api/airQuality";

const statusLabels: Record<ReturnType<typeof getStatus>, string> = {
  good: "Good",
  caution: "Caution",
  unhealthy: "Unhealthy",
  missing: "No data",
};

function formatValue(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}

export const Station = ({ stationCode }: { stationCode: string }) => {
  const result = useQuery(readingsQuery({ stationCode, limit: 10 }));

  if (result.isLoading) {
    return <div role="status" aria-live="polite">Loading station data…</div>;
  }

  if (result.isError) {
    return <div role="alert">Couldn't load readings: {result.error.message}</div>;
  }

  const station = result.data?.[0];

  if (!station) {
    return <div>No station found for code "{stationCode}".</div>;
  }

  if (!station.readings[0]) {
    return (
      <div>
        <h4>
          {station.name} ({station.code})
        </h4>
        <p>No readings available for this station.</p>
      </div>
    );
  }

  const latest = station.readings[0];
  const latestPm25Status = getStatus(getReadingValue(latest, "pm25"), "pm25");

  return (
    <div>
      <header>
        <h4>
          {station.name} ({station.code})
        </h4>
        {station.lat !== null && station.lon !== null && (
          <p>
            {station.lat.toFixed(4)}, {station.lon.toFixed(4)}
          </p>
        )}
      </header>

      <p>
        {formatDateTime(latest)} · PM2.5:{" "}
        <span data-status={latestPm25Status}>
          {formatValue(latest.pm25)} {pollutantMeta.pm25.unit} — {statusLabels[latestPm25Status]}
        </span>
        {latest.preliminary && <span> (Preliminary)</span>}
      </p>

      <table>
        <caption>Recent readings for {station.name}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Hour</th>
            {pollutantKeys.map((key) => (
              <th key={key} scope="col">
                {pollutantMeta[key].label} ({pollutantMeta[key].unit})
              </th>
            ))}
            <th scope="col">Preliminary</th>
          </tr>
        </thead>
        <tbody>
          {station.readings.map((reading: Reading) => (
            <tr key={reading.id}>
              <td>{reading.date}</td>
              <td>{reading.hour.slice(0, 5)}</td>
              {pollutantKeys.map((key) => {
                const value = getReadingValue(reading, key);
                const status = getStatus(value, key);
                return (
                  <td key={key} data-status={status}>
                    {formatValue(value)}
                  </td>
                );
              })}
              <td>{reading.preliminary ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
