import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider, useAuth } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';

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
  redirect_uri: `${import.meta.env.VITE_OIDC_REDIRECT_URI}/signin-callback`,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  context: {
    isAuthenticated: false,
  },
  defaultPendingComponent: () => <div />,
  defaultNotFoundComponent: () => <div />,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{
        isAuthenticated: auth.isAuthenticated 
      }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
