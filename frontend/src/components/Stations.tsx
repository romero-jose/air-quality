import { Suspense, lazy } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'

import { readingsQuery } from '@/api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const StationsMap = lazy(() =>
  import('@/components/map').then(m => ({ default: m.StationsMap })),
)

export const Stations = () => {
  const stationsResult = useSuspenseQuery(readingsQuery({ limit: 10 }))

  if (stationsResult.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load station data</AlertTitle>
        <AlertDescription>{stationsResult.error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Suspense
      fallback={
        <Skeleton
          className="h-[500px] w-full"
          role="status"
          aria-live="polite"
        />
      }
    >
      <StationsMap stations={stationsResult.data} />
    </Suspense>
  )
}
