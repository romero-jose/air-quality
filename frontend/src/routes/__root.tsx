import { ReactNode } from 'react'

import { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ThemeProvider } from '../components/theme-provider'
import { buttonVariants } from '../components/ui/button'
import styleCss from '../style.css?url'
import { cn } from '../utils/styling'

const navLinkClassName = cn(
  buttonVariants({ variant: 'ghost' }),
  'data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground',
)

function AppShell() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
          <Link
            to="/"
            className="font-heading text-lg font-semibold hover:text-muted-foreground"
          >
            Santiago Air Quality
          </Link>
          <nav className="flex gap-1">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className={navLinkClassName}
            >
              Home
            </Link>
            <Link
              to="/stations"
              activeOptions={{ exact: true }}
              className={navLinkClassName}
            >
              Stations
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl p-4">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

const RootComponent = () => {
  const { queryClient } = Route.useRouteContext()

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="air-quality-theme">
          <AppShell />
        </ThemeProvider>
      </QueryClientProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export interface RootRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      { title: 'Santiago Air Quality' },
    ],
    links: [{ rel: 'stylesheet', href: styleCss }],
  }),
  component: RootComponent,
})
