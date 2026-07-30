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
  if (question.type === "rayDiagram") return scoreRayDiagram(question, answer);
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
      normalizer: part.normalizer || "text",
      reviewRecommended: Boolean(part.reviewRecommended || part.normalizer === "keywords" || part.normalizer === "arrowDown"),
    };
  });
  const thresholdScore = question.grading.scoreThresholds?.length
    ? scoreByThreshold(parts.filter((part) => part.correct).length, question.grading.scoreThresholds)
    : null;
  const rawScore = thresholdScore ?? parts.reduce((sum, part) => sum + part.score, 0);
  return {
    score: Math.min(rawScore, question.points),
    possible: question.points,
    details: { parts },
  };
}

function scoreRayDiagram(question: Extract<TestQuestion, { type: "rayDiagram" }>, answer: unknown) {
  const values = answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
  const normalEnd = parsePoint(values.normalEnd);
  const labelPoint = parsePoint(values.labelPoint);
  const reflectedEnd = parsePoint(values.reflectedEnd);
  const { incidence, incidentSource, eye, normalTolerance, labelRegion, eyeTolerance, angleToleranceDegrees } = question.geometry;

  const normalCorrect = Boolean(
    normalEnd &&
    normalEnd.x < incidence.x &&
    Math.abs(normalEnd.y - incidence.y) <= normalTolerance,
  );
  const labelCorrect = Boolean(
    labelPoint &&
    labelPoint.x >= labelRegion.minX &&
    labelPoint.x <= labelRegion.maxX &&
    labelPoint.y >= labelRegion.minY &&
    labelPoint.y <= labelRegion.maxY,
  );
  const reachesEye = Boolean(reflectedEnd && distance(reflectedEnd, eye) <= eyeTolerance);
  const incidentAngle = Math.atan2(Math.abs(incidentSource.y - incidence.y), Math.abs(incidentSource.x - incidence.x));
  const reflectionAngle = reflectedEnd
    ? Math.atan2(Math.abs(reflectedEnd.y - incidence.y), Math.abs(reflectedEnd.x - incidence.x))
    : Number.POSITIVE_INFINITY;
  const angleCorrect = Math.abs(reflectionAngle - incidentAngle) * 180 / Math.PI <= angleToleranceDegrees;
  const parts = [
    {
      id: "normal-and-label",
      response: `${values.normalEnd || ""}; ${values.labelPoint || ""}`,
      score: normalCorrect && labelCorrect ? 1 : 0,
      possible: 1,
      correct: normalCorrect && labelCorrect,
      normalCorrect,
      labelCorrect,
    },
    {
      id: "reflected-ray",
      response: String(values.reflectedEnd || ""),
      score: reachesEye && angleCorrect ? 1 : 0,
      possible: 1,
      correct: reachesEye && angleCorrect,
      reachesEye,
      angleCorrect,
    },
  ];
  return {
    score: parts.reduce((sum, part) => sum + part.score, 0),
    possible: question.points,
    details: { parts },
  };
}

function parsePoint(value: string | string[] | undefined) {
  if (typeof value !== "string") return null;
  const [x, y] = value.split(",").map(Number);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function distance(left: { x: number; y: number }, right: { x: number; y: number }) {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function isCorrectPart(raw: string | string[], part: NonNullable<Extract<TestQuestion["grading"], { mode: "auto" }>["parts"]>[number]) {
  if (part.normalizer === "set") return sameSet(Array.isArray(raw) ? raw : [], part.accepted);
  if (part.normalizer === "contains") {
    return Array.isArray(raw) && part.accepted.some((accepted) => raw.some((item) => normalize(item) === normalize(accepted)));
  }
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

function normalize(value: string, mode: "text" | "time" | "set" | "contains" | "keywords" | "arrowDown" = "text") {
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
