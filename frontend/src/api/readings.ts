import { readingsResponseSchema } from '@/schemas/reading'

import { getJson } from './client'

export type FetchReadingsOptions = {
  stationCode?: string
  from?: string
  to?: string
  limit?: number
}

export const fetchReadings = async ({
  stationCode,
  from,
  to,
  limit = 500,
}: FetchReadingsOptions) => {
  const params = new URLSearchParams()
  if (stationCode) params.set('stationCode', stationCode)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  params.set('limit', String(limit))

  const json = await getJson('/readings', params)
  return readingsResponseSchema.parse(json).data
}
