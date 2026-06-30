import { useQuery } from "@tanstack/react-query";
import { readingsQuery } from "../api/queries";

export const Station = ({
  stationCode,
}: {
  stationCode: string;
}) => {
  const stationReadingsResult = useQuery(readingsQuery({ stationCode, limit: 10 }));

  if (stationReadingsResult.isLoading) {
    return <div>Loading...</div>;
  }

  if (stationReadingsResult.isError || !stationReadingsResult.data) {
    return <div>Error loading station readings</div>;
  }

  const stationReadings = stationReadingsResult.data[0];

  if (!stationReadings) {
    return <div>No readings available for this station.</div>;
  }

  return (
    <div className="p-2">
      <h4>
        {stationReadings.name} ({stationReadings.code})
      </h4>
      <p>Latitude: {stationReadings.lat}</p>
      <p>Longitude: {stationReadings.lon}</p>
      <h5>Readings:</h5>
      <div>
        <table className="table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Date</th>
              <th className="border border-gray-300 px-2 py-1">Hour</th>
              <th className="border border-gray-300 px-2 py-1">PM2.5</th>
              <th className="border border-gray-300 px-2 py-1">Preliminary</th>
            </tr>
          </thead>
          <tbody>
            {stationReadings.readings.map((reading) => (
              <tr key={reading.date}>
                <td className="border border-gray-300 px-2 py-1">
                  {reading.date}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {reading.hour}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {reading.pm25}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {reading.preliminary ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
