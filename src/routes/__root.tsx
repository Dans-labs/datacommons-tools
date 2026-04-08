import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AuthTokenSync } from "../components/Auth";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Menu from '../components/Menu'

export interface RouterContext {
  isAuthenticated: boolean;
}
 
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
 

function RootLayout() {
  return (
    <>
      <AuthTokenSync />
      <Menu />
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  )
};