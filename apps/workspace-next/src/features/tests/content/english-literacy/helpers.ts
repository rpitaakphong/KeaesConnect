import type { TestQuestion } from "@/features/tests/lib/types";

export const choice = (value: string, label = value, image?: string, alt?: string) => ({ value, label, image, alt });
export const answer = (accepted: string[], points = 1) => ({ id: "answer", accepted, points, normalizer: "text" as const });

export const single = (
  prefix: string,
  number: number,
  prompt: string,
  choices: Array<string | ReturnType<typeof choice>>,
  accepted: string,
  display = accepted,
  extra: Partial<Pick<TestQuestion, "hidePrompt">> = {},
): TestQuestion => ({
  id: `${prefix}-q${number}`,
  number,
  prompt,
  hidePrompt: extra.hidePrompt,
  points: 1,
  type: "singleChoice",
  choices: choices.map((item) => typeof item === "string" ? choice(item) : item),
  grading: { mode: "auto", display, parts: [answer([accepted])] },
});

export const text = (
  prefix: string,
  number: number,
  prompt: string,
  accepted: string[],
  display: string,
  extra: {
    placeholder?: string;
    inputMode?: "text" | "number" | "textarea";
    image?: string;
    alt?: string;
    maxWidth?: number;
  } = {},
): TestQuestion => ({
  id: `${prefix}-q${number}`,
  number,
  prompt,
  points: 1,
  type: "text",
  placeholder: extra.placeholder,
  inputMode: extra.inputMode || "text",
  visuals: extra.image ? [{ type: "image", src: extra.image, alt: extra.alt || prompt, maxWidth: extra.maxWidth || 240 }] : undefined,
  grading: { mode: "auto", display, parts: [answer(accepted)] },
});

export const aiText = (
  prefix: string,
  number: number,
  prompt: string,
  display: string,
  contentTerms: string[],
  extra: Partial<Pick<TestQuestion, "promptParts">> = {},
): TestQuestion => ({
  id: `${prefix}-q${number}`,
  number,
  prompt,
  promptParts: extra.promptParts,
  points: 1,
  type: "text",
  inputMode: "textarea",
  placeholder: "Write a short answer",
  grading: { mode: "aiSplit", display, contentTerms },
});
