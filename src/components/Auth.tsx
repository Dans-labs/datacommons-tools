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

  useEffect(() => {
    // clear session storage preload data after logging in
    // do this in the logout button, as this will render when a user has logged in
    // also when not using the signin-callback url
    const sessionData = sessionStorage.getItem("preloadData");
    if (sessionData && auth.user?.session_state) {
      sessionStorage.removeItem("preloadData");
    }
  }, [auth.user]);

  return (
    <Button className={className} onClick={() => auth.signoutSilent()}>
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
 