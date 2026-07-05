import { useQuery } from '@tanstack/react-query'

import { Link } from '@tanstack/react-router'

import { stationsQuery } from '@/api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/styling'

const stationLinkClassName = cn(
  buttonVariants({ variant: 'ghost' }),
  'h-auto w-full justify-start px-3 py-2',
)

export const StationList = () => {
  const stations = useQuery(stationsQuery())

  if (stations.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full" />
        ))}
      </div>
    )
  }

  if (stations.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load stations</AlertTitle>
        <AlertDescription>{stations.error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        {stations.data?.map(station => (
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
