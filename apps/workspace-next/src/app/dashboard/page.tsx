import { DashboardClient } from "@/features/admin/dashboard-client";
import { PortalPage } from "@/components/app-shell/portal-page";

export default function DashboardPage() {
  return (
    <PortalPage>
      <DashboardClient />
    </PortalPage>
  );
}
