import { Map, Marker } from 'react-map-gl/maplibre'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { useSuspenseQuery } from '@tanstack/react-query'

import { MapPin } from 'lucide-react'

import { readingsQuery } from '@/api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MAP_STYLE } from '@/constants/map'
import {
  POLLUTANT_META,
  POLLUTANT_STATUS_DISPLAY_NAMES,
  type PollutantStatus,
} from '@/constants/pollutants'
import { type Reading, type StationReadings } from '@/schemas/reading'
import { formatValue } from '@/utils/common'
import {
  formatShortDate,
  getLatestPm25Reading,
  getStatus,
} from '@/utils/readings'
import { cn } from '@/utils/styling'
import 'maplibre-gl/dist/maplibre-gl.css'

const PM25 = POLLUTANT_META.pm25

const stationHeading = (station: StationReadings) =>
  station.municipality
    ? `Air Quality in ${station.municipality} — ${station.name}`
    : station.name

function StatusBadge({ status }: { status: PollutantStatus }) {
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
      {POLLUTANT_STATUS_DISPLAY_NAMES[status]}
    </Badge>
  )
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
  station,
  latest,
}: {
  station: StationReadings
  latest: Reading
}) {
  const status = getStatus(latest.pm25, 'pm25')

  return (
    <Card className="overflow-hidden p-0 lg:flex-1 lg:basis-0">
      <div className="flex h-full flex-col sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-3 p-6">
          <CardTitle>{station.name}</CardTitle>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums">
              {formatValue(latest.pm25)}
            </span>
            <span className="text-sm text-muted-foreground">
              {PM25.unit} · {PM25.label}
            </span>
            <StatusBadge status={status} />
          </div>
        </div>
        {station.lat !== null && station.lon !== null && (
          <div className="h-48 w-full sm:h-auto sm:w-72">
            <StationLocationMap lat={station.lat} lon={station.lon} />
          </div>
        )}
      </div>
    </Card>
  )
}

const chartConfig = {
  pm25: { label: PM25.label, color: 'var(--primary)' },
} satisfies ChartConfig

function Pm25TrendChart({ readings }: { readings: Reading[] }) {
  const data = readings
    .map(reading => ({
      hour: reading.hour.slice(0, 5),
      label: `${formatShortDate(reading.date)} · ${reading.hour.slice(0, 5)}`,
      pm25: reading.pm25,
    }))
    .reverse()

  return (
    <Card className="lg:flex-1 lg:basis-0">
      <CardHeader>
        <CardTitle>
          {PM25.label} trend ({PM25.unit})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis
              width={32}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
            />
            <ChartTooltip content={<ChartTooltipContent labelKey="label" />} />
            <Line
              dataKey="pm25"
              type="monotone"
              stroke="var(--color-pm25)"
              strokeWidth={2}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const Station = ({ stationCode }: { stationCode: string }) => {
  const { data: stations } = useSuspenseQuery(
    readingsQuery({ stationCode, limit: 10 }),
  )
  const station = stations[0]

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

  const latest = getLatestPm25Reading(station.readings)

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{stationHeading(station)}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          No readings available for this station.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <CurrentConditions station={station} latest={latest} />
        <Pm25TrendChart readings={station.readings} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{stationHeading(station)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Recent readings for {station.name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Hour</TableHead>
                <TableHead className="text-right">
                  {PM25.label} ({PM25.unit})
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {station.readings.map((reading: Reading) => (
                <TableRow key={reading.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatShortDate(reading.date)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {reading.hour.slice(0, 5)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatValue(reading.pm25)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getStatus(reading.pm25, 'pm25')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
