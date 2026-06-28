import type { SubmitResult, TestAnswers, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

export function scoreTestLocally(test: TestDefinition, answers: TestAnswers): SubmitResult {
  const sections = Object.fromEntries(test.sections.map((section) => {
    const rows = section.questions.map((question) => {
      const scored = scoreQuestion(question, answers[question.id]);
      return {
        part: section.label,
        prompt: question.prompt,
        response: formatResponse(answers[question.id]),
        correctAnswer: question.grading?.display || "",
        correct: scored.score >= scored.possible,
        score: scored.score,
        possible: scored.possible,
        gradingDetails: scored.details,
      };
    });
    return [section.id, rows];
  }));
  const possible = test.sections.reduce((sum, section) => sum + section.questions.reduce((partSum, question) => partSum + question.points, 0), 0);
  const total = Object.values(sections)
    .flat()
    .reduce((sum, row) => sum + Number(row.score || 0), 0);
  return {
    attemptId: "demo",
    total,
    possible,
    sections,
  };
}

function scoreQuestion(question: TestQuestion, answer: unknown) {
  if (!question.grading) return { score: 0, possible: question.points, details: { parts: [] } };
  if (question.grading.mode === "aiSplit") {
    const raw = typeof answer === "string" ? answer : "";
    const contentCorrect = question.grading.contentTerms.some((term) => normalize(raw).includes(normalize(term)));
    const writingCorrect = normalize(raw).split(/\s+/).filter(Boolean).length >= 2;
    const contentScore = contentCorrect ? 0.5 : 0;
    const writingScore = writingCorrect ? 0.5 : 0;
    return {
      score: contentScore + writingScore,
      possible: question.points,
      details: {
        contentCorrect,
        writingCorrect,
        contentScore,
        writingScore,
        score: contentScore + writingScore,
        feedback: "Local preview split score.",
      },
    };
  }
  const answerMap = question.type === "singleChoice"
    ? question.responseShape === "object" && typeof answer === "object" && answer
      ? answer as Record<string, string | string[]>
      : { answer: typeof answer === "string" ? answer : "" }
    : question.type === "text"
      ? { answer: typeof answer === "string" ? answer : "" }
      : typeof answer === "object" && answer ? answer as Record<string, string | string[]> : {};
  const parts = question.grading.parts.map((part) => {
    const raw = answerMap[part.id] || "";
    const correct = isCorrectPart(raw, part);
    return {
      id: part.id,
      response: raw,
      score: correct ? part.points : 0,
      possible: part.points,
      correct,
    };
  });
  const thresholdScore = question.grading.scoreThresholds?.length
    ? scoreByThreshold(parts.filter((part) => part.correct).length, question.grading.scoreThresholds)
    : null;
  return {
    score: thresholdScore ?? parts.reduce((sum, part) => sum + part.score, 0),
    possible: parts.reduce((sum, part) => sum + part.possible, 0),
    details: { parts },
  };
}

function isCorrectPart(raw: string | string[], part: NonNullable<Extract<TestQuestion["grading"], { mode: "auto" }>["parts"]>[number]) {
  if (part.normalizer === "set") return sameSet(Array.isArray(raw) ? raw : [], part.accepted);
  if (part.normalizer === "keywords") return matchesKeywords(String(raw), part.keywords || []);
  if (part.normalizer === "arrowDown") return normalize(String(raw)) === "down";
  return part.accepted.some((accepted) => normalize(String(raw), part.normalizer) === normalize(accepted, part.normalizer));
}

function scoreByThreshold(correctCount: number, thresholds: Array<{ minCorrect: number; points: number }>) {
  return thresholds.reduce((best, threshold) => correctCount >= threshold.minCorrect ? Math.max(best, threshold.points) : best, 0);
}

function matchesKeywords(value: string, keywordGroups: string[][]) {
  const raw = normalize(value);
  return Boolean(raw) && keywordGroups.some((group) => group.every((word) => raw.includes(normalize(word))));
}

function normalize(value: string, mode: "text" | "time" | "set" | "keywords" | "arrowDown" = "text") {
  const clean = String(value || "")
    .toLowerCase()
    .replace(/[,$]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (mode === "time") {
    return clean
      .replace(/\./g, ":")
      .replace(/\s+/g, "")
      .replace(":00pm", "pm")
      .replace(":00p.m.", "pm");
  }
  return clean.replace(/[^\w./: ]/g, "");
}

function sameSet(response: string[], accepted: string[]) {
  const left = response.map((item) => normalize(item)).sort().join(",");
  const right = accepted.map((item) => normalize(item)).sort().join(",");
  return Boolean(left) && left === right;
}

function formatResponse(answer: unknown) {
  if (typeof answer === "string") return answer;
  if (answer && typeof answer === "object") {
    return Object.entries(answer as Record<string, string | string[]>)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value || "-"}`)
      .join("; ");
  }
  return "";
}
