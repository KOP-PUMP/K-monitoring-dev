import { createRootRouteWithContext, Navigate } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  notFoundComponent: () => <Navigate to="/" />,
});
