import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { Button } from './Button';
import { useLocation } from "@tanstack/react-router";
import { setAuthToken } from "../api/client";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";

export function LoginButton({ className, hideTextOnSmall }: { className?: string, hideTextOnSmall?: boolean }) {
  const auth = useAuth();
  const location = useLocation();

  return (
    <Button className={className} onClick={() => auth.signinRedirect({ state: location.pathname })}>
      {auth.isLoading ? <Loader noPadding size="5" /> : (
        <div className="flex justify-center items-center gap-1">
          <LockClosedIcon className="w-5 h-5 md:mr-2" />
          <span className={hideTextOnSmall ? "hidden md:block" : ""}>Login</span>
        </div>
      )}
    </Button>
  );
};

export function LogoutButton({ className, hideTextOnSmall }: { className?: string, hideTextOnSmall?: boolean }) {
  const auth = useAuth();

  const handleLogout = async () => {
    sessionStorage.removeItem("preloadData");

    await auth.removeUser(); // this is the key
  };

  return (
    <Button className={className} onClick={handleLogout}>
      {auth.isLoading ? <Loader noPadding size="5" /> : (
        <div className="flex justify-center items-center gap-1">
          <LockOpenIcon className="w-5 h-5 md:mr-2" />
          <span className={hideTextOnSmall ? "hidden md:block" : ""}>Logout</span>
        </div>
      )}
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
 