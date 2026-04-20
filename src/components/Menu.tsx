import { useAuth } from "react-oidc-context"
import { LoginButton, LogoutButton } from "./Auth";
import { Link } from "@tanstack/react-router";
import logoWhite from "../assets/datacommons-logo-white.svg"
import { HealthCheck } from "./HealthCheck";
import ThemeSwitcher from "./ThemeSwitch";

export default function Menu() {
  const auth = useAuth();

  return (
    <div className="bg-indigo-950 text-white w-70 fixed top-0 left-0 bottom-0">
      <div className="flex flex-col gap-4 h-full justify-between">
        <div className="flex flex-col"> 
          <div className="w-full py-4 px-8">
            <Link to="/">
              <img src={logoWhite} className="" alt="Logo" />
            </Link>
          </div>
          <ul className="flex-col gap-1 p-4 m-0">
            <MenuItem to="/">Explore tools</MenuItem>
          </ul>
          <div className="border-t border-white/20 p-4">
            {auth.isAuthenticated && 
              <ul className="flex flex-col gap-1 mb-4">
                <MenuItem to="/tools/my-tools">My tools</MenuItem>
                <MenuItem to="/tools/new">Create tool</MenuItem>
              </ul>
            }
            {auth.isAuthenticated ? <LogoutButton className="w-full" /> : <LoginButton className="w-full" />}
          </div>
        </div>
        <div className="m-4 flex flex-col gap-2">
          <ThemeSwitcher /> 
          <HealthCheck />
        </div>
      </div>
    </div>
  )
}

function MenuItem({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="font-bold px-4 py-2 rounded-lg hover:bg-black/10 block" activeProps={{ className: "bg-black/20", }} activeOptions={{ exact: true }}>
        {children}
      </Link>
    </li>
  )
}