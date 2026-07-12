import { Stations } from '#/components/Stations'

import { createFileRoute } from '@tanstack/react-router'

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
  component: IndexComponent,
})
