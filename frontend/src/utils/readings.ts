import {
  POLLUTANT_META,
  type Pollutant,
  type PollutantStatus,
} from '@/constants/pollutants'
import type { Reading } from '@/schemas/reading'

export const getLatestReading = (readings: Reading[], pollutant: Pollutant) =>
  readings.filter(r => r[pollutant] !== null)[0] || null

export const getLatestPm25Reading = (readings: Reading[]) =>
  getLatestReading(readings, 'pm25')

export const getStatus = (
  value: number | null,
  pollutant: Pollutant,
): PollutantStatus => {
  if (value === null) return 'missing'

  const meta = POLLUTANT_META[pollutant]
  if (value >= meta.unhealthy) return 'unhealthy'
  if (value >= meta.caution) return 'caution'
  return 'good'
}

export const formatDateTime = (reading: Reading | undefined) => {
  if (!reading) return 'No readings'

  return `${reading.date} ${reading.hour.slice(0, 5)}`
}

export const formatShortDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
