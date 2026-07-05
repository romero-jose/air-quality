import { apiBaseUrl } from '@/config'
import { logger } from '@/utils/logger'

const assertResponse = async (response: Response) => {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed with status ${response.status}`)
  }

  return response
}

export const getJson = async (path: string, params?: URLSearchParams) => {
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
