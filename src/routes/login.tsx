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
    <div className="flex items-center justify-center min-h-100 p-3 sm:p-6 md:p-8 w-full">
      <div className="text-center">
        <h1>Log in</h1>
        <p>Sign in with your institutional account to manage tools.</p>
        <LoginButton />
        {auth.error && (
          <p className="p-4 mt-2 bg-red-600 text-white rounded-lg">Authentication error: {auth.error.message}</p>
        )}
      </div>
    </div>
  );
}