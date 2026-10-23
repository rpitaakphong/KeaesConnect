import sourceBank from "@/features/tests/content/ks2-science/assessment-test.json";
import type { AnswerPart, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/ks2-science/assessment-test";

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
  left?: string[];
  right?: string[];
  rightLabels?: Record<string, string>;
  requiredCount?: number;
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
    min?: number;
    max?: number;
    expected?: number;
  };
  partialCredit?: {
    bands?: Array<{ minCorrect: number; maxCorrect?: number; marks: number }>;
  } | null;
  feedback: { explanation: string };
  assets: SourceAsset[];
};

type SourceSection = {
  id: string;
  title: string;
  questions: SourceQuestion[];
};

type SourceBank = {
  test: { title: string; durationMinutes: number; totalMarks: number };
  sections: SourceSection[];
};

const source = sourceBank as unknown as SourceBank;

export const ks2ScienceAssessmentTest: TestDefinition = {
  id: "ks2-science-assessment-test",
  title: "Key Stage 2 Science Assessment Test",
  subject: "Science",
  level: "Key Stage 2",
  totalPoints: source.test.totalMarks,
  durationMinutes: source.test.durationMinutes,
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
    id: `ks2-sci-assessment-${question.id}`,
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
    const accepted = question.answerRule.kind === "number_range"
      ? integerRange(question.answerRule.min, question.answerRule.max)
      : [String(question.answerRule.value ?? "")];
    const display = question.answerRule.kind === "number_range"
      ? `${question.answerRule.min}–${question.answerRule.max} ${question.interaction.unit || ""}`.trim()
      : `${accepted[0]}${question.interaction.unit ? ` ${question.interaction.unit}` : ""}`;
    return {
      ...common,
      type: "text",
      inputMode: "number",
      placeholder: question.interaction.unit ? `Answer in ${question.interaction.unit}` : "Enter a number",
      grading: { mode: "auto", display, parts: [{ id: "answer", accepted, points: question.marks }] },
    };
  }

  if (question.interaction.type === "select_exactly_n") {
    const options = (question.interaction.options || []).map((option) => ({ value: option.id, label: option.label }));
    const accepted = question.answerRule.acceptedValues || [];
    const requiredCount = question.interaction.requiredCount || 1;
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
      fields: parts.map((part, index) => ({
        id: part.id,
        label: `Choice ${index + 1}`,
        options,
        control: "select" as const,
      })),
      grading: groupedGrading(accepted.map(humanize).join("; "), parts, requiredCount, question.marks),
    };
  }

  if (
    question.interaction.type === "matching" ||
    question.interaction.type === "classification_grid" ||
    question.interaction.type === "true_false_grid"
  ) {
    const fields = responseFields(question);
    const values = question.answerRule.values || {};
    const parts: AnswerPart[] = fields.map((field) => ({
      id: field.id,
      accepted: [String(values[field.id] ?? "")],
      points: 1,
    }));
    const display = fields.map((field) => {
      const value = String(values[field.id] ?? "");
      return `${field.label}: ${field.options?.find((option) => option.value === value)?.label || humanize(value)}`;
    }).join("; ");
    const thresholds = question.partialCredit?.bands
      ?.filter((band) => band.marks > 0)
      .map((band) => ({ minCorrect: band.minCorrect, points: band.marks }));

    return {
      ...common,
      type: "multiText",
      compact: true,
      uniqueOptions: question.interaction.type === "matching",
      fields,
      grading: thresholds?.length
        ? { mode: "auto", display, parts, scoreThresholds: thresholds }
        : question.marks === parts.length
          ? { mode: "auto", display, parts }
          : groupedGrading(display, parts, parts.length, question.marks),
    };
  }

  throw new Error(`Unsupported Assessment Test interaction: ${question.interaction.type}`);
}

function responseFields(question: SourceQuestion) {
  const interaction = question.interaction;
  if (interaction.type === "matching") {
    const options = (interaction.right || []).map((value) => ({
      value,
      label: interaction.rightLabels?.[value] || humanize(value),
    }));
    return (interaction.left || []).map((value) => ({ id: value, label: value, options, control: "select" as const }));
  }
  if (interaction.type === "true_false_grid") {
    return (interaction.items || []).map((item) => ({
      id: item.id,
      label: item.statement || item.label || item.id,
      options: [{ value: "true", label: "True" }, { value: "false", label: "False" }],
      control: "radio" as const,
    }));
  }
  return (interaction.items || []).map((item) => ({
    id: item.id,
    label: item.label || item.statement || item.id,
    options: item.choices?.length
      ? item.choices.map((choice) => ({ value: choice.id, label: choice.label }))
      : (interaction.choices || []).map((value) => ({ value, label: humanize(value) })),
    control: "radio" as const,
  }));
}

function groupedGrading(display: string, parts: AnswerPart[], minCorrect: number, points: number) {
  return {
    mode: "auto" as const,
    display,
    parts,
    markGroups: [{ id: "complete-answer", partIds: parts.map((part) => part.id), minCorrect, points }],
  };
}

function integerRange(min = 0, max = min) {
  return Array.from({ length: max - min + 1 }, (_, index) => String(min + index));
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
