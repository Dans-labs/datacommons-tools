import { useAuth } from "react-oidc-context"
import { LoginButton, LogoutButton } from "./Auth";
import { Link } from "@tanstack/react-router";
import logoBlack from "../assets/datacommons-logo.svg"
import logoWhite from "../assets/datacommons-logo-white.svg"

export default function Menu() {
  const auth = useAuth();

  return (
    <div className="bg-linear-to-b from-indigo-500/30 dark:from-indigo-900/50 to-transparent">
      <div className="flex items-center gap-4 p-2 w-full max-w-7xl mx-auto">
        <div className="w-60">
          <Link to="/">
            <>
              <img src={logoBlack} className="block dark:hidden" alt="Logo" />
              <img src={logoWhite} className="hidden dark:block" alt="Logo" />
            </>
          </Link>
        </div>
        <ul className="flex gap-8 grow justify-center">
          <MenuItem to="/tools">Explore tools</MenuItem>
          {auth.isAuthenticated && <MenuItem to="/tools/my-tools">My tools</MenuItem>}
          {auth.isAuthenticated && <MenuItem to="/tools/new">Create tool</MenuItem>}
        </ul>
        <div className="w-60 text-right">
          {auth.isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
    </div>
  )
}

function MenuItem({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="font-bold hover:underline" activeProps={{ className: "underline", }}>
        {children}
      </Link>
    </li>
  )
}