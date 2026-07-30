"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminAnswer, AdminPartScore, AdminResult, CatalogTest, TestAssignment } from "@/features/admin/types";
import type { AssignmentBranch } from "@/features/assignments/branches";

const nextRuntimeTests = new Set([
  "cie-igcse-combined-science-paper-1-core",
  "cie-igcse-combined-science-paper-2-extended",
  "cie-igcse-combined-science-paper-3-core",
  "cie-igcse-combined-science-paper-4-extended",
  "cie-igcse-combined-science-paper-6-alternative-to-practical",
  "english-literacy-1",
  "english-literacy-2",
  "english-literacy-3",
  "english-literacy-4",
  "english-literacy-5",
  "math-olympiad-1",
  "math-olympiad-2",
  "math-olympiad-3",
  "math-olympiad-4",
  "math-olympiad-5",
  "math-olympiad-6",
  "spip-year-7-english-pre",
  "spip-year-7-math-pre",
  "spip-year-7-science-pre",
  "starter-progress-listening",
  "starter-progress-reading-writing",
  "summer-english-level-1-pretest",
  "summer-english-level-2-pretest",
  "summer-english-level-3-pretest",
  "summer-math-level-1-pretest",
  "summer-math-level-2-pretest",
  "summer-math-level-3-pretest",
]);

const builtinTests: CatalogTest[] = [
  { id: "cie-igcse-combined-science-paper-1-core", title: "CIE IGCSE Combined Science Paper 1 Core", subject: "Combined Science", level: "Core", status: "active", appPath: "/tests/cie-igcse-combined-science-paper-1-core/start", runtime: "next-shared-engine" },
  { id: "cie-igcse-combined-science-paper-2-extended", title: "CIE IGCSE Combined Science Paper 2 Extended", subject: "Combined Science", level: "Extended", status: "active", appPath: "/tests/cie-igcse-combined-science-paper-2-extended/start", runtime: "next-shared-engine" },
  { id: "cie-igcse-combined-science-paper-3-core", title: "CIE IGCSE Combined Science Paper 3 Core", subject: "Combined Science", level: "Core", status: "active", appPath: "/tests/cie-igcse-combined-science-paper-3-core/start", runtime: "next-shared-engine" },
  { id: "cie-igcse-combined-science-paper-4-extended", title: "CIE IGCSE Combined Science Paper 4 Extended", subject: "Combined Science", level: "Extended", status: "active", appPath: "/tests/cie-igcse-combined-science-paper-4-extended/start", runtime: "next-shared-engine" },
  { id: "cie-igcse-combined-science-paper-6-alternative-to-practical", title: "CIE IGCSE Combined Science Paper 6 Alternative to Practical", subject: "Combined Science", level: "Alternative to Practical", status: "active", appPath: "/tests/cie-igcse-combined-science-paper-6-alternative-to-practical/start", runtime: "next-shared-engine" },
  { id: "english-literacy-1", title: "English Literacy Level 1", subject: "English", level: "English Literacy 1", status: "active", appPath: "/tests/english-literacy-1/start", runtime: "next-shared-engine" },
  { id: "english-literacy-2", title: "English Literacy Level 2", subject: "English", level: "English Literacy 2", status: "active", appPath: "/tests/english-literacy-2/start", runtime: "next-shared-engine" },
  { id: "english-literacy-3", title: "English Literacy Level 3", subject: "English", level: "English Literacy 3", status: "active", appPath: "/tests/english-literacy-3/start", runtime: "next-shared-engine" },
  { id: "english-literacy-4", title: "English Literacy Level 4", subject: "English", level: "English Literacy 4", status: "active", appPath: "/tests/english-literacy-4/start", runtime: "next-shared-engine" },
  { id: "english-literacy-5", title: "English Literacy Level 5", subject: "English", level: "English Literacy 5", status: "active", appPath: "/tests/english-literacy-5/start", runtime: "next-shared-engine" },
  { id: "math-olympiad-1", title: "Math Olympiad Level 1", subject: "Math", level: "Math Olympiad 1", status: "active", appPath: "/tests/math-olympiad-1/start", runtime: "next-shared-engine" },
  { id: "math-olympiad-2", title: "Math Olympiad Level 2", subject: "Math", level: "Math Olympiad 2", status: "active", appPath: "/tests/math-olympiad-2/start", runtime: "next-shared-engine" },
  { id: "math-olympiad-3", title: "Math Olympiad Level 3", subject: "Math", level: "Math Olympiad 3", status: "active", appPath: "/tests/math-olympiad-3/start", runtime: "next-shared-engine" },
  { id: "math-olympiad-4", title: "Math Olympiad Level 4", subject: "Math", level: "Math Olympiad 4", status: "active", appPath: "/tests/math-olympiad-4/start", runtime: "next-shared-engine" },
  { id: "math-olympiad-5", title: "Math Olympiad Level 5", subject: "Math", level: "Math Olympiad 5", status: "active", appPath: "/tests/math-olympiad-5/start", runtime: "next-shared-engine" },
  { id: "math-olympiad-6", title: "Math Olympiad Level 6", subject: "Math", level: "Math Olympiad 6", status: "active", appPath: "/tests/math-olympiad-6/start", runtime: "next-shared-engine" },
  { id: "spip-year-7-english-pre", title: "SPIP Year 7 English Pre-test", subject: "English", level: "SPIP Year 7", status: "active", appPath: "/tests/spip-year-7-english-pre/start", runtime: "next-shared-engine" },
  { id: "spip-year-7-math-pre", title: "SPIP Year 7 Math Pre-test", subject: "Math", level: "SPIP Year 7", status: "active", appPath: "/tests/spip-year-7-math-pre/start", runtime: "next-shared-engine" },
  { id: "spip-year-7-science-pre", title: "SPIP Year 7 Science Pre-test", subject: "Science", level: "SPIP Year 7", status: "active", appPath: "/tests/spip-year-7-science-pre/start", runtime: "next-shared-engine" },
  { id: "starter-progress-listening", title: "Starter Progress Listening", subject: "English", level: "Cambridge Starters", status: "active", appPath: "/tests/starter-progress-listening/start", runtime: "next-shared-engine" },
  { id: "starter-progress-reading-writing", title: "Starter Progress Reading & Writing", subject: "English", level: "Cambridge Starters", status: "active", appPath: "/tests/starter-progress-reading-writing/start", runtime: "next-shared-engine" },
  { id: "summer-english-level-1-pretest", title: "Summer English Level 1 Pre-test", subject: "English", level: "Summer English Level 1", status: "active", appPath: "/tests/summer-english-level-1-pretest/start", runtime: "next-shared-engine" },
  { id: "summer-english-level-2-pretest", title: "Summer English Level 2 Pre-test", subject: "English", level: "Summer English Level 2", status: "active", appPath: "/tests/summer-english-level-2-pretest/start", runtime: "next-shared-engine" },
  { id: "summer-english-level-3-pretest", title: "Summer English Level 3 Pre-test", subject: "English", level: "Summer English Level 3", status: "active", appPath: "/tests/summer-english-level-3-pretest/start", runtime: "next-shared-engine" },
  { id: "summer-math-level-1-pretest", title: "Summer Math Level 1 Pre-test", subject: "Math", level: "Summer Math Level 1", status: "active", appPath: "/tests/summer-math-level-1-pretest/start", runtime: "next-shared-engine" },
  { id: "summer-math-level-2-pretest", title: "Summer Math Level 2 Pre-test", subject: "Math", level: "Summer Math Level 2", status: "active", appPath: "/tests/summer-math-level-2-pretest/start", runtime: "next-shared-engine" },
  { id: "summer-math-level-3-pretest", title: "Summer Math Level 3 Pre-test", subject: "Math", level: "Summer Math Level 3", status: "active", appPath: "/tests/summer-math-level-3-pretest/start", runtime: "next-shared-engine" },
];

export async function listTests(): Promise<CatalogTest[]> {
  const supabase = getSupabaseBrowserClient();
  const withAppPath = await supabase
    .from("tests")
    .select("id,title,subject,level,status,total_points,app_path")
    .order("title", { ascending: true });

  if (withAppPath.error) return builtinTests;

  const databaseTests = (withAppPath.data || [])
    .map((test) => normalizeCatalogTest(test))
    .filter((test) => nextRuntimeTests.has(test.id));
  return mergeTests(databaseTests);
}

export async function createAssignment(testId: string, branch: AssignmentBranch): Promise<TestAssignment> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("create_test_assignment", {
    p_branch: branch,
    p_test_id: testId,
  });
  if (error) throwSupabaseError(error, "Could not generate assignment link.");
  return Array.isArray(data) ? data[0] : data;
}

export async function listResults(): Promise<AdminResult[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("list_admin_results");
  if (error) throwSupabaseError(error, "Could not load results.");
  return Array.isArray(data) ? data.map(normalizeResult) : [];
}

export async function getResult(attemptId: string): Promise<AdminResult> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("get_admin_result", { p_attempt_id: attemptId });
  if (error) throwSupabaseError(error, "Could not load result.");
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("Result not found or not authorized.");
  return normalizeResult(row);
}

export function buildAssignmentUrl(test: CatalogTest, assignmentToken: string) {
  const appPath = `/tests/${test.id}/start`;
  const url = new URL(appPath, window.location.origin);
  url.searchParams.set("testId", test.id);
  url.searchParams.set("assignment", assignmentToken);
  return url.href;
}

function normalizeCatalogTest(test: Record<string, unknown>): CatalogTest {
  const id = String(test.id || "");
  const subject = id.startsWith("cie-igcse-combined-science") ? "Combined Science" : String(test.subject || "");
  return {
    id,
    title: String(test.title || id),
    subject,
    level: String(test.level || ""),
    status: String(test.status || "active"),
    totalPoints: Number(test.total_points || 0),
    appPath: `/tests/${id}/start`,
    runtime: "next-shared-engine",
  };
}

function mergeTests(databaseTests: CatalogTest[]) {
  const byId = new Map(builtinTests.map((test) => [test.id, test]));
  for (const test of databaseTests) {
    byId.set(test.id, {
      ...byId.get(test.id),
      ...test,
      runtime: "next-shared-engine",
    });
  }
  return Array.from(byId.values()).sort((a, b) => a.title.localeCompare(b.title));
}

function throwSupabaseError(error: { message?: string; details?: string; hint?: string }, fallback: string): never {
  const detail = [error.message, error.details, error.hint].filter(Boolean).join(" ");
  throw new Error(detail || fallback);
}

function normalizeResult(row: Record<string, unknown>): AdminResult {
  return {
    branch: normalizeBranch(row.branch),
    createdBy: {
      email: String(row.created_by_email || ""),
      id: String(row.created_by || ""),
      name: String(row.created_by_name || ""),
    },
    id: String(row.attempt_id || ""),
    testId: String(row.test_id || ""),
    testTitle: String(row.test_title || ""),
    student: {
      fullName: String(row.full_name || ""),
      nickname: String(row.nickname || ""),
      dateOfBirth: String(row.date_of_birth || ""),
      subject: String(row.subject || ""),
      level: String(row.level || ""),
      testDate: String(row.test_date || ""),
    },
    score: {
      total: Number(row.score_total || 0),
      possible: Number(row.score_possible || 0),
      percent: Number(row.score_percent || 0),
    },
    partScores: normalizePartScores(row.part_scores),
    answers: normalizeAnswers(row.answers),
    submittedAt: String(row.submitted_at || ""),
  };
}

function normalizeBranch(value: unknown): AdminResult["branch"] {
  return value === "ram" || value === "ekamai" ? value : "";
}

function normalizePartScores(value: unknown): AdminPartScore[] {
  return Array.isArray(value)
    ? value.map((part) => ({
      part: String(part?.part || ""),
      total: Number(part?.total || 0),
      possible: Number(part?.possible || 0),
    }))
    : [];
}

function normalizeAnswers(value: unknown): AdminAnswer[] {
  return Array.isArray(value)
    ? value.map((answer) => ({
      part: String(answer?.part || ""),
      prompt: String(answer?.prompt || ""),
      response: String(answer?.response || ""),
      correctAnswer: String(answer?.correctAnswer || ""),
      correct: Boolean(answer?.correct),
      score: Number(answer?.score || 0),
      possible: Number(answer?.possible || 0),
      gradingDetails: typeof answer?.gradingDetails === "object" && answer?.gradingDetails ? answer.gradingDetails as Record<string, unknown> : null,
      transcript: answer?.transcript ? String(answer.transcript) : null,
    }))
    : [];
}
