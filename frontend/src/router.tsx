import { QueryClient } from '@tanstack/react-query'

import { createRouter } from '@tanstack/react-router'

import * as Sentry from '@sentry/tanstackstart-react'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { RouteError } from './components/RouteError'
import { initSentry } from './instrument-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      queryClient,
    },
    defaultStaleTime: 5000,
    defaultErrorComponent: RouteError,
    scrollRestoration: true,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  if (!router.isServer) {
    const startSentry = () => {
      initSentry()
      Sentry.addIntegration(
        Sentry.tanstackRouterBrowserTracingIntegration(router),
      )
    }

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(startSentry, { timeout: 2000 })
    } else {
      window.setTimeout(startSentry, 0)
    }
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
