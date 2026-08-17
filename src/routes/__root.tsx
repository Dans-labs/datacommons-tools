// src/routes/__root.tsx
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  type RouteContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "@/styles.css?url";
import Menu from "@/components/Menu";
import AutoLogoutWarning from "@/components/AutoLogoutWarning";
import { getLocale } from "@/paraglide/runtime.js";
import { ThemeProvider } from "@/components/ThemeProvider";
import ToastProvider from "@/components/Toast";
import NotFound from "#/components/NotFound";
import { getApiServerConfig } from "#/api/api-config";
import { setApiBaseUrl } from "#/api/client";

export const Route = createRootRouteWithContext<RouteContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "EOSC DataCommons Tools Registry",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        children: `
        (function() {
          var theme = localStorage.getItem('theme') || 'system';
          var isDark = theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        })();
      `,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: NotFound,
  beforeLoad: async () => {
    const apiConfig = await getApiServerConfig();
    setApiBaseUrl(apiConfig.baseUrl);
    return { apiConfig };
  }
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex flex-row min-h-screen">
            <Menu />
            <main className="grow pl-12 md:pl-70 max-w-full">{children}</main>
          </div>
          <AutoLogoutWarning />
          <ToastProvider />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
