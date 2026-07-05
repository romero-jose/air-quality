import type { QueryClient } from '@tanstack/react-query'

import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

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

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

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
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: styleCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
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
