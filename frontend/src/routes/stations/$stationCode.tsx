import { createFileRoute } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'

import { Station } from '../../components/Station'

export const Route = createFileRoute('/stations/$stationCode')({
  loader: ({ context: { queryClient }, params: { stationCode } }) => {
    return queryClient.ensureQueryData(readingsQuery({ stationCode, limit: 10 }))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const stationCode = Route.useParams().stationCode
  return <Station stationCode={stationCode} />
}
