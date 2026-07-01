import { useQuery } from "@tanstack/react-query";
import { readingsQuery } from "../api/queries";
import {
  pollutantMeta,
  getReadingValue,
  getStatus,
  type Reading,
} from "../api/airQuality";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { cn } from "../lib/utils";

const statusLabels: Record<ReturnType<typeof getStatus>, string> = {
  good: "Good",
  caution: "Caution",
  unhealthy: "Unhealthy",
  missing: "No data",
};

const statusClassName: Record<ReturnType<typeof getStatus>, string> = {
  good: "",
  caution: "font-semibold",
  unhealthy: "font-semibold text-destructive",
  missing: "text-muted-foreground",
};

function formatValue(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}

export const Station = ({ stationCode }: { stationCode: string }) => {
  const result = useQuery(readingsQuery({ stationCode, limit: 10 }));

  if (result.data) {
    const station = result.data?.[0];

    if (!station) {
      return (
        <Alert>
          <AlertTitle>Station not found</AlertTitle>
          <AlertDescription>
            No station found for code "{stationCode}".
          </AlertDescription>
        </Alert>
      );
    }

    if (!station.readings[0]) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>
              {station.name} ({station.code})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            No readings available for this station.
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {station.name} ({station.code})
          </CardTitle>
          {station.lat !== null && station.lon !== null && (
            <CardDescription>
              {station.lat.toFixed(4)}, {station.lon.toFixed(4)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Recent readings for {station.name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Hour</TableHead>
                <TableHead className="text-right">
                  {pollutantMeta.pm25.label} ({pollutantMeta.pm25.unit})
                </TableHead>
                <TableHead>Preliminary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {station.readings.map((reading: Reading) => {
                const value = getReadingValue(reading, "pm25");
                const status = getStatus(value, "pm25");

                return (
                  <TableRow key={reading.id}>
                    <TableCell>{reading.date}</TableCell>
                    <TableCell>{reading.hour.slice(0, 5)}</TableCell>
                    <TableCell
                      className={cn("text-right", statusClassName[status])}
                      title={statusLabels[status]}
                    >
                      {formatValue(value)}
                    </TableCell>
                    <TableCell>{reading.preliminary ? "Yes" : "No"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (result.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load readings</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </CardContent>
    </Card>
  );
};
