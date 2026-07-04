import { useQuery } from '@tanstack/react-query'
import { Map, Marker } from 'react-map-gl/maplibre'
import { MapPin } from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { readingsQuery } from '../api/queries'
import {
  pollutantMeta,
  getReadingValue,
  getStatus,
  type Reading,
} from '../api/airQuality'
import { MAP_STYLE } from '../constants/map'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { Skeleton } from './ui/skeleton'
import { Badge } from './ui/badge'
import { cn } from '../utils/styling'
import { statusLabels } from '@/constants/readings'

export type Status = ReturnType<typeof getStatus>

function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant={status === 'unhealthy' ? 'destructive' : 'outline'}
      className={cn(
        status === 'good' &&
          'border-emerald-600 text-emerald-700 dark:text-emerald-400',
        status === 'caution' &&
          'border-amber-500 text-amber-700 dark:text-amber-400',
        status === 'missing' && 'text-muted-foreground',
      )}
    >
      {statusLabels[status]}
    </Badge>
  )
}

function formatValue(value: number | null) {
  return value === null ? '—' : value.toFixed(1)
}

function StationLocationMap({ lat, lon }: { lat: number; lon: number }) {
  return (
    <Map
      initialViewState={{ longitude: lon, latitude: lat, zoom: 11 }}
      mapStyle={MAP_STYLE}
      style={{ width: '100%', height: '100%' }}
      interactive={false}
      dragPan={false}
      scrollZoom={false}
      doubleClickZoom={false}
      touchZoomRotate={false}
      keyboard={false}
      attributionControl={false}
    >
      <Marker longitude={lon} latitude={lat} anchor="bottom">
        <MapPin
          className="h-6 w-6 fill-foreground text-background drop-shadow-sm"
          strokeWidth={1.5}
        />
      </Marker>
    </Map>
  )
}

function CurrentConditions({
  stationName,
  reading,
  lat,
  lon,
}: {
  stationName: string
  reading: Reading
  lat: number | null
  lon: number | null
}) {
  const value = getReadingValue(reading, 'pm25')
  const status = getStatus(value, 'pm25')
  const hasLocation = lat !== null && lon !== null

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-3 p-6">
          <CardTitle>{stationName}</CardTitle>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums">
              {formatValue(value)}
            </span>
            <span className="text-sm text-muted-foreground">
              {pollutantMeta.pm25.unit} · {pollutantMeta.pm25.label}
            </span>
            <StatusBadge status={status} />
          </div>
        </div>
        {hasLocation && (
          <div className="h-48 w-full sm:h-auto sm:w-72">
            <StationLocationMap lat={lat} lon={lon} />
          </div>
        )}
      </div>
    </Card>
  )
}

export const Station = ({ stationCode }: { stationCode: string }) => {
  const result = useQuery(readingsQuery({ stationCode, limit: 10 }))

  if (result.data) {
    const station = result.data[0]

    if (!station) {
      return (
        <Alert>
          <AlertTitle>Station not found</AlertTitle>
          <AlertDescription>
            No station found for code "{stationCode}".
          </AlertDescription>
        </Alert>
      )
    }

    const latest = station.readings.filter(r => r.pm25 !== null)[0] || null

    if (!latest) {
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
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <CurrentConditions
          stationName={station.name}
          reading={latest}
          lat={station.lat}
          lon={station.lon}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              {station.name} ({station.code})
            </CardTitle>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Preliminary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {station.readings.map((reading: Reading) => {
                  const value = getReadingValue(reading, 'pm25')
                  const status = getStatus(value, 'pm25')

                  return (
                    <TableRow key={reading.id}>
                      <TableCell>{reading.date}</TableCell>
                      <TableCell>{reading.hour.slice(0, 5)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatValue(value)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                      <TableCell>
                        {reading.preliminary ? 'Yes' : 'No'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (result.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load readings</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    )
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
  )
}
