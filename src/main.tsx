import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { SnackbarProvider } from 'notistack'
import { HelmetProvider } from 'react-helmet-async';
import Loader from './components/Loader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: `${import.meta.env.VITE_OIDC_REDIRECT_URI}`,
  response_type: 'code',
  scope: 'openid profile email eduperson_entitlement',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => <Loader />,
  defaultNotFoundComponent: () => <div />,
  scrollRestoration: true,
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      if (fromLocation?.pathname === toLocation?.pathname) return false
      return ['fade']
    }
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
        </QueryClientProvider>
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>
);
