import { Suspense, lazy } from 'react'

import { ClientOnly } from '@tanstack/react-router'

import { MapPlaceholder } from './MapPlaceholder'

const InteractiveMap = lazy(() =>
  import('./InteractiveMap').then(m => ({ default: m.InteractiveMap })),
)

export function StationsMap() {
  return (
    <ClientOnly fallback={<MapPlaceholder />}>
      <Suspense fallback={<MapPlaceholder />}>
        <InteractiveMap />
      </Suspense>
    </ClientOnly>
  )
}
