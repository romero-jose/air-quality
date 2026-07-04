import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { buttonVariants } from "../components/ui/button";
import { cn } from "../utils/styling";

const navLinkClassName = cn(
  buttonVariants({ variant: "ghost" }),
  "data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground",
);

const RootComponent = () => (
  <>
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <Link to="/" className="font-heading text-lg font-semibold hover:text-muted-foreground">
          Santiago Air Quality
        </Link>
        <nav className="flex gap-1">
          <Link to="/" activeOptions={{ exact: true }} className={navLinkClassName}>
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
);

export const Route = createRootRoute({
  component: RootComponent,
});
