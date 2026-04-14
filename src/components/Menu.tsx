import { useAuth } from "react-oidc-context"
import { LoginButton, LogoutButton } from "./Auth";
import { Link } from "@tanstack/react-router";
import logoWhite from "../assets/datacommons-logo-white.svg"
import { useHealth } from '../hooks/useTools';

export default function Menu() {
  const auth = useAuth();
  const { data, isLoading, isError } = useHealth();

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
        <div className={`text-sm rounded-lg py-2 px-4 m-4 font-bold bg-linear-to-r ${isError ? 'from-red-500 to-red-600' : isLoading ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'}`}>
          {
            isLoading ? 
            <span>Checking API health…</span> : 
            isError ? 
            <span>API is down.</span> :
            <span>API status: {data?.status} (v{data?.version})</span>
          }
        </div>
      </div>
    </div>
  )
}

function MenuItem({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="font-bold px-4 py-2 rounded-lg hover:bg-black/10 block" activeProps={{ className: "bg-black/10", }} activeOptions={{ exact: true }}>
        {children}
      </Link>
    </li>
  )
}