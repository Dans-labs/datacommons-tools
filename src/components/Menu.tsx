import { useAuth } from "react-oidc-context"
import { LoginButton, LogoutButton } from "./Auth";
import { Link } from "@tanstack/react-router";
import logoWhite from "../assets/datacommons-logo-white.svg"
import { HealthCheck } from "./HealthCheck";
import ThemeSwitcher from "./ThemeSwitch";
import { DocumentMagnifyingGlassIcon, WrenchIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Menu() {
  const auth = useAuth();

  return (
    <div className="bg-indigo-950 text-white w-12 sm:w-70 fixed top-0 left-0 bottom-0 h-screen">
      <div className="flex flex-col gap-4 h-full justify-between">
        <div className="flex flex-col"> 
          <div className="w-full py-4 px-8">
            <Link to="/">
              <img src={logoWhite} className="" alt="Logo" />
            </Link>
          </div>
          <ul className="flex-col gap-1 p-1 sm:p-4 mb-2 sm:m-0">
            <MenuItem to="/">
              <DocumentMagnifyingGlassIcon className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:block">Explore tools</span>
            </MenuItem>
          </ul>
          <div className="border-t border-white/20 p-1 pt-3 sm:p-4">
            {auth.isAuthenticated && 
              <ul className="flex flex-col gap-1 mb-4">
                <MenuItem to="/tools/my-tools">
                  <WrenchIcon className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:block">My tools</span>
                </MenuItem>
                <MenuItem to="/tools/new">
                  <PlusCircleIcon className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:block">Create tool</span>
                </MenuItem>
              </ul>
            }
            {auth.isAuthenticated ? 
            <LogoutButton className="w-full" hideTextOnSmall /> : 
            <LoginButton className="w-full" hideTextOnSmall />
            }
          </div>
        </div>
        <div className="m-1 sm:m-4 flex flex-col gap-1 sm:gap-2">
          <ThemeSwitcher /> 
          <HealthCheck />
        </div>
      </div>
    </div>
  )
}

function MenuItem({ to, icon, children }: { to: string, icon?: React.ReactNode, children: React.ReactNode }) {
  return (
    <li>
      <Link 
        to={to} 
        className="font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-black/10 block flex items-center" 
        activeProps={{ className: "bg-black/20", }} 
        activeOptions={{ exact: true }}
      >
        {icon}
        {children}
      </Link>
    </li>
  )
}