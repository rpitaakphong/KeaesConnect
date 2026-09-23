"use client";

import type { AdminAnswer, AdminResult } from "@/features/admin/types";
import { getTestDefinition } from "@/features/tests/content/registry";
import type { TestQuestion } from "@/features/tests/lib/types";

type ChoiceQuestion = Extract<TestQuestion, { type: "singleChoice" | "multiChoice" }>;

export type ReportChoice = {
  alt?: string;
  image?: string;
  label: string;
  letter: string;
  table?: {
    cells: string[];
    headers: string[];
  };
  value: string;
  visualHtml?: string;
};

export type ChoiceAnswerReview = {
  correct: ReportChoice[];
  correctFallback: string;
  questionNumber: number;
  selected: ReportChoice[];
  selectedFallback: string;
};

const questionCache = new Map<string, Map<string, TestQuestion>>();

export function AnswerReviewList({ result }: { result: AdminResult }) {
  return (
    <div className="correction-list">
      {result.answers.length ? result.answers.map((answer, index) => (
        <AnswerReviewRow answer={answer} index={index} key={`${answer.questionId || answer.part}-${index}`} testId={result.testId} />
      )) : <p>No answer details available.</p>}
    </div>
  );
}

export function resolveChoiceAnswer(testId: string, answer: AdminAnswer): ChoiceAnswerReview | null {
  if (!answer.questionId) return null;
  const question = findQuestion(testId, answer.questionId);
  if (!question || (question.type !== "singleChoice" && question.type !== "multiChoice")) return null;

  const choices = buildReportChoices(question);
  const selectedValues = extractResponseValues(answer.response, question.type === "multiChoice");
  const correctValues = getCorrectValues(question, answer.correctAnswer);
  const selected = matchChoices(choices, selectedValues);
  const correct = matchChoices(choices, correctValues);

  return {
    correct,
    correctFallback: correct.length ? "" : cleanFallback(answer.correctAnswer),
    questionNumber: question.number,
    selected,
    selectedFallback: selected.length ? "" : cleanFallback(answer.response),
  };
}

export function formatChoiceSelectionForText(choices: ReportChoice[], fallback: string) {
  if (!choices.length) return fallback || "No answer";
  return choices.map((choice) => `${choice.letter} — ${choiceText(choice)}`).join("; ");
}

function AnswerReviewRow({ answer, index, testId }: { answer: AdminAnswer; index: number; testId: string }) {
  const choiceReview = resolveChoiceAnswer(testId, answer);
  const questionLabel = choiceReview ? `Question ${choiceReview.questionNumber}` : `Answer ${index + 1}`;

  return (
    <article className={`correction-row answer-review-row ${answer.correct ? "" : "is-wrong"}`}>
      <div className="answer-review-heading">
        <div>
          <span className="answer-review-meta">{answer.part} · {questionLabel}</span>
          <strong>{answer.prompt}</strong>
        </div>
        <span className="answer-review-score">{formatScore(answer.score)}/{formatScore(answer.possible)}</span>
      </div>

      {choiceReview ? (
        <div className="answer-choice-comparison">
          <ChoiceSelection
            choices={choiceReview.selected}
            fallback={choiceReview.selectedFallback}
            label="Student selected"
            tone={answer.correct ? "student-correct" : "student-wrong"}
          />
          <ChoiceSelection choices={choiceReview.correct} fallback={choiceReview.correctFallback} label="Correct answer" tone="correct" />
        </div>
      ) : (
        <span>Student: {answer.response || "-"} · Correct: {answer.correctAnswer || "-"} · Score: {formatScore(answer.score)}/{formatScore(answer.possible)}</span>
      )}
      <GradingDetails details={answer.gradingDetails} />
    </article>
  );
}

function GradingDetails({ details }: { details: Record<string, unknown> | null | undefined }) {
  const parts = Array.isArray(details?.parts) ? details.parts : [];
  if (parts.length) {
    const reviewRecommended = parts.some((part) => Boolean((part as { reviewRecommended?: unknown }).reviewRecommended));
    return (
      <span>
        Parts: {parts.map((part) => {
          const item = part as { id?: unknown; score?: unknown; possible?: unknown };
          return `${String(item.id || "")} ${formatScore(Number(item.score || 0))}/${formatScore(Number(item.possible || 0))}`;
        }).join(" · ")}
        {reviewRecommended ? " · Review recommended" : ""}
      </span>
    );
  }
  if (!details || typeof details !== "object" || !("contentScore" in details)) return null;
  if ("communicativeAchievementScore" in details) {
    return (
      <span>
        Content: {formatScore(Number(details.contentScore || 0))}/5 · Communicative achievement: {formatScore(Number(details.communicativeAchievementScore || 0))}/5 · Organisation: {formatScore(Number(details.organisationScore || 0))}/5 · Language: {formatScore(Number(details.languageScore || 0))}/5
        {details.wordCount !== undefined ? ` · ${String(details.wordCount)} words` : ""}
        {details.feedback ? ` · ${String(details.feedback)}` : ""}
      </span>
    );
  }
  if ("languageScore" in details) {
    return (
      <span>
        Content: {formatScore(Number(details.contentScore || 0))}/3 · Language: {formatScore(Number(details.languageScore || 0))}/2
        {details.feedback ? ` · ${String(details.feedback)}` : ""}
      </span>
    );
  }
  return (
    <span>
      Content: {formatScore(Number(details.contentScore || 0))}/0.5 · Writing: {formatScore(Number(details.writingScore || 0))}/0.5
      {details.feedback ? ` · ${String(details.feedback)}` : ""}
    </span>
  );
}

function ChoiceSelection({
  choices,
  fallback,
  label,
  tone,
}: {
  choices: ReportChoice[];
  fallback: string;
  label: string;
  tone: "correct" | "student-correct" | "student-wrong";
}) {
  return (
    <section className={`answer-choice-panel ${tone}`}>
      <span className="answer-choice-title">{label}</span>
      {choices.length ? choices.map((choice) => (
        <div className="answer-choice-value" key={choice.value}>
          <span className="answer-choice-letter">{choice.letter}</span>
          <div className="answer-choice-content">
            <strong>{choiceText(choice)}</strong>
            {choice.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={choice.alt || choice.label} className="answer-choice-image" src={choice.image} />
            ) : null}
            {choice.visualHtml ? <div className="answer-choice-visual" dangerouslySetInnerHTML={{ __html: choice.visualHtml }} /> : null}
            {choice.table ? <ChoiceTable choice={choice} /> : null}
          </div>
        </div>
      )) : <strong className="answer-choice-fallback">{fallback || "No answer"}</strong>}
    </section>
  );
}

function ChoiceTable({ choice }: { choice: ReportChoice }) {
  if (!choice.table) return null;
  return (
    <div className="answer-choice-table-wrap">
      <table className="answer-choice-table">
        <thead>
          <tr>{choice.table.headers.map((header, index) => <th dangerouslySetInnerHTML={{ __html: header }} key={`${choice.value}-h-${index}`} />)}</tr>
        </thead>
        <tbody>
          <tr>{choice.table.cells.map((cell, index) => <td dangerouslySetInnerHTML={{ __html: cell }} key={`${choice.value}-c-${index}`} />)}</tr>
        </tbody>
      </table>
    </div>
  );
}

function findQuestion(testId: string, questionId: string) {
  let questions = questionCache.get(testId);
  if (!questions) {
    const test = getTestDefinition(testId);
    questions = new Map(test?.sections.flatMap((section) => section.questions).map((question) => [question.id, question]) || []);
    questionCache.set(testId, questions);
  }
  return questions.get(questionId) || null;
}

function buildReportChoices(question: ChoiceQuestion): ReportChoice[] {
  return question.choices.map((choice, index) => {
    const letter = choiceLetter(index);
    const tableRow = question.type === "singleChoice" ? question.choiceTable?.rows.find((row) => same(row.value, choice.value)) : undefined;
    const tableHeaders = question.type === "singleChoice" ? question.choiceTable?.headers.slice(1) : undefined;
    return {
      alt: "alt" in choice ? choice.alt : undefined,
      image: "image" in choice ? choice.image : undefined,
      label: cleanChoiceLabel(choice.label, letter),
      letter,
      table: tableRow && tableHeaders ? { cells: tableRow.cells, headers: tableHeaders } : undefined,
      value: choice.value,
      visualHtml: choice.visualHtml,
    };
  });
}

function getCorrectValues(question: ChoiceQuestion, fallback: string) {
  if (question.grading?.mode === "auto") {
    const preferredPart = question.grading.parts.find((part) => part.id === (question.type === "multiChoice" ? "selected" : "answer"));
    const accepted = preferredPart?.accepted || question.grading.parts[0]?.accepted || [];
    if (accepted.length) return accepted;
  }
  return extractResponseValues(fallback, question.type === "multiChoice");
}

function extractResponseValues(value: string, multiple: boolean): string[] {
  const cleaned = cleanFallback(value);
  if (!cleaned || /^no answer$/i.test(cleaned)) return [];

  try {
    const parsed = JSON.parse(cleaned) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      if (Array.isArray(record.selected)) return record.selected.map(String);
      if (typeof record.answer === "string") return [record.answer];
    }
  } catch {
    // Stored display values are usually plain text, so JSON parsing is best-effort.
  }

  const withoutPart = cleaned.replace(/^(answer|selected)\s*:\s*/i, "").trim();
  return multiple ? withoutPart.split(/\s*[;,]\s*/).filter(Boolean) : [withoutPart];
}

function matchChoices(choices: ReportChoice[], values: string[]) {
  const matches: ReportChoice[] = [];
  for (const value of values) {
    const normalized = normalize(value);
    const match = choices.find((choice) => choiceAliases(choice).some((alias) => normalize(alias) === normalized));
    if (match && !matches.some((item) => item.value === match.value)) matches.push(match);
  }
  return matches;
}

function choiceAliases(choice: ReportChoice) {
  return [choice.value, choice.label, choice.letter, `${choice.letter}. ${choice.label}`, `${choice.letter}) ${choice.label}`];
}

function choiceText(choice: ReportChoice) {
  if (choice.label && normalize(choice.label) !== normalize(choice.letter)) return stripHtml(choice.label);
  if (choice.table) {
    return choice.table.headers.map((header, index) => `${stripHtml(header)}: ${stripHtml(choice.table?.cells[index] || "")}`).join("; ");
  }
  return stripHtml(choice.alt || choice.label || choice.value) || "Visual choice";
}

function cleanChoiceLabel(label: string, letter: string) {
  const stripped = label.replace(new RegExp(`^${letter}\\s*[.)-]\\s*`, "i"), "").trim();
  return stripped || label.trim();
}

function cleanFallback(value: string) {
  return String(value || "").trim();
}

function choiceLetter(index: number) {
  return String.fromCharCode(65 + index);
}

function same(left: string, right: string) {
  return normalize(left) === normalize(right);
}

function normalize(value: string) {
  return stripHtml(String(value || ""))
    .replace(/^(answer|selected)\s*:\s*/i, "")
    .replace(/^[A-Z]\s*[.)-]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripHtml(value: string) {
  return String(value || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
