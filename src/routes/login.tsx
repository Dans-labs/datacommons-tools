import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LoginButton } from "../components/Auth";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})
 
function RouteComponent() {
  const auth = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (auth.isAuthenticated) navigate({ to: "/" });
  }, [auth.isAuthenticated]);
 
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Log in</h1>
        <p>Sign in with your institutional account to manage tools.</p>
        <LoginButton />
        {auth.error && (
          <p className="form-error">Auth error: {auth.error.message}</p>
        )}
      </div>
    </div>
  );
}