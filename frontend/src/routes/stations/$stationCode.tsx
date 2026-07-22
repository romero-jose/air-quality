import { createFileRoute } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'
import { Station } from '@/components/Station'
import {
  POLLUTANT_META,
  POLLUTANT_STATUS_DISPLAY_NAMES,
} from '@/constants/pollutants'
import { formatValue } from '@/utils/common'
import { getLatestPm25Reading, getStatus } from '@/utils/readings'

export const Route = createFileRoute('/stations/$stationCode')({
  loader: ({ context: { queryClient }, params: { stationCode } }) => {
    return queryClient.ensureQueryData(
      readingsQuery({ stationCode, limit: 10 }),
    )
  },
  head: ({ loaderData }) => {
    const station = loaderData?.[0]
    const latest = station ? getLatestPm25Reading(station.readings) : null
    const status = getStatus(latest?.pm25 ?? null, 'pm25')
    const place = station?.municipality ?? station?.name

    const title = station
      ? `Air Quality in ${place}, Santiago — PM2.5 ${latest ? formatValue(latest.pm25) : '—'} µg/m³`
      : 'Station | Santiago Air Quality'
    const description = station
      ? `Live air quality readings for ${place}, Santiago, Chile, from the ${station.name} monitoring station. Current PM2.5: ${latest ? formatValue(latest.pm25) : 'no data'} ${POLLUTANT_META.pm25.unit} (${POLLUTANT_STATUS_DISPLAY_NAMES[status]}).`
      : undefined

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
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
