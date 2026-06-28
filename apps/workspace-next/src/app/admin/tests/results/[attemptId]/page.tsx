import { PortalPage } from "@/components/app-shell/portal-page";
import { ResultReportClient } from "@/features/admin/result-report-client";

export default async function ResultReportPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return (
    <PortalPage shellClassName="admin-shell">
      <ResultReportClient attemptId={attemptId} />
    </PortalPage>
  );
}
