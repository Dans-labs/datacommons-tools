import { createFileRoute, Outlet } from "@tanstack/react-router";
import { enforceLogin } from "@/oidc";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: enforceLogin,
  component: () => <Outlet />,
});
