"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import type { TestQuestion } from "@/features/tests/lib/types";

type AnswerMap = Record<string, string | string[]>;
type Point = { x: number; y: number };
type DrawingMode = "outline" | "core" | "pip";

const drawingLabels: Record<DrawingMode, string> = {
  outline: "Outer outline",
  core: "Core section",
  pip: "Pip detail",
};

export function BiologicalDrawingEditor({
  answer,
  onChange,
  question,
}: {
  answer: AnswerMap;
  onChange: (value: AnswerMap) => void;
  question: Extract<TestQuestion, { type: "biologicalDrawing" }>;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const strokeBuffer = useRef<Point[]>([]);
  const [mode, setMode] = useState<DrawingMode>("outline");
  const [drawing, setDrawing] = useState(false);
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  const strokes = readStrokes(answer.strokes);

  function eventPoint(event: ReactPointerEvent<HTMLDivElement>) {
    return normalizedEventPoint(event, boardRef.current);
  }

  function writeStroke(points: Point[]) {
    const encoded = `${mode}:${points.map(formatPoint).join(";")}`;
    const existing = Array.isArray(answer.strokes) ? answer.strokes : [];
    onChange({ ...answer, strokes: [...existing, encoded] });
  }

  function begin(event: ReactPointerEvent<HTMLDivElement>) {
    const point = eventPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    strokeBuffer.current = [point];
    setDraftPoints([point]);
    setDrawing(true);
  }

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drawing) return;
    const point = eventPoint(event);
    if (!point) return;
    const previous = strokeBuffer.current.at(-1);
    if (previous && distance(previous, point) < 0.004) return;
    strokeBuffer.current = [...strokeBuffer.current, point].slice(-240);
    setDraftPoints(strokeBuffer.current);
  }

  function finish() {
    if (drawing && strokeBuffer.current.length > 1) writeStroke(strokeBuffer.current);
    strokeBuffer.current = [];
    setDraftPoints([]);
    setDrawing(false);
  }

  function undo() {
    const existing = Array.isArray(answer.strokes) ? answer.strokes : [];
    onChange({ ...answer, strokes: existing.slice(0, -1) });
  }

  return (
    <div className="practical-editor biological-drawing-editor">
      <div className="biological-drawing-layout">
        <figure className="biological-reference">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={question.referenceAlt} src={question.referenceSrc} />
          <figcaption>Specimen reference</figcaption>
        </figure>
        <div>
          <div className="practical-tool-row" aria-label="Biological drawing tools">
            {(Object.keys(drawingLabels) as DrawingMode[]).map((value) => (
              <button className={mode === value ? "is-active" : ""} key={value} onClick={() => setMode(value)} type="button">
                {drawingLabels[value]}
              </button>
            ))}
          </div>
          <p className="ray-tool-status">Draw one large, clear outline, then add the five core sections and pip details.</p>
          <div
            aria-label="Biological drawing canvas"
            className="biological-drawing-board"
            onPointerCancel={finish}
            onPointerDown={begin}
            onPointerMove={move}
            onPointerUp={finish}
            ref={boardRef}
            role="application"
            style={{ aspectRatio: question.canvasAspectRatio || 4 / 3 }}
          >
            <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1000 750">
              {strokes.map((stroke, index) => (
                <polyline
                  className={`biological-stroke biological-stroke-${stroke.mode}`}
                  key={`${stroke.mode}-${index}`}
                  points={stroke.points.map((point) => `${point.x * 1000},${point.y * 750}`).join(" ")}
                />
              ))}
              {drawing && draftPoints.length > 1 ? (
                <polyline
                  className={`biological-stroke biological-stroke-${mode}`}
                  points={draftPoints.map((point) => `${point.x * 1000},${point.y * 750}`).join(" ")}
                />
              ) : null}
            </svg>
          </div>
          <div className="practical-icon-actions">
            <button aria-label="Undo last stroke" disabled={!strokes.length} onClick={undo} title="Undo last stroke" type="button"><RotateCcw size={18} /></button>
            <button aria-label="Clear drawing" disabled={!strokes.length} onClick={() => onChange({})} title="Clear drawing" type="button"><Trash2 size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PracticalGraphEditor({
  answer,
  onChange,
  question,
}: {
  answer: AnswerMap;
  onChange: (value: AnswerMap) => void;
  question: Extract<TestQuestion, { type: "practicalGraph" }>;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("p0");
  const [dragging, setDragging] = useState<string | null>(null);
  const plot = { left: 0.13, right: 0.95, top: 0.07, bottom: 0.87 };
  const xQuantity = stringValue(answer.xQuantity);
  const xUnit = stringValue(answer.xUnit);
  const yQuantity = stringValue(answer.yQuantity);
  const yUnit = stringValue(answer.yUnit);
  const xMaxValue = stringValue(answer.xMax);
  const yMaxValue = stringValue(answer.yMax);
  const xMax = Number(xMaxValue) || 60;
  const yMax = Number(yMaxValue) || 30;
  const points = question.data.map((_, index) => readPoint(answer[`p${index}`]));
  const lineStart = readPoint(answer.lineStart);
  const lineEnd = readPoint(answer.lineEnd);

  useEffect(() => {
    const firstMissing = points.findIndex((point) => !point);
    if (firstMissing >= 0) setActive(`p${firstMissing}`);
  // Deliberately react only when the serialized answer changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  function writeSelect(key: string, value: string) {
    onChange({ ...answer, [key]: value });
  }

  function eventPoint(event: ReactPointerEvent<HTMLDivElement>) {
    return normalizedEventPoint(event, boardRef.current);
  }

  function nearestHandle(point: Point) {
    const handles = [
      ...points.map((value, index) => ({ key: `p${index}`, value })),
      { key: "lineStart", value: lineStart },
      { key: "lineEnd", value: lineEnd },
    ].filter((item): item is { key: string; value: Point } => Boolean(item.value));
    return handles.reduce<{ key: string; value: Point } | null>((best, item) => {
      if (distance(item.value, point) > 0.045) return best;
      return !best || distance(item.value, point) < distance(best.value, point) ? item : best;
    }, null);
  }

  function begin(event: ReactPointerEvent<HTMLDivElement>) {
    const point = eventPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const nearest = nearestHandle(point);
    const key = nearest?.key || active;
    setDragging(key);
    onChange({ ...answer, [key]: formatPoint(clampToPlot(point, plot)) });
  }

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const point = eventPoint(event);
    if (!point) return;
    onChange({ ...answer, [dragging]: formatPoint(clampToPlot(point, plot)) });
  }

  return (
    <div className="practical-editor practical-graph-editor">
      <div className="graph-axis-controls">
        <GraphSelect label="Horizontal quantity" value={xQuantity} onChange={(value) => writeSelect("xQuantity", value)} options={["time taken", "volume of gas collected"]} />
        <GraphSelect label="Horizontal unit" value={xUnit} onChange={(value) => writeSelect("xUnit", value)} options={["s", "cm3"]} />
        <GraphSelect label="Horizontal maximum" value={xMaxValue} onChange={(value) => writeSelect("xMax", value)} options={question.scaleOptions.map(String)} />
        <GraphSelect label="Vertical quantity" value={yQuantity} onChange={(value) => writeSelect("yQuantity", value)} options={["volume of gas collected", "time taken"]} />
        <GraphSelect label="Vertical unit" value={yUnit} onChange={(value) => writeSelect("yUnit", value)} options={["cm3", "s"]} />
        <GraphSelect label="Vertical maximum" value={yMaxValue} onChange={(value) => writeSelect("yMax", value)} options={question.scaleOptions.map(String)} />
      </div>
      <div className="practical-tool-row practical-graph-tools" aria-label="Graph plotting tools">
        {question.data.map((datum, index) => (
          <button className={active === `p${index}` ? "is-active" : ""} key={datum.label} onClick={() => setActive(`p${index}`)} type="button">
            {datum.label}
          </button>
        ))}
        <button
          className={active === "lineStart" || active === "lineEnd" ? "is-active" : ""}
          onClick={() => setActive(lineStart && !lineEnd ? "lineEnd" : "lineStart")}
          type="button"
        >
          Best-fit line
        </button>
      </div>
      <p className="ray-tool-status">Choose a point, place it on the grid, and drag it to adjust. Place both endpoints for the best-fit line.</p>
      <div
        aria-label="Practical graph plotting grid"
        className="practical-graph-board"
        onPointerCancel={() => setDragging(null)}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={() => {
          if (dragging === "lineStart") setActive("lineEnd");
          setDragging(null);
        }}
        ref={boardRef}
        role="application"
      >
        <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1000 700">
          <GraphGrid plot={plot} xMax={xMax} yMax={yMax} />
          <text className="graph-axis-label graph-axis-label-x" x="540" y="680">{xQuantity || "horizontal quantity"} / {xUnit || "unit"}</text>
          <text className="graph-axis-label graph-axis-label-y" transform="rotate(-90 25 350)" x="25" y="350">{yQuantity || "vertical quantity"} / {yUnit || "unit"}</text>
          {points.map((point, index) => point ? (
            <g key={question.data[index].label}>
              <line className="graph-point-mark" x1={point.x * 1000 - 9} x2={point.x * 1000 + 9} y1={point.y * 700 - 9} y2={point.y * 700 + 9} />
              <line className="graph-point-mark" x1={point.x * 1000 - 9} x2={point.x * 1000 + 9} y1={point.y * 700 + 9} y2={point.y * 700 - 9} />
            </g>
          ) : null)}
          {lineStart && lineEnd ? <line className="graph-best-fit-line" x1={lineStart.x * 1000} x2={lineEnd.x * 1000} y1={lineStart.y * 700} y2={lineEnd.y * 700} /> : null}
          {lineStart ? <circle className="graph-drag-handle" cx={lineStart.x * 1000} cy={lineStart.y * 700} r="7" /> : null}
          {lineEnd ? <circle className="graph-drag-handle" cx={lineEnd.x * 1000} cy={lineEnd.y * 700} r="7" /> : null}
        </svg>
      </div>
      <button className="ray-clear-button" onClick={() => onChange({})} type="button">Clear graph</button>
    </div>
  );
}

export function VirtualMeasurementEditor({
  answer,
  onChange,
  question,
}: {
  answer: AnswerMap;
  onChange: (value: AnswerMap) => void;
  question: Extract<TestQuestion, { type: "virtualMeasurement" }>;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(question.measurements[0]?.id || "");
  const [dragging, setDragging] = useState<string | null>(null);

  function eventPoint(event: ReactPointerEvent<HTMLDivElement>) {
    return normalizedEventPoint(event, boardRef.current);
  }

  function endpoints(id: string) {
    return {
      start: readPoint(answer[`${id}Start`]),
      end: readPoint(answer[`${id}End`]),
    };
  }

  function begin(event: ReactPointerEvent<HTMLDivElement>) {
    const point = eventPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { start, end } = endpoints(active);
    let key = `${active}Start`;
    if (start && !end) key = `${active}End`;
    else if (start && end) key = distance(point, start) <= distance(point, end) ? `${active}Start` : `${active}End`;
    setDragging(key);
    onChange({ ...answer, [key]: formatPoint(point) });
  }

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const point = eventPoint(event);
    if (!point) return;
    onChange({ ...answer, [dragging]: formatPoint(point) });
  }

  return (
    <div className="practical-editor virtual-measurement-editor">
      <div className="practical-tool-row" aria-label="Measurement tools">
        {question.measurements.map((measurement) => (
          <button className={active === measurement.id ? "is-active" : ""} key={measurement.id} onClick={() => setActive(measurement.id)} type="button">
            Measure {measurement.label}
          </button>
        ))}
      </div>
      <p className="ray-tool-status">Place the two ruler endpoints on the edges of the dimension, then drag either endpoint to refine the reading.</p>
      <div
        aria-label={question.backgroundAlt}
        className="virtual-measurement-board"
        onPointerCancel={() => setDragging(null)}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={() => setDragging(null)}
        ref={boardRef}
        role="application"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={question.backgroundAlt} draggable={false} src={question.backgroundSrc} />
        <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1000 420">
          {question.measurements.map((measurement) => {
            const { start, end } = endpoints(measurement.id);
            return start && end ? (
              <g key={measurement.id}>
                <line className="measurement-line" x1={start.x * 1000} x2={end.x * 1000} y1={start.y * 420} y2={end.y * 420} />
                <circle className="measurement-handle" cx={start.x * 1000} cy={start.y * 420} r="9" />
                <circle className="measurement-handle" cx={end.x * 1000} cy={end.y * 420} r="9" />
              </g>
            ) : null;
          })}
        </svg>
      </div>
      <div className="measurement-readouts">
        {question.measurements.map((measurement) => {
          const { start, end } = endpoints(measurement.id);
          const value = start && end ? distance(start, end) * measurement.calibration : null;
          return (
            <div key={measurement.id}>
              <span>{measurement.label}</span>
              <strong>{value === null ? "Not measured" : `${value.toFixed(1)} ${measurement.unit}`}</strong>
            </div>
          );
        })}
      </div>
      <button className="ray-clear-button" onClick={() => onChange({})} type="button">Clear measurements</button>
    </div>
  );
}

function GraphSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        <option value="">Select</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function GraphGrid({
  plot,
  xMax,
  yMax,
}: {
  plot: { left: number; right: number; top: number; bottom: number };
  xMax: number;
  yMax: number;
}) {
  const vertical = Array.from({ length: 41 }, (_, index) => plot.left + (plot.right - plot.left) * index / 40);
  const horizontal = Array.from({ length: 31 }, (_, index) => plot.top + (plot.bottom - plot.top) * index / 30);
  return (
    <>
      {vertical.map((x, index) => <line className={index % 5 === 0 ? "graph-grid-major" : "graph-grid-minor"} key={`v${index}`} x1={x * 1000} x2={x * 1000} y1={plot.top * 700} y2={plot.bottom * 700} />)}
      {horizontal.map((y, index) => <line className={index % 5 === 0 ? "graph-grid-major" : "graph-grid-minor"} key={`h${index}`} x1={plot.left * 1000} x2={plot.right * 1000} y1={y * 700} y2={y * 700} />)}
      <line className="graph-axis" x1={plot.left * 1000} x2={plot.right * 1000} y1={plot.bottom * 700} y2={plot.bottom * 700} />
      <line className="graph-axis" x1={plot.left * 1000} x2={plot.left * 1000} y1={plot.top * 700} y2={plot.bottom * 700} />
      <text className="graph-scale-label" x={plot.left * 1000 - 20} y={plot.bottom * 700 + 24}>0</text>
      <text className="graph-scale-label" x={plot.right * 1000 - 22} y={plot.bottom * 700 + 24}>{xMax}</text>
      <text className="graph-scale-label" x={plot.left * 1000 - 44} y={plot.top * 700 + 9}>{yMax}</text>
    </>
  );
}

function readStrokes(value: string | string[] | undefined) {
  if (!Array.isArray(value)) return [];
  return value.map((stroke) => {
    const [rawMode, rawPoints = ""] = stroke.split(":");
    const mode = rawMode === "core" || rawMode === "pip" ? rawMode : "outline";
    return {
      mode,
      points: rawPoints.split(";").map(readPoint).filter(Boolean) as Point[],
    };
  }).filter((stroke) => stroke.points.length > 1);
}

function normalizedEventPoint(event: ReactPointerEvent<HTMLDivElement>, board: HTMLDivElement | null): Point | null {
  const rect = board?.getBoundingClientRect();
  if (!rect) return null;
  return {
    x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
  };
}

function readPoint(value: string | string[] | undefined): Point | null {
  if (typeof value !== "string") return null;
  const [x, y] = value.split(",").map(Number);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

function formatPoint(point: Point) {
  return `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
}

function distance(left: Point, right: Point) {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function clampToPlot(point: Point, plot: { left: number; right: number; top: number; bottom: number }) {
  return {
    x: Math.max(plot.left, Math.min(plot.right, point.x)),
    y: Math.max(plot.top, Math.min(plot.bottom, point.y)),
  };
}

function stringValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}
