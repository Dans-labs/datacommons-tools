import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useAuth } from 'react-oidc-context'
import Loader from '../components/Loader';

export const Route = createFileRoute('/_authenticated')({
  component: AuthGuard,
})

function AuthGuard() {
  const auth = useAuth()

  if (auth.isLoading) return <Loader />
  if (!auth.isAuthenticated) {
    auth.signinRedirect()
    return null
  }

  return <Outlet />
}
