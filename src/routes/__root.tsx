import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AuthTokenSync } from "../components/Auth";
import Menu from '../components/Menu'

export interface RouterContext {
}
 
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
 

function RootLayout() {
  return (
    <>
      <AuthTokenSync />
      <div className="flex flex-row min-h-screen">
        <Menu />
        <main className="grow pl-12 sm:pl-70 max-w-full">
          <Outlet />
        </main>
      </div>
    </>
  )
};