import {
  POLLUTANT_META,
  POLLUTANT_STATUS_DISPLAY_NAMES,
} from '#/constants/pollutants'
import type { LocatedStationReadings } from '#/schemas/reading'
import { formatValue } from '#/utils/common'
import {
  formatDateTime,
  getLatestPm25Reading,
  getStatus,
} from '#/utils/readings'

import { Link } from '@tanstack/react-router'

export function StationPopupContent({
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
