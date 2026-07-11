import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre'

import { useMemo, useState } from 'react'

import { MAP_STYLE, SANTIAGO_CENTER } from '@/constants/map'
import {
  POLLUTANT_META,
  POLLUTANT_STATUS_DISPLAY_NAMES,
} from '@/constants/pollutants'
import {
  type LocatedStationReadings,
  type StationReadings,
} from '@/schemas/reading'
import '@/styles/map.css'
import { formatMarkerValue, formatValue } from '@/utils/common'
import { getLatestPm25Reading, getStatus } from '@/utils/readings'
import 'maplibre-gl/dist/maplibre-gl.css'

import { MapLegend } from './MapLegend'
import { StationPopupContent } from './StationPopupContent'

export function StationsMap({ stations }: { stations: StationReadings[] }) {
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null,
  )

  const filteredStations = useMemo(
    () =>
      stations.filter(
        (station): station is LocatedStationReadings =>
          station.lat !== null && station.lon !== null,
      ),
    [stations],
  )

  const selectedStation = useMemo(
    () =>
      filteredStations.find(station => station.id === selectedStationId) ??
      null,
    [filteredStations, selectedStationId],
  )

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-border">
      <Map
        initialViewState={SANTIAGO_CENTER}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setSelectedStationId(null)}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {filteredStations.map(station => {
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
