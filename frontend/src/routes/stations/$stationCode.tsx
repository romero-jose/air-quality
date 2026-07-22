import { createFileRoute } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'
import { Station } from '@/components/Station'
import { formatValue } from '@/utils/common'
import { getLatestPm25Reading } from '@/utils/readings'

export const Route = createFileRoute('/stations/$stationCode')({
  loader: ({ context: { queryClient }, params: { stationCode } }) => {
    return queryClient.ensureQueryData(
      readingsQuery({ stationCode, limit: 10 }),
    )
  },
  head: ({ loaderData }) => {
    const station = loaderData?.[0]
    const latest = station ? getLatestPm25Reading(station.readings) : null
    return {
      meta: [
        {
          title: station
            ? `${station.name} Air Quality — PM2.5 ${latest ? formatValue(latest.pm25) : '—'} µg/m³ | Santiago Air Quality`
            : 'Station | Santiago Air Quality',
        },
        {
          name: 'description',
          content: station
            ? `Live PM2.5, PM10 and pollutant readings for ${station.name} (${station.code})${station.municipality ? `, ${station.municipality}` : ''}, Santiago, Chile.`
            : undefined,
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control':
      'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const stationCode = Route.useParams().stationCode
  return <Station stationCode={stationCode} />
}
