import type { AnswerPart, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

export const field = (id: string, label: string, points: number, accepted: string[], normalizer: AnswerPart["normalizer"] = "text", placeholder?: string) => ({
  id,
  label,
  points,
  accepted,
  normalizer,
  placeholder,
});

export const mathQ = (
  prefix: string,
  number: number,
  points: number,
  prompt: string,
  fields: ReturnType<typeof field>[],
  extra: Partial<Extract<TestQuestion, { type: "multiText" }>> = {},
): TestQuestion => ({
  id: `${prefix}-q${number}`,
  number,
  points,
  prompt,
  type: "multiText",
  fields: fields.map(({ id, label, placeholder }) => ({ id, label, placeholder })),
  grading: {
    mode: "auto",
    display: fields.map((item) => item.accepted[0]).join(", "),
    parts: fields.map(({ id, accepted, points, normalizer }) => ({ id, accepted, points, normalizer })),
  },
  ...extra,
});

export const mathChoice = (
  prefix: string,
  number: number,
  points: number,
  prompt: string,
  choices: Array<{ value: string; label: string; visualHtml?: string }>,
  accepted: string[],
  extra: Partial<Extract<TestQuestion, { type: "singleChoice" }>> = {},
): TestQuestion => ({
  id: `${prefix}-q${number}`,
  number,
  points,
  prompt,
  type: "singleChoice",
  responseShape: "object",
  choices,
  grading: {
    mode: "auto",
    display: accepted.join(", "),
    parts: [{ id: "answer", accepted, points, normalizer: "text" }],
  },
  ...extra,
});

export const mathMultiChoice = (
  prefix: string,
  number: number,
  points: number,
  prompt: string,
  choices: Array<{ value: string; label: string; visualHtml?: string }>,
  accepted: string[],
): TestQuestion => ({
  id: `${prefix}-q${number}`,
  number,
  points,
  prompt,
  type: "multiChoice",
  choices,
  grading: {
    mode: "auto",
    display: accepted.join(", "),
    parts: [{ id: "selected", accepted, points, normalizer: "set" }],
  },
});

export const mathTest = (
  id: string,
  title: string,
  level: string,
  sections: TestDefinition["sections"],
): TestDefinition => ({
  id,
  title,
  subject: "Math",
  level,
  status: "active",
  totalPoints: 30,
  sections,
});

export const imageHtml = (src: string, alt: string, className = "") => (
  `<img class="booklet-diagram math-booklet-image ${className}" src="${src}" alt="${alt}">`
);
