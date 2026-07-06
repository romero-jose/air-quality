import { POLLUTANT_STATUS, POLLUTANT_STATUS_DISPLAY_NAMES } from '@/constants/pollutants';


export function MapLegend() {
  return (
    <div className="map-legend">
      {POLLUTANT_STATUS.map(status => (
        <div key={status} className="map-legend-item">
          <span className="map-legend-dot" data-status={status} />
          {POLLUTANT_STATUS_DISPLAY_NAMES[status]}
        </div>
      ))}
    </div>
  );
}
