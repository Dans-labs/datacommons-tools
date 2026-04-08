import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { Button } from './Button';
import { useLocation } from "@tanstack/react-router";
import { setAuthToken } from "../api/client";

export function LoginButton() {
  const auth = useAuth();
  const location = useLocation();

  return (
    <Button onClick={() => auth.signinRedirect({ state: location.pathname })}>
      {auth.isLoading ? "Loading…" : "Login"}
    </Button>
  );
};

export function LogoutButton() {
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
    <Button onClick={() => auth.signoutSilent()}>
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
 