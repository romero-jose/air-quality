import { createFileRoute } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'
import { Stations } from '#/components/Stations'

const IndexComponent = () => (
  <div className="flex flex-col gap-4">
    <Stations />
  </div>
)

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(readingsQuery({ limit: 10 }))
  },
  component: IndexComponent,
})
