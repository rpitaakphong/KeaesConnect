import { getTestDefinition } from "@/features/tests/content/registry";
import { TestRunner } from "@/features/tests/components/test-runner";

export default async function TestTakePage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = getTestDefinition(testId);
  if (!test) return <main className="app-shell"><div className="notice error">This test has not been migrated to the Next.js test engine yet.</div></main>;
  return <TestRunner test={test} />;
}
