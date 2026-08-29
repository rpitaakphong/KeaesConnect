"use client";

import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { isDemoAssignment } from "@/features/assignments/assignment-api";
import { scoreTestLocally } from "@/features/tests/lib/local-scoring";
import type { StudentProfile, SubmitResult, TestAnswers, TestDefinition } from "@/features/tests/lib/types";

type EnglishGraderResponse = {
  grades?: Record<string, { score?: number }>;
};

export async function submitAttempt(profile: StudentProfile, answers: TestAnswers, test?: TestDefinition): Promise<SubmitResult> {
  if (isDemoAssignment(profile.assignmentToken)) {
    if (test) return scoreTestLocally(test, answers);
    return { attemptId: "demo", total: 0, possible: 0, sections: {} };
  }
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured. Ask staff to configure the database before accepting test submissions.");
  const shapedAnswers = shapeAnswersForDatabase(answers, test);
  const finalAnswers = test?.aiShortAnswerRubrics
    ? { ...shapedAnswers, aiGrades: await gradeShortAnswers(profile.assignmentToken, answers, test) }
    : shapedAnswers;
  const { data, error } = await getSupabaseBrowserClient().rpc("submit_attempt", {
    p_assignment_token: profile.assignmentToken,
    p_student: profile,
    p_answers: finalAnswers,
  });
  if (error) {
    const message = String(error.message || "");
    if (/already been used|invalid or inactive assignment/i.test(message)) {
      throw new Error("This test link has already been used. Ask staff for a new link.");
    }
    throw error;
  }
  return {
    attemptId: data?.attemptId,
    total: Number(data?.total ?? data?.scoreTotal ?? 0),
    possible: Number(data?.possible ?? data?.scorePossible ?? 0),
    sections: data?.sections || {},
  };
}

function shapeAnswersForDatabase(answers: TestAnswers, test?: TestDefinition): TestAnswers {
  if (test?.answerPayload !== "rwAnswers") return answers;
  const writingChoices = new Map(test.sections.flatMap((section) => section.questions)
    .filter((question) => question.type === "writingChoice")
    .map((question) => [question.id, question]));
  const databaseAnswers = Object.fromEntries(Object.entries(answers).map(([questionId, value]) => {
    const question = writingChoices.get(questionId);
    if (!question || !value || typeof value !== "object") return [questionId, value];
    const option = question.options.find((item) => item.value === value.promptId);
    const prefix = option ? `${option.label}: ${option.title}\n` : "";
    return [questionId, `${prefix}${typeof value.answer === "string" ? value.answer : ""}`.trim()];
  })) as TestAnswers;
  const rwAnswers = Object.fromEntries(
    Object.entries(databaseAnswers).filter(([, value]) => typeof value === "string"),
  ) as Record<string, string>;
  return {
    ...databaseAnswers,
    rwAnswers,
  };
}

async function gradeShortAnswers(assignmentToken: string, answers: TestAnswers, test: TestDefinition) {
  const rubricEntries = Object.entries(test.aiShortAnswerRubrics || {});
  const payload = rubricEntries.map(([questionId, rubric]) => {
    const question = test.sections.flatMap((section) => section.questions).find((item) => item.id === questionId);
    const rawAnswer = answers[questionId];
    const writingAnswer = rawAnswer && typeof rawAnswer === "object" ? rawAnswer : null;
    const selectedPrompt = question?.type === "writingChoice"
      ? question.options.find((option) => option.value === writingAnswer?.promptId)
      : null;
    return {
      questionId,
      prompt: selectedPrompt
        ? `${question?.prompt || questionId}\nSelected task: ${selectedPrompt.label}: ${selectedPrompt.title}\n${selectedPrompt.prompt.join("\n")}`
        : question?.prompt || questionId,
      answer: typeof rawAnswer === "string" ? rawAnswer : String(writingAnswer?.answer || ""),
      rubric,
    };
  });
  const functionBody = {
    testId: test.id,
    assignmentToken,
    answers: payload,
  };
  let data: EnglishGraderResponse | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await getSupabaseBrowserClient().functions.invoke<EnglishGraderResponse>("grade-english-literacy", {
      body: functionBody,
      timeout: 60000,
    });
    if (!result.error) {
      data = result.data;
      break;
    }
    if (attempt === 0 && isRetryableEnglishGraderError(result.error)) {
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      continue;
    }
    throw await englishGraderError(result.error);
  }
  const grades = data?.grades || {};
  const missingGrade = rubricEntries.find(([questionId]) => !grades[questionId] || typeof grades[questionId].score !== "number");
  if (missingGrade) throw new Error("AI grading did not return a complete score. Please try submitting again.");
  return grades;
}

function isRetryableEnglishGraderError(error: unknown) {
  if (error instanceof FunctionsFetchError || error instanceof FunctionsRelayError) return true;
  if (!(error instanceof FunctionsHttpError)) return false;
  const response = error.context instanceof Response ? error.context : null;
  return response ? response.status === 429 || response.status >= 500 : false;
}

async function englishGraderError(error: unknown) {
  if (error instanceof FunctionsHttpError) {
    const response = error.context instanceof Response ? error.context : null;
    const status = response?.status || 0;
    let detail = "";
    if (response) {
      try {
        const body = await response.clone().json() as { error?: unknown };
        detail = typeof body.error === "string" ? body.error : "";
      } catch {
        detail = "";
      }
    }

    if (/unsupported test|expected \d+ short answers|unsupported question/i.test(detail)) {
      return new Error("This test's writing grader is not configured correctly. Ask staff to update the grading service.");
    }
    if (status === 401 || status === 403) {
      return new Error("Your test session could not access the writing grader. Reload the assignment link and try again.");
    }
    if (status === 429) {
      return new Error("The writing grader is busy. Wait a moment, then submit the test again.");
    }
    if (status >= 500) {
      return new Error("The writing grader is temporarily unavailable. Your answers are still on this page; please submit again shortly.");
    }
  }

  if (error instanceof FunctionsFetchError || error instanceof FunctionsRelayError) {
    return new Error("The writing grader could not be reached. Check the connection, then submit the test again.");
  }

  return new Error("The writing answers could not be graded. Please submit the test again.");
}
