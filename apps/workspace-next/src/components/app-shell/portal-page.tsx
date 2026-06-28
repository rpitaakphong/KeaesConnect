import { SiteNav } from "@/components/app-shell/site-nav";
import type { ReactNode } from "react";

export function PortalPage({ children, shellClassName = "app-shell" }: Readonly<{ children: ReactNode; shellClassName?: string }>) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteNav />
      <main id="main" className={shellClassName}>{children}</main>
    </>
  );
}
