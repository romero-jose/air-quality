import { createFileRoute } from '@tanstack/react-router'

import { stationsQuery } from '@/api/queries'
import { StationList } from '@/components/StationList'

export const Route = createFileRoute('/stations/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(stationsQuery())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">Stations</h1>
      <StationList />
    </div>
  )
}
