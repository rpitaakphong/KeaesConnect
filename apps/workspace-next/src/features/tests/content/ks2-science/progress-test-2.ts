import sourceBank from "@/features/tests/content/ks2-science/progress-test-2.json";
import type { AnswerPart, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/ks2-science/progress-test-2";

type SourceOption = {
  id: string;
  label: string;
  asset?: string;
  accessibleDescription?: string;
};

type SourceItem = {
  id: string;
  label?: string;
  statement?: string;
  choices?: SourceOption[];
};

type SourceAsset = { path: string; alt: string };

type SourceInteraction = {
  type: string;
  options?: SourceOption[];
  items?: SourceItem[];
  choices?: string[];
  requiredCount?: number;
  image?: SourceAsset;
  unit?: string;
};

type SourceQuestion = {
  id: string;
  marks: number;
  adaptedPrompt: string;
  interaction: SourceInteraction;
  answerRule: {
    kind: string;
    value?: unknown;
    values?: Record<string, unknown>;
    acceptedValues?: string[];
  };
  feedback: { explanation: string };
  assets: SourceAsset[];
};

type SourceSection = {
  id: string;
  title: string;
  questions: SourceQuestion[];
};

type SourceBank = { sections: SourceSection[] };
const source = sourceBank as unknown as SourceBank;

export const ks2ScienceProgressTest2: TestDefinition = {
  id: "ks2-science-progress-test-2",
  title: "Key Stage 2 Science Progress Test 2",
  subject: "Science",
  level: "Key Stage 2",
  totalPoints: 22,
  durationMinutes: 25,
  status: "active",
  answerExplanations: Object.fromEntries(
    source.sections.flatMap((section) => section.questions.map((question) => [question.id, question.feedback.explanation])),
  ),
  sections: source.sections.map((section, index) => ({
    id: section.id,
    label: `Section ${index + 1}`,
    title: section.title,
    hint: "Answer every question. All responses are marked automatically.",
    groupByQuestionNumber: true,
    questions: section.questions.map(convertQuestion),
  })),
};

function convertQuestion(question: SourceQuestion): TestQuestion {
  const common = {
    id: `ks2-sci-pt2-${question.id}`,
    number: Number.parseInt(question.id, 10),
    prompt: `${partLabel(question.id)}${question.adaptedPrompt}`,
    points: question.marks,
    visuals: question.assets.map((asset) => ({
      type: "image" as const,
      src: assetPath(asset.path),
      alt: asset.alt,
      maxWidth: 720,
    })),
  };

  if (question.interaction.type === "single_choice") {
    const options = question.interaction.options || [];
    const answer = String(question.answerRule.value ?? "");
    return {
      ...common,
      type: "singleChoice",
      choices: options.map((option) => ({
        value: option.id,
        label: option.label,
        image: option.asset ? assetPath(option.asset) : undefined,
        alt: option.accessibleDescription || option.label,
      })),
      grading: {
        mode: "auto",
        display: options.find((option) => option.id === answer)?.label || answer,
        parts: [{ id: "answer", accepted: [answer], points: question.marks }],
      },
    };
  }

  if (question.interaction.type === "integer_entry" || question.interaction.type === "numeric_entry") {
    const answer = String(question.answerRule.value ?? "");
    return {
      ...common,
      type: "text",
      inputMode: "number",
      placeholder: question.interaction.unit ? `Answer in ${question.interaction.unit}` : "Enter a number",
      grading: { mode: "auto", display: answer, parts: [{ id: "answer", accepted: [answer], points: question.marks }] },
    };
  }

  if (question.interaction.type === "select_exactly_n") {
    const options = (question.interaction.options || []).map((option) => ({ value: option.id, label: option.label }));
    const accepted = question.answerRule.acceptedValues || [];
    const requiredCount = question.interaction.requiredCount || 2;
    const parts: AnswerPart[] = Array.from({ length: requiredCount }, (_, index) => ({
      id: `choice${index + 1}`,
      accepted,
      points: 1,
    }));
    return {
      ...common,
      type: "multiText",
      compact: true,
      uniqueOptions: true,
      fields: parts.map((part, index) => ({ id: part.id, label: `Choice ${index + 1}`, options, control: "select" as const })),
      grading: groupedGrading(accepted.map(humanize).join("; "), parts, requiredCount, question.marks),
    };
  }

  if (question.interaction.type === "image_hotspot" && question.interaction.image) {
    return {
      ...common,
      type: "diagramAnnotation",
      variant: "point",
      instruction: "Place X on the part of the flower where the seed develops.",
      backgroundSrc: assetPath(question.interaction.image.path),
      backgroundAlt: question.interaction.image.alt,
      geometry: {
        variant: "point",
        segment: { start: { x: 0.49, y: 0.64 }, end: { x: 0.63, y: 0.72 } },
        tolerance: 0.1,
      },
      grading: {
        mode: "auto",
        display: "Place X on the ovary at the base of the flower.",
        parts: [{ id: "point", accepted: ["ovary"], points: question.marks }],
      },
    };
  }

  if (question.interaction.type === "classification_grid") {
    const values = question.answerRule.values || {};
    const fields = (question.interaction.items || []).map((item) => ({
      id: item.id,
      label: item.label || item.statement || item.id,
      options: (item.choices || []).length
        ? item.choices!.map((choice) => ({ value: choice.id, label: choice.label }))
        : (question.interaction.choices || []).map((choice) => ({ value: choice, label: humanize(choice) })),
      control: "radio" as const,
    }));
    const parts: AnswerPart[] = fields.map((field) => ({
      id: field.id,
      accepted: [String(values[field.id] ?? "")],
      points: 1,
    }));
    const display = fields.map((field) => {
      const value = String(values[field.id] ?? "");
      return `${field.label}: ${field.options.find((option) => option.value === value)?.label || humanize(value)}`;
    }).join("; ");
    return {
      ...common,
      type: "multiText",
      compact: true,
      fields,
      grading: question.marks === parts.length
        ? { mode: "auto", display, parts }
        : groupedGrading(display, parts, parts.length, question.marks),
    };
  }

  throw new Error(`Unsupported Progress Test 2 interaction: ${question.interaction.type}`);
}

function groupedGrading(display: string, parts: AnswerPart[], minCorrect: number, points: number) {
  return {
    mode: "auto" as const,
    display,
    parts,
    markGroups: [{ id: "complete-answer", partIds: parts.map((part) => part.id), minCorrect, points }],
  };
}

function partLabel(id: string) {
  const match = id.match(/^\d+([a-z])(?:-([iv]+))?$/i);
  return match ? `(${match[1]})${match[2] ? `(${match[2]})` : ""} ` : "";
}

function assetPath(asset: string) {
  return `${assetBase}/${asset.replace(/^assets\//, "")}`;
}

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

