import { hydrateRoot } from 'react-dom/client'

import { StrictMode, startTransition } from 'react'

import '@/instrument.client'
import { StartClient } from '@tanstack/react-start/client'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  )
})
