import { PortalPage } from "@/components/app-shell/portal-page";
import { HoursCrossCheckClient } from "@/features/hours-cross-check/hours-cross-check-client";

export default function HoursCrossCheckPage() {
  return (
    <PortalPage shellClassName="admin-shell">
      <HoursCrossCheckClient />
    </PortalPage>
  );
}
