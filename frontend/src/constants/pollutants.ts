export const POLLUTANTS = ['pm25', 'pm10', 'no2', 'o3', 'co', 'so2'] as const

export type Pollutant = (typeof POLLUTANTS)[number]

export const POLLUTANT_META: Record<
  Pollutant,
  {
    label: string
    unit: string
    caution: number
    unhealthy: number
  }
> = {
  pm25: { label: 'PM2.5', unit: 'ug/m3', caution: 15, unhealthy: 35 },
  pm10: { label: 'PM10', unit: 'ug/m3', caution: 45, unhealthy: 150 },
  no2: { label: 'NO2', unit: 'ppb', caution: 53, unhealthy: 100 },
  o3: { label: 'O3', unit: 'ppb', caution: 54, unhealthy: 70 },
  co: { label: 'CO', unit: 'ppm', caution: 4.4, unhealthy: 9.4 },
  so2: { label: 'SO2', unit: 'ppb', caution: 35, unhealthy: 75 },
}

export const POLLUTANT_STATUS = ['good', 'caution', 'unhealthy', 'missing']
export const POLLUTANT_STATUS_DISPLAY_NAMES: Record<string, string> = {
  good: 'Good',
  caution: 'Caution',
  unhealthy: 'Unhealthy',
  missing: 'No data',
}
export type PollutantStatus = (typeof POLLUTANT_STATUS)[number]
