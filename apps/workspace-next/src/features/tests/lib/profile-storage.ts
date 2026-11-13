"use client";

import type { StudentProfile, SubmitResult, TestAnswers } from "@/features/tests/lib/types";

const profilePrefix = "keaes-test-profile-v1";
const answerPrefix = "keaes-test-answers-v1";

export function testStorageKey(testId: string, assignmentToken: string) {
  if (assignmentToken === "demo") return `${testId}:demo`;
  return assignmentToken || testId;
}

export function saveStudentProfile(profile: StudentProfile) {
  window.sessionStorage.setItem(`${profilePrefix}:${testStorageKey(profile.testId, profile.assignmentToken)}`, JSON.stringify(profile));
}

export function loadStudentProfile(testId: string, assignmentToken: string) {
  const raw = window.sessionStorage.getItem(`${profilePrefix}:${testStorageKey(testId, assignmentToken)}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function clearSavedAnswers(testId: string, assignmentToken: string) {
  window.sessionStorage.removeItem(`${answerPrefix}:${testStorageKey(testId, assignmentToken)}`);
}

export function saveAnswers(testId: string, assignmentToken: string, answers: TestAnswers) {
  window.sessionStorage.setItem(`${answerPrefix}:${testStorageKey(testId, assignmentToken)}`, JSON.stringify(answers));
}

export function loadAnswers(testId: string, assignmentToken: string) {
  const raw = window.sessionStorage.getItem(`${answerPrefix}:${testStorageKey(testId, assignmentToken)}`);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as TestAnswers;
  } catch {
    return {};
  }
}

type AttemptProgress = {
  startedAt: number;
  result?: SubmitResult;
};

export function loadAttemptProgress(testId: string, assignmentToken: string): AttemptProgress | null {
  const key = `keaes-test-progress-v1:${testStorageKey(testId, assignmentToken)}`;
  try {
    const progress = JSON.parse(window.sessionStorage.getItem(key) || "null") as AttemptProgress | null;
    return progress && Number.isFinite(progress.startedAt) ? progress : null;
  } catch {
    return null;
  }
}

export function saveAttemptProgress(testId: string, assignmentToken: string, progress: AttemptProgress) {
  const key = `keaes-test-progress-v1:${testStorageKey(testId, assignmentToken)}`;
  window.sessionStorage.setItem(key, JSON.stringify(progress));
}
