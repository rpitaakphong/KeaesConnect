"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { TestQuestion } from "@/features/tests/lib/types";

export function QuestionRenderer({
  answer,
  hideVisuals = false,
  onChange,
  question,
  variant = "card",
}: {
  answer: string | Record<string, string | string[]> | undefined;
  hideVisuals?: boolean;
  onChange: (value: string | Record<string, string | string[]>) => void;
  question: TestQuestion;
  variant?: "card" | "subquestion";
}) {
  const objectAnswer = typeof answer === "object" && answer ? answer : {};
  const spipMathInteraction = question.id.startsWith("spip-y7m-")
    ? renderSpipMathInteraction(question, objectAnswer, onChange)
    : null;
  const spipScienceInteraction = question.id.startsWith("spip-y7s-")
    ? renderSpipScienceInteraction(question, objectAnswer, onChange)
    : null;
  const responseContent = spipMathInteraction || spipScienceInteraction || (
    <>
      {!hideVisuals && question.visuals?.length ? <QuestionVisuals visuals={question.visuals} /> : null}
      {!hideVisuals && question.visualHtml ? <RawMathVisual html={question.visualHtml} /> : null}
      {question.type === "singleChoice" ? (
        <div className={singleChoiceGridClass(question)}>
          {question.choices.map((choice) => (
            <label className={`choice-card ${choice.image ? "image-choice-card" : ""}`} key={choice.value}>
              <input
                checked={question.responseShape === "object" ? objectAnswer.answer === choice.value : answer === choice.value}
                name={question.id}
                onChange={() => onChange(question.responseShape === "object" ? { ...objectAnswer, answer: choice.value } : choice.value)}
                type="radio"
                value={choice.value}
              />
              {choice.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={choice.image} alt={choice.alt || choice.label} />
              ) : null}
              {"visualHtml" in choice && choice.visualHtml ? <span className="math-choice-visual" dangerouslySetInnerHTML={{ __html: choice.visualHtml }} /> : null}
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      ) : question.type === "multiChoice" ? (
        <div className={multiChoiceGridClass(question)}>
          {question.choices.map((choice) => {
            const selected = Array.isArray(objectAnswer.selected) ? objectAnswer.selected : [];
            return (
              <label className={`choice-card ${choice.visualHtml ? "image-choice-card" : ""}`} key={choice.value}>
                <input
                  checked={selected.includes(choice.value)}
                  name={`${question.id}-${choice.value}`}
                  onChange={(event) => {
                    const next = new Set(selected);
                    if (event.target.checked) next.add(choice.value);
                    else next.delete(choice.value);
                    onChange({ ...objectAnswer, selected: Array.from(next) });
                  }}
                  type="checkbox"
                  value={choice.value}
                />
                {choice.visualHtml ? <span className="math-choice-visual" dangerouslySetInnerHTML={{ __html: choice.visualHtml }} /> : null}
                <span>{choice.label}</span>
              </label>
            );
          })}
        </div>
      ) : question.type === "text" ? (
        <label>
          <span className="visually-hidden">{question.prompt}</span>
          {question.inputMode === "textarea" ? (
            <textarea
              autoComplete="off"
              onChange={(event) => onChange(event.target.value)}
              placeholder={question.placeholder || "answer"}
              rows={3}
              value={typeof answer === "string" ? answer : ""}
            />
          ) : (
            <input
              autoComplete="off"
              inputMode={question.inputMode === "number" ? "numeric" : "text"}
              onChange={(event) => onChange(event.target.value)}
              placeholder={question.placeholder || "answer"}
              value={typeof answer === "string" ? answer : ""}
            />
          )}
        </label>
      ) : question.inlineRows?.length ? (
        <div className="math-inline-rows">
          {question.inlineRows.map((row, rowIndex) => (
            <div className="math-inline-row" key={rowIndex}>
              {row.items.map((item, itemIndex) => item.type === "input" && item.id
                ? <MathInput answer={objectAnswer} field={findField(question, item.id)} key={item.id} onChange={onChange} />
                : <span key={itemIndex}>{item.text}</span>)}
            </div>
          ))}
        </div>
      ) : question.rankRows?.length ? (
        <div className="math-rank-rows">
          <p>Write 1 for the smallest fraction and 4 for the greatest fraction.</p>
          {question.rankRows.map((row) => (
            <div className="math-rank-row" key={row.label}>
              <strong>{row.label}</strong>
              <div className="math-rank-grid">
                {row.items.map((item) => (
                  <label className="math-rank-item" key={item.id}>
                    <span>{item.text}</span>
                    <MathInput answer={objectAnswer} field={findField(question, item.id)} onChange={onChange} />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : question.answerTable ? (
        <>
          <div className="math-answer-table-wrap">
            <table className="math-answer-table">
              <thead>
                <tr>{question.answerTable.headers.map((header) => <th key={header}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {question.answerTable.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell.type === "input" && cell.id ? (
                          <span className="math-answer-cell-input">
                            <MathInput answer={objectAnswer} field={findField(question, cell.id)} onChange={onChange} />
                            {cell.suffix ? <span>{cell.suffix}</span> : null}
                          </span>
                        ) : cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {question.followupFieldIds?.length ? (
            <div className={`field-grid ${question.compact ? "compact-lines" : ""}`}>
              {question.followupFieldIds.map((fieldId) => <MathField answer={objectAnswer} field={findField(question, fieldId)} key={fieldId} onChange={onChange} />)}
            </div>
          ) : null}
        </>
      ) : (
        <div className={`field-grid ${question.compact ? "compact-lines" : ""}`}>
          {question.fields.map((field) => <MathField answer={objectAnswer} field={field} key={field.id} onChange={onChange} />)}
        </div>
      )}
    </>
  );

  if (variant === "subquestion") {
    return (
      <section className="science-subquestion">
        <div className="science-subquestion-head">
          <h4>{question.prompt}</h4>
          <span className="badge">{question.points} {question.points === 1 ? "mark" : "marks"}</span>
        </div>
        {question.note ? <p>{question.note}</p> : null}
        {responseContent}
      </section>
    );
  }

  return (
    <article className="question-card">
      <div className="question-head">
        <div>
          <p className="eyebrow">Question {question.number}</p>
          <h3>{question.prompt}</h3>
          {question.note ? <p>{question.note}</p> : null}
        </div>
        <span className="badge">{question.points} {question.points === 1 ? "mark" : "marks"}</span>
      </div>
      {responseContent}
    </article>
  );
}

function singleChoiceGridClass(question: Extract<TestQuestion, { type: "singleChoice" }>) {
  const classes = ["choice-grid", question.choices.some((choice) => choice.image || choice.visualHtml) ? "visual-choice-grid" : "text-choice-grid"];
  if (isCompactEnglishLetterChoice(question)) classes.push("compact-letter-choice-grid");
  if (isCompactEnglishImageChoice(question)) classes.push("compact-image-choice-grid");
  return classes.join(" ");
}

function multiChoiceGridClass(question: Extract<TestQuestion, { type: "multiChoice" }>) {
  const classes = ["choice-grid", question.choices.some((choice) => choice.visualHtml) ? "visual-choice-grid math-choice-grid" : "text-choice-grid"];
  if (isCompactEnglishLetterChoice(question)) classes.push("compact-letter-choice-grid");
  return classes.join(" ");
}

function isCompactEnglishLetterChoice(question: Extract<TestQuestion, { type: "singleChoice" | "multiChoice" }>) {
  return (
    /^spip-y7e-r(6|7|8|9|10)$/.test(question.id) &&
    question.choices.length === 8 &&
    question.choices.every((choice) => /^[A-H]$/.test(choice.label))
  );
}

function isCompactEnglishImageChoice(question: Extract<TestQuestion, { type: "singleChoice" }>) {
  return (
    /^spip-y7e-l[1-7]$/.test(question.id) &&
    question.choices.length === 3 &&
    question.choices.every((choice) => Boolean(choice.image) && /^[A-C]$/.test(choice.label))
  );
}

function renderSpipMathInteraction(
  question: TestQuestion,
  answer: Record<string, string | string[]>,
  onChange: (value: Record<string, string | string[]>) => void,
) {
  if (question.id === "spip-y7m-q1") return <SpipPairConnect answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q2") return <SpipTranslation answer={answer} onChange={onChange} />;
  if (question.id === "spip-y7m-q3" && question.type === "multiText") return <SpipLargestPairs answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q7") return <SpipScale answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q8" && question.type === "multiText") return <SpipRunnerTable answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q9") return <SpipStampChoices answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q13" && question.type === "multiText") return <SpipFractionBoxes answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q14") return <SpipLikelihood answer={answer} onChange={onChange} />;
  if (question.id === "spip-y7m-q17") return <SpipSportsCheckboxes answer={answer} onChange={onChange} />;
  if (question.id === "spip-y7m-q19" && question.type === "multiText") return <SpipMultiplicationGrid answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q20" && question.type === "multiText") return <SpipSequenceBoxes answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q22" && question.type === "multiText") return <SpipColumnAddition answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q23" && question.type === "multiText") return <SpipOperationBoxes answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q25" && question.type === "multiText") return <SpipOrderBoxes answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q26" && question.type === "multiText") return <SpipThreeBoxes answer={answer} onChange={onChange} question={question} />;
  if (question.id === "spip-y7m-q30") return <SpipReflection answer={answer} onChange={onChange} />;
  return null;
}

function renderSpipScienceInteraction(
  question: TestQuestion,
  answer: Record<string, string | string[]>,
  onChange: (value: Record<string, string | string[]>) => void,
) {
  if (question.id === "spip-y7s-q2" && question.type === "multiText") {
    return (
      <SpipScienceNumberedLabels
        answer={answer}
        labelPositions={[
          { id: "brain", x: 51, y: 8 },
          { id: "heart", x: 51, y: 45 },
          { id: "kidney", x: 31, y: 64 },
          { id: "lungs", x: 65, y: 40 },
          { id: "stomach", x: 59, y: 58 },
          { id: "intestines", x: 52, y: 79 },
        ]}
        onChange={onChange}
        question={question}
      />
    );
  }
  if (question.id === "spip-y7s-q4c" && question.type === "multiText") {
    return (
      <SpipScienceNumberedLabels
        answer={answer}
        labelPositions={[
          { id: "scale_top", x: 18, y: 42 },
          { id: "scale_middle", x: 18, y: 55 },
          { id: "scale_bottom", x: 18, y: 67 },
          { id: "solid_4", x: 48, y: 92 },
          { id: "fertiliser", x: 48, y: 58 },
          { id: "solid_5", x: 64, y: 92 },
          { id: "salt", x: 64, y: 73 },
          { id: "solid_6", x: 81, y: 92 },
          { id: "baking_powder", x: 81, y: 78 },
        ]}
        onChange={onChange}
        question={question}
      />
    );
  }
  if (question.id === "spip-y7s-q14b" && question.type === "multiText") {
    return <SpipScienceTapResults answer={answer} onChange={onChange} question={question} />;
  }
  return null;
}

const spipMathAssets = "/test-assets/spip/year-7-math-pre";

function setAnswerPart(answer: Record<string, string | string[]>, onChange: (value: Record<string, string | string[]>) => void, id: string, value: string | string[]) {
  onChange({ ...answer, [id]: value });
}

function answerText(answer: Record<string, string | string[]>, id: string) {
  const value = answer[id];
  return typeof value === "string" ? value : "";
}

const pairNodes = [
  { value: "0.25", x: 50, y: 21 },
  { value: "0.38", x: 67.7, y: 29.5 },
  { value: "0.44", x: 75, y: 50 },
  { value: "0.75", x: 67.7, y: 70.5 },
  { value: "0.19", x: 50, y: 79 },
  { value: "0.56", x: 32.3, y: 70.5 },
  { value: "0.81", x: 25, y: 50 },
  { value: "0.62", x: 32.3, y: 29.5 },
];

function SpipPairConnect({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: TestQuestion;
}) {
  const selectedNode = answerText(answer, "_selectedNode");
  const pairs = question.type === "multiText" ? question.fields : [];
  const pairLines = pairs.flatMap((field) => {
    const pair = parsePairValue(answerText(answer, field.id));
    if (pair.length !== 2) return [];
    const start = pairNodes.find((node) => node.value === pair[0]);
    const end = pairNodes.find((node) => node.value === pair[1]);
    return start && end ? [{ key: field.id, start, end }] : [];
  });

  function clickNode(value: string) {
    if (!selectedNode) {
      setAnswerPart(answer, onChange, "_selectedNode", value);
      return;
    }
    if (selectedNode === value) {
      setAnswerPart(answer, onChange, "_selectedNode", "");
      return;
    }
    const next = { ...answer, _selectedNode: "" };
    assignConnectedPair(next, selectedNode, value);
    onChange(next);
  }

  return (
    <div className="spip-pair-connect">
      <div className="spip-pair-board">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${spipMathAssets}/spip-y7m-q1-number-pairs.png`} alt="Decimals arranged around lines to be paired" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {pairLines.map((line) => (
            <line className="spip-pair-line" key={line.key} x1={line.start.x} y1={line.start.y} x2={line.end.x} y2={line.end.y} />
          ))}
        </svg>
        {pairNodes.map((node) => (
          <button
            aria-label={`Connection point for ${node.value}`}
            className={`spip-pair-node ${selectedNode === node.value ? "is-selected" : ""}`}
            key={node.value}
            onClick={() => clickNode(node.value)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            type="button"
          >
            <span className="visually-hidden">{node.value}</span>
          </button>
        ))}
      </div>
      <div className="spip-pair-summary">
        {pairs.map((field) => <span key={field.id}>{answerText(answer, field.id) || "Click two decimals"}</span>)}
      </div>
    </div>
  );
}

function parsePairValue(value: string) {
  return value.trim().split(/\s*(?:\+|,)\s*/).filter(Boolean);
}

function assignConnectedPair(answer: Record<string, string | string[]>, first: string, second: string) {
  const values = [first, second].sort();
  const pairId = correctPairId(values) || ["p1", "p2", "p3", "p4"].find((id) => !answerText(answer, id)) || "p1";
  for (const id of ["p1", "p2", "p3", "p4"]) {
    const pair = parsePairValue(answerText(answer, id)).sort();
    if (pair.includes(first) || pair.includes(second)) answer[id] = "";
  }
  answer[pairId] = `${first} + ${second}`;
}

function correctPairId(values: string[]) {
  const map: Record<string, string> = {
    "0.38,0.62": "p1",
    "0.25,0.75": "p2",
    "0.19,0.81": "p3",
    "0.44,0.56": "p4",
  };
  return map[values.join(",")] || "";
}

function SpipScienceNumberedLabels({
  answer,
  labelPositions,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  labelPositions: Array<{ id: string; x: number; y: number }>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  const visual = question.visuals?.find((item) => item.type === "image");
  return (
    <div className="science-numbered-layout">
      {visual && visual.type === "image" ? (
        <figure className="question-figure science-numbered-figure" style={{ maxWidth: visual.maxWidth || 560 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={visual.src} alt={visual.alt} />
          {labelPositions.map((position, index) => (
            <span className="science-figure-number" key={position.id} style={{ left: `${position.x}%`, top: `${position.y}%` }}>
              {index + 1}
            </span>
          ))}
        </figure>
      ) : null}
      <div className={`field-grid ${question.compact ? "compact-lines" : ""}`}>
        {labelPositions.map((position, index) => {
          const field = findField(question, position.id);
          return <MathField answer={answer} field={{ ...field, label: String(index + 1) }} key={position.id} onChange={onChange} />;
        })}
      </div>
    </div>
  );
}

function SpipScienceTapResults({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="science-table-task">
      <div>
        <h5>Aiko&apos;s measurements</h5>
        <SimpleDataTable
          headers={["Tap", "Volume collected (cm3)"]}
          rows={[
            ["4", "3.8"],
            ["3", "2.9"],
            ["2", "1.8"],
            ["5", "3.3"],
            ["1", "0.0"],
          ]}
        />
      </div>
      <div>
        <h5>Complete the table</h5>
        <div className="spip-data-table-wrap">
          <table className="spip-data-table science-answer-table">
            <thead>
              <tr>
                <th>Tap number</th>
                <th>Volume collected (cm3)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><MathInput answer={answer} field={findField(question, "tap1_volume")} onChange={onChange} /></td>
              </tr>
              <tr>
                <td><MathInput answer={answer} field={findField(question, "tap2_number")} onChange={onChange} /></td>
                <td>1.8</td>
              </tr>
              <tr>
                <td>3</td>
                <td><MathInput answer={answer} field={findField(question, "tap3_volume")} onChange={onChange} /></td>
              </tr>
              <tr>
                <td><MathInput answer={answer} field={findField(question, "tap4_number")} onChange={onChange} /></td>
                <td><MathInput answer={answer} field={findField(question, "tap4_volume")} onChange={onChange} /></td>
              </tr>
              <tr>
                <td>5</td>
                <td><MathInput answer={answer} field={findField(question, "tap5_volume")} onChange={onChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SpipTranslation({ answer, onChange }: { answer: Record<string, string | string[]>; onChange: (value: Record<string, string | string[]>) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragStart, setDragStart] = useState<{ gridX: number; gridY: number; dx: number; dy: number } | null>(null);
  const dx = Number(answerText(answer, "dx") || 0);
  const dy = Number(answerText(answer, "dy") || 0);
  function move(nextDx: number, nextDy: number) {
    const clampedDx = clamp(nextDx, -8, 4);
    const clampedDy = clamp(nextDy, -2, 8);
    onChange({
      ...answer,
      dx: String(clampedDx),
      dy: String(clampedDy),
      notes: `Moved ${Math.abs(clampedDx)} ${clampedDx < 0 ? "left" : "right"} and ${Math.abs(clampedDy)} ${clampedDy < 0 ? "down" : "up"}`,
    });
  }
  function pointerToGrid(event: ReactPointerEvent<SVGElement>) {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = -0.9 + ((event.clientX - rect.left) / rect.width) * 14.8;
    const y = -0.9 + ((event.clientY - rect.top) / rect.height) * 14.8;
    return { x, y };
  }
  function startDrag(event: ReactPointerEvent<SVGGElement>) {
    const point = pointerToGrid(event);
    if (!point) return;
    svgRef.current?.setPointerCapture(event.pointerId);
    setDragStart({ gridX: point.x, gridY: point.y, dx, dy });
  }
  function drag(event: ReactPointerEvent<SVGSVGElement>) {
    if (!dragStart) return;
    const point = pointerToGrid(event);
    if (!point) return;
    move(Math.round(dragStart.dx + point.x - dragStart.gridX), Math.round(dragStart.dy - (point.y - dragStart.gridY)));
  }
  function stopDrag(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragStart(null);
  }
  const axisTicks = Array.from({ length: 14 }, (_, index) => index);
  return (
    <div className="spip-translation">
      <svg
        ref={svgRef}
        onPointerCancel={stopDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        viewBox="-0.9 -0.9 14.8 14.8"
        role="img"
        aria-label="Coordinate grid with draggable triangle A"
      >
        {Array.from({ length: 14 }, (_, index) => (
          <g key={index}>
            <line className="spip-grid-line" x1={index} y1={0} x2={index} y2={13} />
            <line className="spip-grid-line" x1={0} y1={index} x2={13} y2={index} />
          </g>
        ))}
        <line className="spip-axis" x1="6" y1="0" x2="6" y2="13" />
        <line className="spip-axis" x1="0" y1="6" x2="13" y2="6" />
        <text x="13.45" y="6.5" className="spip-axis-title">x</text>
        <text x="6.25" y="0.5" className="spip-axis-title">y</text>
        {axisTicks.map((tick) => {
          const xLabel = tick - 6;
          const yLabel = 6 - tick;
          return (
            <g key={tick}>
              {xLabel !== 0 ? <text x={tick - 0.12} y="6.48" className="spip-axis-label">{xLabel}</text> : null}
              {yLabel !== 0 ? <text x="5.55" y={tick + 0.12} className="spip-axis-label">{yLabel}</text> : null}
            </g>
          );
        })}
        <polygon points="8,8 7,11 9,11" className="spip-given-shape" />
        <text x="8.18" y="8.05" className="spip-shape-label">A</text>
        <g
          aria-label="Move answer triangle A"
          className={`spip-student-group ${dragStart ? "is-dragging" : ""}`}
          onPointerDown={startDrag}
          role="button"
          tabIndex={0}
          transform={`translate(${dx} ${-dy})`}
        >
          <polygon points="8,8 7,11 9,11" className="spip-student-shape" />
          <text x="8.18" y="8.05" className="spip-shape-label spip-student-label">A</text>
        </g>
      </svg>
    </div>
  );
}

function SpipLargestPairs({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="spip-largest-table">
      {question.fields.map((field) => {
        const choices = field.label.split(" or ");
        return (
          <div className="spip-largest-row" key={field.id}>
            {choices.map((choice) => (
              <button
                className={answerText(answer, field.id) === choice ? "is-selected" : ""}
                key={choice}
                onClick={() => setAnswerPart(answer, onChange, field.id, choice)}
                type="button"
              >
                {choice}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const scaleDial = { centerX: 50, centerY: 92.3, radiusX: 46.5, radiusY: 86.7 };

function SpipScale({
  answer,
  onChange,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: TestQuestion;
}) {
  const value = parseScaleValue(answerText(answer, "answer"));
  const arrow = Number.isFinite(value) ? scaleArrow(value) : null;
  function choose(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const normalizedX = (x - scaleDial.centerX) / scaleDial.radiusX;
    const normalizedY = (scaleDial.centerY - y) / scaleDial.radiusY;
    const angle = Math.atan2(normalizedY, normalizedX) * 180 / Math.PI;
    const nextValue = clamp((180 - clamp(angle, 0, 180)) / 180 * 20, 0, 20);
    const snappedValue = Math.round(nextValue * 2) / 2;
    setAnswerPart(answer, onChange, "answer", `${formatNumber(snappedValue)} kg`);
  }
  return (
    <div className="spip-scale-layout">
      <figure className="question-figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${spipMathAssets}/spip-y7m-q7-digital-scale.png`} alt="Digital scale reading 16 500 g" />
      </figure>
      <div className="spip-scale-click" onClick={choose} role="button" tabIndex={0}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${spipMathAssets}/spip-y7m-q7-kg-scale.png`} alt="Blank kilogram scale" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {arrow ? <line className="spip-scale-arrow" x1={scaleDial.centerX} y1={scaleDial.centerY} x2={arrow.x} y2={arrow.y} /> : null}
        </svg>
        <span>{Number.isFinite(value) ? `${formatNumber(value)} kg` : "Click the scale"}</span>
      </div>
    </div>
  );
}

function parseScaleValue(value: string) {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function scaleArrow(value: number) {
  const clamped = clamp(value, 0, 20);
  const angle = (180 - (clamped / 20) * 180) * Math.PI / 180;
  return {
    x: scaleDial.centerX + scaleDial.radiusX * Math.cos(angle),
    y: scaleDial.centerY - scaleDial.radiusY * Math.sin(angle),
  };
}

function SpipRunnerTable({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  const rows = [
    ["Angelique", "15.23"],
    ["Gabriella", "14.05"],
    ["Aiko", "15.3"],
    ["Manjit", "14.5"],
    ["Blessy", "14.65"],
  ];
  return (
    <>
      <SimpleDataTable headers={["Runner", "Time in seconds"]} rows={rows} />
      <FieldGrid answer={answer} onChange={onChange} question={question} />
    </>
  );
}

function SpipStampChoices({ answer, onChange }: { answer: Record<string, string | string[]>; onChange: (value: Record<string, string | string[]>) => void; question: TestQuestion }) {
  const selected = answerText(answer, "selected").split(",").filter(Boolean);
  const choices = ["a", "b", "c", "d"];
  function toggle(choice: string) {
    const next = new Set(selected);
    if (next.has(choice)) next.delete(choice);
    else next.add(choice);
    setAnswerPart(answer, onChange, "selected", Array.from(next).sort().join(","));
  }
  return (
    <div className="spip-stamp-layout">
      <figure className="question-figure spip-stamp-reference">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${spipMathAssets}/spip-y7m-q9-stamp.png`} alt="Stamp and shape" />
      </figure>
      <div className="spip-stamp-choices">
        {choices.map((choice, index) => (
          <button aria-label={`Pattern ${choice.toUpperCase()}`} className={selected.includes(choice) ? "is-selected" : ""} key={choice} onClick={() => toggle(choice)} type="button">
            <span className="spip-stamp-choice-image" style={{ backgroundPosition: `${index * 33.3333}% 50%` }} />
            <span className="spip-stamp-choice-label">{choice.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SpipFractionBoxes({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="spip-fraction-layout">
      <p><MathInput answer={answer} field={findField(question, "a")} onChange={onChange} /> <span className="frac"><span>7</span><span>10</span></span> = <span className="frac"><span>17</span><span>10</span></span></p>
      <p>2 <span className="frac"><span>1</span><span>4</span></span> = <span className="frac"><MathInput answer={answer} field={findField(question, "b")} onChange={onChange} /><span>4</span></span></p>
      <p><MathInput answer={answer} field={findField(question, "c")} onChange={onChange} /> <span className="frac"><span>2</span><span>5</span></span> = <span className="frac"><span>17</span><span>5</span></span></p>
      <p>3 <span className="frac"><span>1</span><span>2</span></span> = <span className="frac"><MathInput answer={answer} field={findField(question, "d")} onChange={onChange} /><span>2</span></span></p>
    </div>
  );
}

function SpipLikelihood({ answer, onChange }: { answer: Record<string, string | string[]>; onChange: (value: Record<string, string | string[]>) => void }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const selectedSource = answerText(answer, "_likelihoodSource");
  const matchesText = answerText(answer, "matches");
  const matches = useMemo(() => parseMatches(matchesText), [matchesText]);
  const sources = [
    { id: "multiple4", label: "The number is a multiple of 4", x: 22, y: 25.5, example: true },
    { id: "digits4", label: "The number has 4 digits.", x: 50, y: 25.5 },
    { id: "odd", label: "The number is odd.", x: 78, y: 25.5 },
  ];
  const targets = [
    { id: "impossible", label: "impossible", x: 10, y: 74.5 },
    { id: "unlikely", label: "unlikely", x: 30, y: 74.5 },
    { id: "even", label: "even chance", x: 50, y: 74.5 },
    { id: "likely", label: "likely", x: 70, y: 74.5 },
    { id: "certain", label: "certain", x: 90, y: 74.5 },
  ];
  const linePairs = useMemo(() => [
    { sourceId: "multiple4", targetId: "unlikely", example: true },
    ...Object.entries(matches).map(([sourceId, targetId]) => ({ sourceId, targetId, example: false })),
  ], [matches]);
  const [measuredLines, setMeasuredLines] = useState<Array<{ key: string; example: boolean; x1: number; y1: number; x2: number; y2: number }>>([]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const boardElement = board;
    let frame = 0;

    function measureLines() {
      const boardRect = boardElement.getBoundingClientRect();
      if (!boardRect.width || !boardRect.height) return;
      const nextLines = linePairs.flatMap((pair) => {
        const source = boardElement.querySelector<HTMLElement>(`[data-likelihood-source="${pair.sourceId}"]`);
        const target = boardElement.querySelector<HTMLElement>(`[data-likelihood-target="${pair.targetId}"]`);
        if (!source || !target) return [];
        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        return [{
          key: `${pair.sourceId}-${pair.targetId}`,
          example: pair.example,
          x1: ((sourceRect.left + sourceRect.width / 2 - boardRect.left) / boardRect.width) * 100,
          y1: ((sourceRect.bottom - boardRect.top) / boardRect.height) * 100,
          x2: ((targetRect.left + targetRect.width / 2 - boardRect.left) / boardRect.width) * 100,
          y2: ((targetRect.top - boardRect.top) / boardRect.height) * 100,
        }];
      });
      setMeasuredLines(nextLines);
    }

    function scheduleMeasure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measureLines);
    }

    scheduleMeasure();
    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(boardElement);
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [linePairs]);

  function chooseTarget(targetId: string) {
    if (!selectedSource) return;
    const next = { ...matches };
    for (const [source, target] of Object.entries(next)) {
      if (target === targetId) delete next[source];
    }
    next[selectedSource] = targetId;
    onChange({ ...answer, matches: stringifyMatches(next), _likelihoodSource: "" });
  }
  return (
    <div className="spip-likelihood-layout">
      <p>Draw a line to match the outcome to its likelihood. The first one has been done for you.</p>
      <div className="spip-likelihood-board" ref={boardRef}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {measuredLines.map((line) => (
            <line className={`spip-likelihood-line ${line.example ? "is-example" : ""}`} key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          ))}
        </svg>
        {sources.map((source) => (
          <button
            className={`${source.example ? "is-example" : ""} ${selectedSource === source.id ? "is-selected" : ""}`}
            data-likelihood-source={source.id}
            disabled={source.example}
            key={source.id}
            onClick={() => setAnswerPart(answer, onChange, "_likelihoodSource", source.id)}
            style={{ left: `${source.x}%`, top: `${source.y}%` }}
            type="button"
          >
            {source.label}
          </button>
        ))}
        {targets.map((target) => (
          <button className="target" data-likelihood-target={target.id} key={target.id} onClick={() => chooseTarget(target.id)} style={{ left: `${target.x}%`, top: `${target.y}%` }} type="button">
            {target.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function parseMatches(value: string) {
  return value.split(",").reduce<Record<string, string>>((matches, pair) => {
    const [source, target] = pair.split(":").map((item) => item.trim());
    if (source && target) matches[source] = target;
    return matches;
  }, {});
}

function stringifyMatches(matches: Record<string, string>) {
  return Object.entries(matches).map(([source, target]) => `${source}:${target}`).join(",");
}

function SpipSportsCheckboxes({ answer, onChange }: { answer: Record<string, string | string[]>; onChange: (value: Record<string, string | string[]>) => void }) {
  const choices = ["Ahmed", "Carlos", "Hassan", "Mike", "Rajiv", "Youssef"];
  const selected = answerText(answer, "selected").split(",").filter(Boolean);
  function toggle(choice: string) {
    const value = choice.toLowerCase();
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setAnswerPart(answer, onChange, "selected", Array.from(next).sort().join(","));
  }
  return (
    <div className="spip-sports-answer">
      <SimpleDataTable
        headers={["", "Mon", "Tues", "Wed", "Thurs"]}
        rows={[
          ["Running", "Mike, Carlos", "Rajiv", "Hassan", "Youssef, Mike"],
          ["Tennis", "", "Ahmed", "Carlos, Mike", "Hassan"],
          ["Swimming", "Hassan", "Youssef", "Rajiv", "Ahmed"],
        ]}
      />
      <div className="spip-check-grid">
        {choices.map((choice) => (
          <label key={choice}>
            <input checked={selected.includes(choice.toLowerCase())} onChange={() => toggle(choice)} type="checkbox" />
            <span>{choice}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SpipMultiplicationGrid({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <table className="spip-math-grid-table">
      <tbody>
        <tr><th>x</th><th>0.3</th><th>0.1</th><th>0.6</th><th><MathInput answer={answer} field={findField(question, "b")} onChange={onChange} /></th></tr>
        <tr><th>7</th><td>2.1</td><td>0.7</td><td>4.2</td><td /></tr>
        <tr><th>4</th><td><MathInput answer={answer} field={findField(question, "a")} onChange={onChange} /></td><td>0.4</td><td><MathInput answer={answer} field={findField(question, "c")} onChange={onChange} /></td><td>1.6</td></tr>
        <tr><th /><td /><td><MathInput answer={answer} field={findField(question, "d")} onChange={onChange} /></td><td /><td /></tr>
      </tbody>
    </table>
  );
}

function SpipSequenceBoxes({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="spip-sequence-layout">
      <MathInput answer={answer} field={findField(question, "a")} onChange={onChange} />
      <span>180</span><span>105</span><span>30</span>
      <MathInput answer={answer} field={findField(question, "b")} onChange={onChange} />
    </div>
  );
}

function SpipColumnAddition({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="spip-column-addition">
      <p>3 . <MathInput answer={answer} field={findField(question, "top")} onChange={onChange} /> 8</p>
      <p>+ <MathInput answer={answer} field={findField(question, "bottomLeft")} onChange={onChange} /> . 0 <MathInput answer={answer} field={findField(question, "bottomRight")} onChange={onChange} /></p>
      <hr />
      <p>5 . 6 3</p>
    </div>
  );
}

function SpipOperationBoxes({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="spip-operation-layout">
      <p><strong>(a)</strong> <span>745.03</span> <b>x 10</b> <MathInput answer={answer} field={findField(question, "a")} onChange={onChange} /></p>
      <p><strong>(b)</strong> <MathInput answer={answer} field={findField(question, "b")} onChange={onChange} /> <b>x 100</b> <span>60 319</span></p>
    </div>
  );
}

function SpipOrderBoxes({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return (
    <div className="spip-order-layout">
      <div><span>0.65</span><span>2/3</span><span>0.57</span><span>3/5</span></div>
      {question.fields.map((field) => <MathField answer={answer} field={field} key={field.id} onChange={onChange} />)}
    </div>
  );
}

function SpipThreeBoxes({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return <div className="spip-three-boxes">{question.fields.map((field) => <MathInput answer={answer} field={field} key={field.id} onChange={onChange} />)}</div>;
}

function SpipReflection({ answer, onChange }: { answer: Record<string, string | string[]>; onChange: (value: Record<string, string | string[]>) => void }) {
  const selected = new Set(answerText(answer, "cells").split(",").filter(Boolean));
  const fixed = new Set(["8-5", "9-5", "10-5", "10-6", "11-6", "11-7"]);
  function toggle(cell: string) {
    if (fixed.has(cell)) return;
    const next = new Set(selected);
    if (next.has(cell)) next.delete(cell);
    else next.add(cell);
    setAnswerPart(answer, onChange, "cells", Array.from(next).sort().join(","));
  }
  return (
    <div className="spip-reflection-tool">
      <div className="spip-reflection-wrap">
        <div className="spip-reflection-grid">
          {Array.from({ length: 12 }, (_, row) => Array.from({ length: 15 }, (_item, col) => {
            const id = `${col}-${row}`;
            return (
              <button
                aria-label={`Grid cell ${id}`}
                className={`${fixed.has(id) ? "is-fixed" : ""} ${selected.has(id) ? "is-selected" : ""}`}
                key={id}
                onClick={() => toggle(id)}
                type="button"
              />
            );
          }))}
        </div>
        <span>mirror line</span>
        <svg viewBox="0 0 15 12" aria-hidden="true" focusable="false"><line x1="1" y1="12" x2="13" y2="0" /></svg>
      </div>
      <p>Click cells to place the reflected shape. This item is teacher reviewed.</p>
    </div>
  );
}

function FieldGrid({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: Extract<TestQuestion, { type: "multiText" }>;
}) {
  return <div className={`field-grid ${question.compact ? "compact-lines" : ""}`}>{question.fields.map((field) => <MathField answer={answer} field={field} key={field.id} onChange={onChange} />)}</div>;
}

function SimpleDataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="spip-data-table-wrap">
      <table className="spip-data-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/0+$/, "").replace(/\.$/, "");
}

function RawMathVisual({ html }: { html: string }) {
  return <div className="math-visual generated-visual" dangerouslySetInnerHTML={{ __html: html }} />;
}

function MathField({
  answer,
  field,
  onChange,
}: {
  answer: Record<string, string | string[]>;
  field: { id: string; label: string; placeholder?: string; visualHtml?: string };
  onChange: (value: Record<string, string | string[]>) => void;
}) {
  return (
    <label className={field.visualHtml ? "has-field-visual" : ""}>
      {field.visualHtml ? <span className="math-field-visual" dangerouslySetInnerHTML={{ __html: field.visualHtml }} /> : null}
      <span>{field.label}</span>
      <MathInput answer={answer} field={field} onChange={onChange} />
    </label>
  );
}

function MathInput({
  answer,
  field,
  onChange,
}: {
  answer: Record<string, string | string[]>;
  field: { id: string; label: string; placeholder?: string };
  onChange: (value: Record<string, string | string[]>) => void;
}) {
  const value = answer[field.id];
  return (
    <input
      autoComplete="off"
      className="math-line-input"
      onChange={(event) => onChange({ ...answer, [field.id]: event.target.value })}
      placeholder={field.placeholder || "answer"}
      value={typeof value === "string" ? value : ""}
    />
  );
}

function findField(question: Extract<TestQuestion, { type: "multiText" }>, fieldId: string) {
  return question.fields.find((field) => field.id === fieldId) || { id: fieldId, label: fieldId };
}

export function QuestionVisuals({ visuals }: { visuals: NonNullable<TestQuestion["visuals"]> }) {
  return (
    <div className="question-visuals">
      {visuals.map((visual, index) => {
        if (visual.type === "image") {
          return (
            <figure className="question-figure" key={`${visual.src}-${index}`} style={{ maxWidth: visual.maxWidth || 520 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={visual.src} alt={visual.alt} />
            </figure>
          );
        }
        if (visual.type === "pictograph") return <ColourPictograph key={index} />;
        if (visual.type === "clock") return <ClockCard hour={visual.hour} key={`${visual.label}-${index}`} label={visual.label} minute={visual.minute} />;
        return <SolidFacesVisual key={index} />;
      })}
    </div>
  );
}

function ClockCard({ hour, label, minute }: { hour: number; label: string; minute: number }) {
  const hAngle = ((hour % 12) + minute / 60) * 30;
  const mAngle = minute * 6;
  const hX = 130 + Math.sin(hAngle * Math.PI / 180) * 34;
  const hY = 96 - Math.cos(hAngle * Math.PI / 180) * 34;
  const mX = 130 + Math.sin(mAngle * Math.PI / 180) * 46;
  const mY = 96 - Math.cos(mAngle * Math.PI / 180) * 46;
  return (
    <svg className="diagram-svg clock-card" viewBox="0 0 260 230" role="img" aria-label={`Clock showing ${label}`}>
      <rect width="260" height="230" fill="#fff" />
      <circle cx="130" cy="96" r="62" fill="#fff" stroke="#213b4d" strokeWidth="4" />
      <text x="130" y="54" textAnchor="middle" fontSize="14" fontWeight="900">12</text>
      <text x="172" y="101" textAnchor="middle" fontSize="14" fontWeight="900">3</text>
      <text x="130" y="146" textAnchor="middle" fontSize="14" fontWeight="900">6</text>
      <text x="88" y="101" textAnchor="middle" fontSize="14" fontWeight="900">9</text>
      <line x1="130" y1="96" x2={hX} y2={hY} stroke="#213b4d" strokeWidth="5" strokeLinecap="round" />
      <line x1="130" y1="96" x2={mX} y2={mY} stroke="#213b4d" strokeWidth="4" strokeLinecap="round" />
      <text x="130" y="205" textAnchor="middle" fontSize="22" fontWeight="900">{label}</text>
    </svg>
  );
}

function ColourPictograph() {
  const rows = [
    ["Blue", 4, "#60a5fa"],
    ["Red", 3, "#ef4444"],
    ["Yellow", 6, "#facc15"],
    ["Green", 8, "#22c55e"],
  ] as const;
  return (
    <svg className="diagram-svg" viewBox="0 0 720 310" role="img" aria-label="Pictograph of pupils' favourite colours">
      <rect width="720" height="310" fill="#fff" />
      <g transform="translate(72 31) scale(0.8)">
        <rect x="30" y="25" width="660" height="240" fill="#fff" stroke="#213b4d" strokeWidth="3" />
        <line x1="180" y1="25" x2="180" y2="265" stroke="#213b4d" strokeWidth="3" />
        {rows.map((row, i) => (
          <g key={row[0]}>
            <line x1="30" y1={85 + i * 60} x2="690" y2={85 + i * 60} stroke="#213b4d" strokeWidth="2" />
            <text x="58" y={65 + i * 60} fontSize="19" fontWeight="900">{row[0]}</text>
            {Array.from({ length: row[1] }, (_, j) => (
              <circle key={j} cx={215 + j * 44} cy={57 + i * 60} r="12" fill={row[2]} stroke="#213b4d" strokeWidth="2" />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

function SolidFacesVisual() {
  return (
    <svg className="diagram-svg solid-faces-visual" viewBox="0 0 650 250" role="img" aria-label="Brick and cheese solid faces">
      <rect width="650" height="250" fill="#fff" />
      <g transform="translate(110 55)">
        <path d="M0 50h130v75H0z" fill="#fff" stroke="#213b4d" strokeWidth="4" />
        <path d="M130 50l58-36v75l-58 36z" fill="#e9fbf8" stroke="#213b4d" strokeWidth="4" />
        <path d="M0 50l58-36h130l-58 36z" fill="#ffd6a5" stroke="#213b4d" strokeWidth="4" />
      </g>
      <g transform="translate(410 55)">
        <path d="M0 125L130 20v105z" fill="#f7c873" stroke="#213b4d" strokeWidth="4" />
        <path d="M130 20l54 32v73h-54z" fill="#fff7df" stroke="#213b4d" strokeWidth="4" />
      </g>
    </svg>
  );
}
