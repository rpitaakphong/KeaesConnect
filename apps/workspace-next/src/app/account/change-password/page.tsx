import { PortalPage } from "@/components/app-shell/portal-page";
import { ChangePasswordClient } from "@/features/auth/change-password-client";

export default function ChangePasswordPage() {
  return (
    <PortalPage>
      <ChangePasswordClient />
    </PortalPage>
  );
}
