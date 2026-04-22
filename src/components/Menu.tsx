import { useAuth } from "react-oidc-context"
import { LoginButton, LogoutButton } from "./Auth";
import { Link } from "@tanstack/react-router";
import logoWhite from "../assets/datacommons-logo-white.svg"
import emblemWhite from "../assets/datacommons-emblem-white.svg"
import { HealthCheck } from "./HealthCheck";
import ThemeSwitcher from "./ThemeSwitch";
import { DocumentMagnifyingGlassIcon, WrenchIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Tooltip from "./Tooltip";
import { cloneElement, type ReactElement } from "react";

export default function Menu() {
  const auth = useAuth();

  return (
    <div className="bg-indigo-950 text-white w-12 md:w-70 fixed top-0 left-0 bottom-0 h-screen z-60">
      <div className="flex flex-col gap-4 h-full justify-between">
        <div className="flex flex-col"> 
          <div className="w-full px-2 py-4 md:px-8">
            <Link to="/">
              <img src={logoWhite} className="hidden md:block" alt="Logo" />
              <img src={emblemWhite} className="md:hidden" alt="Logo" />
            </Link>
          </div>
          <ul className="flex-col gap-1 p-1 md:p-4 mb-2 md:m-0">
            <MenuItem to="/" text="Explore tools" icon={<DocumentMagnifyingGlassIcon />} />
          </ul>
          <div className="border-t border-white/20 p-1 pt-3 md:p-4">
            {auth.isAuthenticated && 
              <ul className="flex flex-col gap-1 mb-4">
                <MenuItem to="/tools/my-tools" text="My tools" icon={<WrenchIcon />} />
                <MenuItem to="/tools/new" text="Create tool" icon={<PlusCircleIcon />} />
              </ul>
            }
            <Tooltip text={auth.isAuthenticated ? "Logout" : "Login"} pos="right" className="md:hidden" fullWidth>
              {auth.isAuthenticated ? 
              <LogoutButton className="w-full" hideTextOnSmall /> : 
              <LoginButton className="w-full" hideTextOnSmall />
              }
            </Tooltip>
          </div>
        </div>
        <div className="m-1 md:m-4 flex flex-col gap-1 md:gap-2">
          <ThemeSwitcher /> 
          <HealthCheck />
        </div>
      </div>
    </div>
  )
}

function MenuItem({ to, icon, text }: { to: string, icon: ReactElement<{ className?: string }>, text: string }) {
  const styledIcon = icon
    ? cloneElement(icon, { className: "w-6 h-6 md:mr-2" })
    : null;
  return (
    <li className="w-full">
      <Tooltip text={text} pos="right" className="md:hidden" fullWidth>
        <Link 
          to={to} 
          className="font-bold px-2 md:px-4 py-2 rounded-lg hover:bg-black/10 flex items-center w-full" 
          activeProps={{ className: "bg-black/30", }} 
          activeOptions={{ exact: true, includeSearch: false }}
        >
          {styledIcon}
          <span className="hidden md:block">{text}</span>
        </Link>
      </Tooltip>
    </li>
  )
}