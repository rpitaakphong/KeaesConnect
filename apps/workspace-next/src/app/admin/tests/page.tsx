import { PortalPage } from "@/components/app-shell/portal-page";
import { TestAdminClient } from "@/features/admin/test-admin-client";

export default function TestAdminPage() {
  return (
    <PortalPage shellClassName="admin-shell">
      <TestAdminClient />
    </PortalPage>
  );
}
