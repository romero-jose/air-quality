import { createFileRoute } from '@tanstack/react-router'

import { readingsQuery } from '@/api/queries'
import { Stations } from '@/components/Stations'

const IndexComponent = () => (
  <div className="flex flex-col gap-4">
    <Stations />
  </div>
)

export const Route = createFileRoute('/')({
  headers: () => ({
    'Cache-Control':
      'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
  }),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(readingsQuery({ limit: 10 }))
  },
  component: IndexComponent,
})
