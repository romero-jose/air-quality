import type { QueryClient } from '@tanstack/react-query'

import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { ThemeProvider } from '@/components/theme-provider'
import { buttonVariants } from '@/components/ui/button'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import styleCss from '@/style.css?url'
import { cn } from '@/utils/styling'
import { TanStackDevtools } from '@tanstack/react-devtools'

const navLinkClassName = cn(
  buttonVariants({ variant: 'ghost' }),
  'data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground',
)

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Santiago Air Quality',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: styleCss,
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '256x256',
        href: '/favicon.png',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
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
        </ThemeProvider>
        <main className="mx-auto w-full max-w-5xl p-4">{children}</main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
