import { useSuspenseQuery } from '@tanstack/react-query'

import { Link } from '@tanstack/react-router'

import { stationsQuery } from '@/api/queries'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/styling'

const stationLinkClassName = cn(
  buttonVariants({ variant: 'ghost' }),
  'h-auto w-full justify-start px-3 py-2',
)

export const StationList = () => {
  const { data: stations } = useSuspenseQuery(stationsQuery())

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        {stations.map(station => (
          <Link
            key={station.code}
            to={`/stations/$stationCode`}
            params={{ stationCode: station.code }}
            className={stationLinkClassName}
          >
            {station.name} ({station.code})
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
