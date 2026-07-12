import { Suspense, lazy } from 'react'

import { ClientOnly } from '@tanstack/react-router'

import type { StationReadings } from '@/schemas/reading'

import { MapPlaceholder } from './MapPlaceholder'

const InteractiveMap = lazy(() =>
  import('./InteractiveMap').then(m => ({ default: m.InteractiveMap })),
)

export function StationsMap({ stations }: { stations: StationReadings[] }) {
  return (
    <ClientOnly fallback={<MapPlaceholder />}>
      <Suspense fallback={<MapPlaceholder />}>
        <InteractiveMap stations={stations} />
      </Suspense>
    </ClientOnly>
  )
}
