import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from 'react-oidc-context'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/signin-callback')({
  component: SigninCallback,
})

function SigninCallback() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isLoading && !auth.error) {
      navigate({ to: '/' })
    }
  }, [auth.isLoading, auth.error, navigate])

  if (auth.error) return <div className="p-10">Auth error: {auth.error.message}</div>
  return <div className="p-10">Signing in…</div>
}