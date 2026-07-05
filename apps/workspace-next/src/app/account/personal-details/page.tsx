import { PortalPage } from "@/components/app-shell/portal-page";
import { PersonalDetailsClient } from "@/features/auth/personal-details-client";

export default function PersonalDetailsPage() {
  return (
    <PortalPage>
      <PersonalDetailsClient />
    </PortalPage>
  );
}
