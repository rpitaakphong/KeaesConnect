import sourceBank from "@/features/tests/content/ks2-science/progress-test-1.json";
import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/ks2-science/progress-test-1";

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
};

type SourceInteraction = {
  type: string;
  options?: SourceOption[] | string[];
  items?: SourceItem[] | string[];
  choices?: string[];
  left?: string[];
  right?: string[];
  rightLabels?: Record<string, string>;
  slots?: Array<{ id: string; options: string[] }>;
  requiredCount?: number;
  xLabel?: string;
  yLabel?: string;
  xValues?: number[];
  yValues?: number[];
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
    alternatives?: Array<Record<string, string>>;
    min?: number;
    max?: number;
    expected?: number;
  };
  partialCredit?: {
    bands?: Array<{ minCorrect: number; marks: number }>;
  } | null;
  feedback: { explanation: string };
  assets: string[];
  assetDescriptions?: Record<string, string>;
  assetMaxWidths?: Record<string, number>;
};

type SourceSection = {
  id: string;
  title: string;
  introduction: string;
  questions: SourceQuestion[];
};

type SourceBank = {
  sections: SourceSection[];
};

const source = sourceBank as unknown as SourceBank;

export const ks2ScienceProgressTest1: TestDefinition = {
  id: "ks2-science-progress-test-1",
  title: "Key Stage 2 Science Progress Test 1",
  subject: "Science",
  level: "Key Stage 2",
  totalPoints: 40,
  durationMinutes: 45,
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
    visualPlacement: "perQuestion",
    questions: section.questions.map((question, questionIndex) => ({
      ...convertQuestion(question),
      ...(questionIndex === 0 ? { groupIntro: { lead: section.introduction } } : {}),
    })),
  })),
};

function convertQuestion(question: SourceQuestion): TestQuestion {
  const common = {
    id: `ks2-sci-pt1-${question.id}`,
    number: Number.parseInt(question.id, 10),
    prompt: `${partLabel(question.id)}${question.adaptedPrompt}`,
    points: question.marks,
    visuals: question.assets
      .filter((asset) => asset.endsWith(".png"))
      .map((asset) => ({
        type: "image" as const,
        src: assetPath(asset),
        alt: question.assetDescriptions?.[asset] || `Source visual for question ${question.id}`,
        maxWidth: question.assetMaxWidths?.[asset] || 720,
      })),
  };

  if (question.interaction.type === "single_choice") {
    const options = asSourceOptions(question.interaction.options);
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
        display: labelForAnswer(options, String(question.answerRule.value ?? "")),
        parts: [{ id: "answer", accepted: [String(question.answerRule.value ?? "")], points: question.marks }],
      },
    };
  }

  if (question.interaction.type === "integer_entry" || question.interaction.type === "numeric_entry") {
    const numericRange = answerRange(question);
    const expected = numericRange ? question.answerRule.expected ?? numericRange.min : question.answerRule.value;
    const accepted = [String(expected ?? "")];
    return {
      ...common,
      type: "text",
      inputMode: "number",
      placeholder: question.interaction.unit ? `Answer in ${question.interaction.unit}` : "Enter a number",
      grading: {
        mode: "auto",
        display: numericRange ? `${numericRange.min}–${numericRange.max} ${question.interaction.unit || ""} (expected reading: ${expected})`.trim() : accepted[0],
        parts: [{ id: "answer", accepted, points: question.marks, numericRange }],
      },
    };
  }

  if (question.interaction.type === "select_exactly_n") {
    const options = asSourceOptions(question.interaction.options).map((option) => ({ value: option.id, label: option.label }));
    const accepted = question.answerRule.acceptedValues || [];
    return {
      ...common,
      type: "multiText",
      compact: true,
      uniqueOptions: true,
      fields: [
        { id: "choice1", label: "Control variable 1", options, control: "select" },
        { id: "choice2", label: "Control variable 2", options, control: "select" },
      ],
      grading: groupedGrading(
        accepted.join("; "),
        [
          { id: "choice1", accepted, points: 1 },
          { id: "choice2", accepted, points: 1 },
        ],
        2,
        question.marks,
      ),
    };
  }

  const fields = responseFields(question);
  if (question.answerRule.kind === "one_of_maps") {
    const alternatives = question.answerRule.alternatives || [];
    return {
      ...common,
      type: "multiText",
      compact: true,
      fields,
      grading: {
        mode: "auto",
        display: alternatives.map((values) => displayValues(values, question)).join(" OR "),
        parts: fields.map((field) => ({
          id: field.id,
          accepted: [...new Set(alternatives.map((values) => values[field.id]))],
          points: 1,
        })),
        sequenceGroups: alternatives.map((values, index) => ({
          id: `alternative-${index + 1}`,
          partIds: fields.map((field) => field.id),
          acceptedSequence: fields.map((field) => values[field.id]),
          points: question.marks,
        })),
      },
    };
  }
  const values = question.answerRule.values || {};
  const parts = fields.map((field, index) => ({
    id: field.id,
    accepted: [String(values[field.id] ?? orderedAnswer(question, index) ?? "")],
    points: 1,
  }));
  const thresholds = question.partialCredit?.bands?.map((band) => ({ minCorrect: band.minCorrect, points: band.marks }));

  return {
    ...common,
    type: "multiText",
    compact: true,
    uniqueOptions: question.interaction.type === "matching" || question.interaction.type === "ordering",
    fields,
    grading: thresholds?.length
      ? {
        mode: "auto",
        display: displayValues(values, question),
        parts,
        scoreThresholds: thresholds,
      }
      : groupedGrading(displayValues(values, question), parts, parts.length, question.marks),
  };
}

function responseFields(question: SourceQuestion) {
  const interaction = question.interaction;
  if (interaction.type === "true_false_grid") {
    return asSourceItems(interaction.items).map((item) => ({
      id: item.id,
      label: item.statement || item.label || item.id,
      options: [{ value: "true", label: "True" }, { value: "false", label: "False" }],
      control: "radio" as const,
    }));
  }
  if (interaction.type === "classification_grid") {
    const options = (interaction.choices || []).map((value) => ({ value, label: humanize(value) }));
    return asSourceItems(interaction.items).map((item) => ({ id: item.id, label: item.label || item.statement || item.id, options, control: "radio" as const }));
  }
  if (interaction.type === "matching") {
    const options = (interaction.right || []).map((value) => ({ value, label: interaction.rightLabels?.[value] || humanize(value) }));
    return (interaction.left || []).map((value) => ({ id: value, label: `Solid ${value}`, options, control: "select" as const }));
  }
  if (interaction.type === "ordering") {
    const options = asStrings(interaction.items).map((value) => ({ value, label: value }));
    return options.map((_, index) => ({ id: `position${index + 1}`, label: `Position ${index + 1}`, options, control: "select" as const }));
  }
  if (interaction.type === "coordinate_select") {
    return [
      { id: "x", label: interaction.xLabel || "x coordinate", options: (interaction.xValues || []).map(numberOption), control: "select" as const },
      { id: "y", label: interaction.yLabel || "y coordinate", options: (interaction.yValues || []).map(numberOption), control: "select" as const },
    ];
  }
  if (interaction.type === "sentence_completion") {
    return (interaction.slots || []).map((slot) => ({
      id: slot.id,
      label: humanize(slot.id),
      options: slot.options.map((value) => ({ value, label: humanize(value) })),
      control: "select" as const,
    }));
  }
  return [];
}

function groupedGrading(
  display: string,
  parts: Array<{ id: string; accepted: string[]; points: number }>,
  minCorrect: number,
  points: number,
) {
  return {
    mode: "auto" as const,
    display,
    parts,
    markGroups: [{ id: "complete-answer", partIds: parts.map((part) => part.id), minCorrect, points }],
  };
}

function orderedAnswer(question: SourceQuestion, index: number) {
  if (question.interaction.type === "ordering" && Array.isArray(question.answerRule.value)) return question.answerRule.value[index];
  if (question.interaction.type === "coordinate_select" && isRecord(question.answerRule.value)) {
    return index === 0 ? question.answerRule.value.x : question.answerRule.value.y;
  }
  return undefined;
}

function displayValues(values: Record<string, unknown>, question: SourceQuestion) {
  if (question.interaction.type === "ordering" && Array.isArray(question.answerRule.value)) return question.answerRule.value.join(", ");
  if (question.interaction.type === "coordinate_select" && isRecord(question.answerRule.value)) return `(${question.answerRule.value.x}, ${question.answerRule.value.y})`;
  return Object.entries(values).map(([key, value]) => `${humanize(key)}: ${humanize(String(value))}`).join("; ");
}

function answerRange(question: SourceQuestion) {
  const { kind, min, max } = question.answerRule;
  if (kind !== "number_range") return undefined;
  if (typeof min !== "number" || typeof max !== "number" || !Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    throw new Error(`Invalid numeric range for question ${question.id}`);
  }
  return { min, max };
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

function numberOption(value: number) {
  return { value: String(value), label: String(value) };
}

function labelForAnswer(options: SourceOption[], value: string) {
  return options.find((option) => option.id === value)?.label || value;
}

function asSourceOptions(value: SourceInteraction["options"]): SourceOption[] {
  return (value || []).filter((option): option is SourceOption => typeof option === "object");
}

function asSourceItems(value: SourceInteraction["items"]): SourceItem[] {
  return (value || []).filter((item): item is SourceItem => typeof item === "object");
}

function asStrings(value: SourceInteraction["items"]): string[] {
  return (value || []).filter((item): item is string => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
