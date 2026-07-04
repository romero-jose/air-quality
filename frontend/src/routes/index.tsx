import { createFileRoute } from '@tanstack/react-router'
import { StationsMap } from '@/components/StationsMap'

const IndexComponent = () => (
  <div className="flex flex-col gap-4">
    <StationsMap />
  </div>
)

export const Route = createFileRoute('/')({
  component: IndexComponent,
})
