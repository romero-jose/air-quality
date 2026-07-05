import { apiBaseUrl } from '@/config'
import { readingsResponseSchema } from '@/schemas/reading'
import { stationsResponseSchema } from '@/schemas/station'

const assertResponse = async (response: Response) => {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed with status ${response.status}`)
  }

  return response
}

const getJson = async (path: string, params?: URLSearchParams) => {
  const url = new URL(path, apiBaseUrl)
  params?.forEach((value, key) => {
    if (value) url.searchParams.set(key, value)
  })

  const response = await assertResponse(await fetch(url))
  return response.json() as Promise<unknown>
}

export const fetchStations = async () => {
  const json = await getJson('/stations')
  return stationsResponseSchema.parse(json).data
}

export const fetchReadings = async ({
  stationCode,
  from,
  to,
  limit = 500,
}: {
  stationCode?: string
  from?: string
  to?: string
  limit?: number
}) => {
  const params = new URLSearchParams()
  if (stationCode) params.set('stationCode', stationCode)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  params.set('limit', String(limit))

  const json = await getJson('/readings', params)
  return readingsResponseSchema.parse(json).data
}
