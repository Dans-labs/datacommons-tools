import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuth } from 'react-oidc-context'
import Loader from '../components/Loader';

export const Route = createFileRoute('/_authenticated')({
  component: AuthGuard,
})

function AuthGuard() {
  const auth = useAuth()
  const navigate = useNavigate()

  if (auth.isLoading) return <Loader />
  if (!auth.isAuthenticated) {
    navigate({ to: '/login' })
  }

  return <Outlet />
}
