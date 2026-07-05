import { Map, Marker, NavigationControl, Popup } from 'react-map-gl/maplibre'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Link } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { MAP_STYLE, SANTIAGO_CENTER } from '@/constants/map'
import {
  POLLUTANT_META,
  POLLUTANT_STATUS,
  POLLUTANT_STATUS_DISPLAY_NAMES,
} from '@/constants/pollutants'
import type { StationReadings } from '@/schemas/reading'
import '@/styles/map.css'
import { formatMarkerValue, formatValue } from '@/utils/common'
import {
  formatDateTime,
  getLatestPm25Reading,
  getStatus,
} from '@/utils/readings'
import 'maplibre-gl/dist/maplibre-gl.css'

type LocatedStationReadings = StationReadings & { lat: number; lon: number }

export const StationsMap = () => {
  const stationsResult = useQuery(readingsQuery({ limit: 1 }))
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null,
  )

  const stationsWithLocation = useMemo(() => {
    if (!stationsResult.data) return []
    return stationsResult.data.filter(
      (station): station is LocatedStationReadings =>
        station.lat !== null && station.lon !== null,
    )
  }, [stationsResult.data])

  const selectedStation = useMemo(
    () =>
      stationsWithLocation.find(station => station.id === selectedStationId) ??
      null,
    [stationsWithLocation, selectedStationId],
  )

  if (stationsResult.isLoading) {
    return (
      <Skeleton className="h-[500px] w-full" role="status" aria-live="polite" />
    )
  }

  if (stationsResult.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load station data</AlertTitle>
        <AlertDescription>{stationsResult.error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-border">
      <Map
        initialViewState={SANTIAGO_CENTER}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setSelectedStationId(null)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {stationsWithLocation.map(station => {
          const latestReading = getLatestPm25Reading(station.readings)
          const value = latestReading ? latestReading.pm25 : null
          const status = getStatus(value, 'pm25')

          return (
            <Marker
              key={station.id}
              longitude={station.lon}
              latitude={station.lat}
              anchor="bottom"
              onClick={event => {
                event.originalEvent.stopPropagation()
                setSelectedStationId(station.id)
              }}
            >
              <button
                type="button"
                className="station-marker"
                data-status={status}
                data-active={selectedStationId === station.id}
                aria-label={`${station.name}: PM2.5 ${formatValue(value)} ${POLLUTANT_META.pm25.unit}, ${POLLUTANT_STATUS_DISPLAY_NAMES[status]}`}
              >
                {status === 'unhealthy' && (
                  <span className="station-marker-pulse" aria-hidden="true" />
                )}
                <span className="station-marker-value">
                  {formatMarkerValue(value)}
                </span>
              </button>
            </Marker>
          )
        })}

        {selectedStation && (
          <Popup
            longitude={selectedStation.lon}
            latitude={selectedStation.lat}
            anchor="bottom"
            offset={22}
            maxWidth="280px"
            closeButton={false}
            closeOnClick={false}
            onClose={() => setSelectedStationId(null)}
            className="station-popup"
          >
            <StationPopupContent
              station={selectedStation}
              onClose={() => setSelectedStationId(null)}
            />
          </Popup>
        )}
      </Map>

      <MapLegend />
    </div>
  )
}

function StationPopupContent({
  station,
  onClose,
}: {
  station: LocatedStationReadings
  onClose: () => void
}) {
  const latestReading = getLatestPm25Reading(station.readings)
  const value = latestReading ? latestReading.pm25 : null
  const status = getStatus(value, 'pm25')

  return (
    <div className="station-popup-card">
      <button
        type="button"
        className="station-popup-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <Link
        to="/stations/$stationCode"
        params={{ stationCode: station.code }}
        className="station-popup-title"
      >
        {station.name}
        <span className="station-popup-code">{station.code}</span>
      </Link>
      {latestReading ? (
        <div className="station-popup-reading">
          <span className="station-popup-value" data-status={status}>
            {formatValue(value)} <small>{POLLUTANT_META.pm25.unit}</small>
          </span>
          <div className="station-popup-meta">
            <span data-status={status} className="station-popup-status">
              {POLLUTANT_STATUS_DISPLAY_NAMES[status]}
            </span>
            <span className="station-popup-time">
              {formatDateTime(latestReading)}
            </span>
          </div>
        </div>
      ) : (
        <p className="station-popup-empty">No readings available</p>
      )}
    </div>
  )
}

function MapLegend() {
  return (
    <div className="map-legend">
      {POLLUTANT_STATUS.map(status => (
        <div key={status} className="map-legend-item">
          <span className="map-legend-dot" data-status={status} />
          {POLLUTANT_STATUS_DISPLAY_NAMES[status]}
        </div>
      ))}
    </div>
  )
}
