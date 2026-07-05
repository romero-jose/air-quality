import { queryOptions } from '@tanstack/react-query'

import { fetchReadings, type FetchReadingsOptions } from './readings'
import { fetchStations } from './stations'

export const stationsQuery = () =>
  queryOptions({
    queryKey: ['stations'],
    queryFn: fetchStations,
    staleTime: 1000 * 60 * 10,
  })

export const readingsQuery = (options: FetchReadingsOptions) =>
  queryOptions({
    queryKey: ['readings', options],
    queryFn: () => fetchReadings(options),
  })
