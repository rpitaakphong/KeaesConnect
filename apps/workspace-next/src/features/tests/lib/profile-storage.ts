"use client";

import type { StudentProfile, TestAnswers } from "@/features/tests/lib/types";

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
