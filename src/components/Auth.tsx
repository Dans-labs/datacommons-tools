import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { Button } from './Button';
import { useLocation } from "@tanstack/react-router";
import { setAuthToken } from "../api/client";

export function LoginButton({ className }: { className?: string }) {
  const auth = useAuth();
  const location = useLocation();

  return (
    <Button className={className} onClick={() => auth.signinRedirect({ state: location.pathname })}>
      {auth.isLoading ? "Loading…" : "Login"}
    </Button>
  );
};

export function LogoutButton({ className }: { className?: string }) {
  const auth = useAuth();

  const handleLogout = async () => {
    sessionStorage.removeItem("preloadData");

    await auth.removeUser(); // this is the key
  };

  return (
    <Button className={className} onClick={handleLogout}>
      {auth.isLoading ? "Loading…" : "Logout"}
    </Button>
  );
};

export function AuthTokenSync() {
  const auth = useAuth();
 
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      setAuthToken(auth.user.access_token);
    } else {
      setAuthToken(null);
    }
  }, [auth.isAuthenticated, auth.user?.access_token]);
 
  return null;
}
 