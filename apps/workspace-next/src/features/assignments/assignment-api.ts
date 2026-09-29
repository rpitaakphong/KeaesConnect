"use client";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { AssignmentBranchValue } from "@/features/assignments/branches";

export type Assignment = {
  assignment_token: string;
  branch?: AssignmentBranchValue;
  test_id: string;
  title: string;
  subject: string;
  level: string;
};

export async function getAssignment(token: string, demoTest?: { id: string; title: string; subject: string; level: string }) {
  if (isDemoAssignment(token)) {
    return {
      assignment_token: token,
      test_id: demoTest?.id || "math-olympiad-2",
      title: demoTest?.title || "Math Olympiad Level 2",
      subject: demoTest?.subject || "Math",
      level: demoTest?.level || "Math Olympiad 2",
    } satisfies Assignment;
  }
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
  const { data, error } = await getSupabaseBrowserClient().rpc("get_assignment", { p_token: token });
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) as Assignment | null;
}

export function isDemoAssignment(token: string) {
  if (typeof window === "undefined" || token !== "demo") return false;

  const hostname = window.location.hostname.toLowerCase();
  return ["127.0.0.1", "localhost"].includes(hostname) || hostname.endsWith(".trycloudflare.com");
}
