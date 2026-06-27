import { PortalPage } from "@/components/app-shell/portal-page";
import { StaffManagementClient } from "@/features/staff/staff-management-client";

export default function StaffManagementPage() {
  return (
    <PortalPage shellClassName="admin-shell">
      <StaffManagementClient />
    </PortalPage>
  );
}
