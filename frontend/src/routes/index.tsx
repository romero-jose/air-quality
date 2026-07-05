import { createFileRoute } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'
import { StationsMap } from '@/components/StationsMap'

const IndexComponent = () => (
  <div className="flex flex-col gap-4">
    <StationsMap />
  </div>
)

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(readingsQuery({ limit: 1 }))
  },
  component: IndexComponent,
})
