import { createFileRoute } from '@tanstack/react-router'
import { Station } from '../../components/Station'

export const Route = createFileRoute('/stations/$stationCode')({
  component: RouteComponent,
})

function RouteComponent() {
  const stationCode = Route.useParams().stationCode
  return <Station stationCode={stationCode} />
}
