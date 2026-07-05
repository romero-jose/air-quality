import { apiBaseUrl } from '@/config'
import { readingsResponseSchema } from '@/schemas/reading'
import { stationsResponseSchema } from '@/schemas/station'
import { logger } from '@/utils/logger'

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

  const startedAt = performance.now()

  try {
    const response = await fetch(url)
    const durationMs = Math.round(performance.now() - startedAt)

    logger.info('api request', {
      method: 'GET',
      path,
      status: response.status,
      durationMs,
    })

    return (await assertResponse(response).then(response =>
      response.json(),
    )) as unknown
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt)

    logger.error('api request failed', {
      method: 'GET',
      path,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
    })

    throw error
  }
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
