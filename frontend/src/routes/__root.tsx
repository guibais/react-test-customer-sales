import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import { ErrorBoundary } from "../components/error/ErrorBoundary";
import { OfflineIndicator } from "../components/error/OfflineIndicator";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ErrorBoundary>
      <OfflineIndicator />
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </ErrorBoundary>
  ),
});
