import { useSuspenseQuery } from '@tanstack/react-query'

import { readingsQuery } from '@/api/queries'
import { StationsMap } from '@/components/map'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

export const Stations = () => {
  const stationsResult = useSuspenseQuery(readingsQuery({ limit: 10 }))

  if (stationsResult.isLoading) {
    return (
      <Skeleton className="h-[500px] w-full" role="status" aria-live="polite" />
    )
  }

  if (stationsResult.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load station data</AlertTitle>
        <AlertDescription>{stationsResult.error.message}</AlertDescription>
      </Alert>
    )
  }

  return StationsMap({ stations: stationsResult.data })
}
