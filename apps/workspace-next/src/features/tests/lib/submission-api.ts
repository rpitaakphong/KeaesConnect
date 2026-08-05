"use client";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { isDemoAssignment } from "@/features/assignments/assignment-api";
import { scoreTestLocally } from "@/features/tests/lib/local-scoring";
import type { StudentProfile, SubmitResult, TestAnswers, TestDefinition } from "@/features/tests/lib/types";

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
  const { data, error } = await getSupabaseBrowserClient().functions.invoke("grade-english-literacy", {
    body: {
      testId: test.id,
      assignmentToken,
      answers: payload,
    },
  });
  if (error) throw error;
  const grades = data?.grades || {};
  const missingGrade = rubricEntries.find(([questionId]) => !grades[questionId] || typeof grades[questionId].score !== "number");
  if (missingGrade) throw new Error("AI grading did not return a complete score. Please try submitting again.");
  return grades;
}
