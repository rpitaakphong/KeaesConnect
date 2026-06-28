import { getTestDefinition } from "@/features/tests/content/registry";
import { StudentGate } from "@/features/tests/components/student-gate";

export default async function TestStartPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = getTestDefinition(testId);
  if (!test) return <main className="app-shell"><div className="notice error">This test has not been migrated to the Next.js test engine yet.</div></main>;
  return <StudentGate test={test} />;
}
