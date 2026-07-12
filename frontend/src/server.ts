import '@/../instrument.server.mjs'
import { wrapFetchWithSentry } from '@sentry/tanstackstart-react'
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import type { ServerRequest } from 'srvx'

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      const serverRequest = request as ServerRequest

      return handler.fetch(request, {
        onEarlyHints: ({ phase, allLinks }) => {
          if (phase !== 'dynamic') return

          const response = serverRequest.runtime?.node?.res

          if (response?.writeEarlyHints && allLinks.length) {
            response.writeEarlyHints({ link: allLinks })
          }
        },
      })
    },
  }),
)
