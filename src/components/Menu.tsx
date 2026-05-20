import { useAuth } from "react-oidc-context";
import { LoginButton, LogoutButton } from "./Auth";
import { Link } from "@tanstack/react-router";
import logoWhite from "../assets/datacommons-logo-white.svg";
import { HealthCheck } from "./HealthCheck";
import ThemeSwitcher from "./ThemeSwitch";
import {
  DocumentMagnifyingGlassIcon,
  WrenchIcon,
  PlusCircleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import emblemWhite from "../assets/datacommons-emblem-white.svg"
import { cloneElement, useState, type ReactElement } from "react";
import Tooltip from "./Tooltip";
import { Separator } from '@base-ui/react/separator';

export default function Menu() {
  const auth = useAuth();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-indigo-950 text-white ${expanded ? "w-68" : "w-12"} md:w-70 fixed top-0 left-0 bottom-0 h-screen z-60 transition-all`}>
      <div className="flex flex-col gap-4 h-full justify-between">
        <div className="flex flex-col">

          <header className={`w-full ${expanded ? "px-4" : "px-2"} py-4 md:px-6`}>
            <Link to="/">
              <img src={logoWhite} className={`${!expanded ? "hidden" : " w-full"} md:block`} alt="Logo" />
              <img src={emblemWhite} className={`${expanded ? "hidden" : ""} md:hidden w-full max-h-10`} alt="Logo" />
            </Link>
          </header>

          <NavigationMenu.Root orientation="vertical">
            <NavigationMenu.List className={`flex flex-col gap-1 ${expanded ? "p-2" : "p-1"} sm:p-4 mb-2`}>
              <MenuItem to="/" text="Explore tools" icon={<DocumentMagnifyingGlassIcon />} expanded={expanded} />
            </NavigationMenu.List>
            <Separator className="border-t border-white/20 mb-2" />
            {auth.isAuthenticated && (
              <NavigationMenu.List className={`flex flex-col gap-1 ${expanded ? "p-2" : "p-1"} sm:p-4 mb-4`}>
                <MenuItem to="/tools/my-tools" text="My tools" icon={<WrenchIcon />} expanded={expanded}/>
                <MenuItem to="/tools/new" text="Create tool" icon={<PlusCircleIcon />} expanded={expanded} />
              </NavigationMenu.List>
            )}
            </NavigationMenu.Root>
            <div className={`${expanded ? "px-2" : "px-1"} sm:px-4`}>
              {auth.isAuthenticated ? (
                <LogoutButton className="w-full"  hideTextOnSmall={!expanded} />
              ) : (
                <LoginButton className="w-full"  hideTextOnSmall={!expanded} />
              )}
            </div>
        </div>

        <footer className={`${expanded ? "p-2" : "p-1"} sm:p-4 flex flex-col gap-2 sm:gap-2`}>
          <ThemeSwitcher expanded={expanded} />
          <HealthCheck expanded={expanded} />
          <div className="md:hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <Tooltip text="Expand" pos="right" className="md:hidden" fullWidth>
              <div className="p-2 w-full font-bold flex items-center">
                <ChevronRightIcon className={`w-6 h-6 ${expanded ? "mr-2 rotate-180" : ""}`} />
                <span className={`${!expanded ? "hidden" : ""} md:block`}>Collapse</span>
              </div>
            </Tooltip>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MenuItem({ to, icon, text, expanded }: { to: string, icon: ReactElement<{ className?: string }>, text: string, expanded: boolean }) {
  const styledIcon = icon
    ? cloneElement(icon, { className: `w-6 h-6 ${expanded ? "mr-2" : ""} md:mr-2` })
    : null;
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link
        render={
          <Link 
            to={to} 
            className={`font-bold ${expanded ? "px-4" : "px-2"} md:px-4 py-2 rounded-lg hover:bg-black/10 flex items-center w-full`}
            activeProps={{ className: "bg-black/30", }} 
            activeOptions={{ exact: true, includeSearch: false }} 
          />
        }
        className="font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-black/10 flex items-center"
      >
        {styledIcon}
        <span className={`${!expanded ? "hidden" : ""} md:block line-clamp-1 `}>{text}</span>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  );

}