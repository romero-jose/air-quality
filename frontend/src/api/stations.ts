import { stationsResponseSchema } from '@/schemas/station'

import { getJson } from './client'

export const fetchStations = async () => {
  const json = await getJson('/stations')
  return stationsResponseSchema.parse(json).data
}
