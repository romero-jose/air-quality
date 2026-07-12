import { QueryClient } from '@tanstack/react-query'

import { createRouter } from '@tanstack/react-router'

import * as Sentry from '@sentry/tanstackstart-react'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { RouteError } from './components/RouteError'
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
    Sentry.addIntegration(
      Sentry.tanstackRouterBrowserTracingIntegration(router),
    )
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
