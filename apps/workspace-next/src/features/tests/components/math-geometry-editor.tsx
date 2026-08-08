"use client";

import { Trash2, Undo2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { GeometryConstructionQuestion, GeometryPoint } from "@/features/tests/lib/types";

type Segment = { start: GeometryPoint; end: GeometryPoint };

export function MathGeometryEditor({
  answer,
  onChange,
  question,
}: {
  answer: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  question: GeometryConstructionQuestion;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<GeometryPoint | null>(null);
  const [dragging, setDragging] = useState<{ index: number; endpoint: "start" | "end" } | null>(null);
  const segments = useMemo(() => decodeSegments(answer.segments), [answer.segments]);
  const sequential = question.geometry.variant === "regularPentagon";
  const snapPoints = useMemo(() => buildSnapPoints(question), [question]);

  function update(next: Segment[]) {
    onChange({ ...answer, segments: next.map(encodeSegment) });
  }

  function pointFromEvent(event: ReactPointerEvent) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const raw = {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    };
    return snapPoint(raw, snapPoints, question.showSnapDots ? 0.04 : sequential ? 0.035 : 0.075);
  }

  function addPoint(point: GeometryPoint) {
    if (segments.length >= question.maxSegments) {
      if (sequential) return;
      update([]);
      setPending(point);
      return;
    }
    if (question.geometry.variant === "regularPentagon") {
      const start = segments.at(-1)?.end || question.geometry.givenVertices[2];
      if (Math.hypot(start.x - point.x, start.y - point.y) <= 0.015) return;
      update([...segments, { start, end: point }]);
      return;
    }
    if (!pending) setPending(point);
    else {
      update([...segments, { start: pending, end: point }]);
      setPending(null);
    }
  }

  function moveEndpoint(index: number, endpoint: "start" | "end", point: GeometryPoint) {
    const next = segments.map((segment) => ({ ...segment }));
    next[index] = { ...next[index], [endpoint]: point };
    if (sequential && endpoint === "end" && next[index + 1]) next[index + 1].start = point;
    if (sequential && endpoint === "start" && next[index - 1]) next[index - 1].end = point;
    update(next);
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number, endpoint: "start" | "end") {
    const delta = event.shiftKey ? 0.001 : 0.005;
    const point = segments[index][endpoint];
    const next = { ...point };
    if (event.key === "ArrowLeft") next.x -= delta;
    else if (event.key === "ArrowRight") next.x += delta;
    else if (event.key === "ArrowUp") next.y -= delta;
    else if (event.key === "ArrowDown") next.y += delta;
    else return;
    event.preventDefault();
    moveEndpoint(index, endpoint, { x: clamp(next.x), y: clamp(next.y) });
  }

  const measurements = sequential ? pentagonMeasurements(question, segments) : [];

  return (
    <div className="math-geometry-editor">
      <div
        className="math-geometry-board"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          const point = pointFromEvent(event);
          if (point) addPoint(point);
        }}
        onPointerMove={(event) => {
          if (!dragging || !(event.buttons & 1)) return;
          const point = pointFromEvent(event);
          if (point) moveEndpoint(dragging.index, dragging.endpoint, point);
        }}
        onPointerUp={() => setDragging(null)}
        ref={boardRef}
        style={question.boardMaxWidth ? { maxWidth: `${question.boardMaxWidth}px` } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={question.backgroundAlt} draggable={false} src={question.backgroundSrc} />
        <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          {question.showSnapDots ? snapPoints.map((point, index) => (
            <circle className="math-construction-snap-dot" cx={point.x * 1000} cy={point.y * 1000} key={index} r="4" />
          )) : null}
          {segments.map((segment, index) => (
            <line
              className="math-construction-line"
              key={index}
              x1={segment.start.x * 1000}
              x2={segment.end.x * 1000}
              y1={segment.start.y * 1000}
              y2={segment.end.y * 1000}
            />
          ))}
          {pending ? <circle className="math-construction-pending" cx={pending.x * 1000} cy={pending.y * 1000} r="12" /> : null}
        </svg>
        {segments.flatMap((segment, index) => (["start", "end"] as const).map((endpoint) => {
          if (sequential && index > 0 && endpoint === "start") return null;
          const point = segment[endpoint];
          return (
            <button
              aria-label={`Move line ${index + 1} ${endpoint}`}
              className="math-construction-handle"
              key={`${index}-${endpoint}`}
              onKeyDown={(event) => handleKey(event, index, endpoint)}
              onPointerDown={(event) => {
                event.stopPropagation();
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragging({ index, endpoint });
              }}
              style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
              type="button"
            />
          );
        }))}
      </div>
      <div className="math-geometry-toolbar">
        {!question.hideUndo ? (
          <button
            aria-label="Undo last line"
            className="icon-button"
            disabled={!segments.length && !pending}
            onClick={() => pending ? setPending(null) : update(segments.slice(0, -1))}
            title="Undo last line"
            type="button"
          ><Undo2 aria-hidden="true" size={18} /></button>
        ) : null}
        <button
          aria-label="Clear construction"
          className="icon-button"
          disabled={!segments.length && !pending}
          onClick={() => { setPending(null); update([]); }}
          title="Clear construction"
          type="button"
        ><Trash2 aria-hidden="true" size={18} /></button>
        {measurements.length ? (
          <div className="math-geometry-measurements" aria-live="polite">
            {measurements.map((measurement) => <span key={measurement}>{measurement}</span>)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function decodeSegments(value: string | string[] | undefined): Segment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((encoded) => {
    const [rawStart, rawEnd] = encoded.split(";");
    const start = decodePoint(rawStart);
    const end = decodePoint(rawEnd);
    return start && end ? [{ start, end }] : [];
  });
}

function decodePoint(value = "") {
  const [x, y] = value.split(",").map(Number);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

function encodeSegment(segment: Segment) {
  return `${segment.start.x.toFixed(4)},${segment.start.y.toFixed(4)};${segment.end.x.toFixed(4)},${segment.end.y.toFixed(4)}`;
}

function snapPoint(point: GeometryPoint, candidates: GeometryPoint[], tolerance: number) {
  const nearest = candidates.reduce<{ point: GeometryPoint; distance: number } | null>((best, candidate) => {
    const candidateDistance = Math.hypot(point.x - candidate.x, point.y - candidate.y);
    return !best || candidateDistance < best.distance ? { point: candidate, distance: candidateDistance } : best;
  }, null);
  return nearest && nearest.distance <= tolerance ? nearest.point : point;
}

function buildSnapPoints(question: GeometryConstructionQuestion) {
  const fixed = question.snapPoints || [];
  if (!question.showSnapDots) return fixed;
  const columns = [0.02, 0.1, 0.176, 0.26, 0.34, 0.428, 0.51, 0.59, 0.679, 0.755, 0.835];
  const rows = [0.07, 0.149, 0.228, 0.307, 0.385, 0.464, 0.543, 0.622, 0.708, 0.793, 0.879, 0.964];
  return rows.flatMap((y) => columns.map((x) => ({ x, y })));
}

function pentagonMeasurements(question: GeometryConstructionQuestion, segments: Segment[]) {
  const geometry = question.geometry;
  if (geometry.variant !== "regularPentagon") return [];
  const scaleY = geometry.aspectRatio;
  return segments.map((segment, index) => {
    const base = geometry.givenVertices;
    const side = scaledDistance(segment.start, segment.end, scaleY);
    const source = index ? segments[index - 1].start : base[1];
    const angle = interiorAngle(source, segment.start, segment.end, scaleY);
    const centimetres = side / scaledDistance(base[0], base[1], scaleY) * 6;
    return `Side ${index + 1}: ${centimetres.toFixed(1)} cm, ${angle.toFixed(0)}°`;
  });
}

function scaledDistance(left: GeometryPoint, right: GeometryPoint, scaleY: number) {
  return Math.hypot(left.x - right.x, (left.y - right.y) * scaleY);
}

function interiorAngle(previous: GeometryPoint, vertex: GeometryPoint, next: GeometryPoint, scaleY: number) {
  const left = { x: previous.x - vertex.x, y: (previous.y - vertex.y) * scaleY };
  const right = { x: next.x - vertex.x, y: (next.y - vertex.y) * scaleY };
  const denominator = Math.hypot(left.x, left.y) * Math.hypot(right.x, right.y);
  if (!denominator) return 0;
  return Math.acos(Math.max(-1, Math.min(1, (left.x * right.x + left.y * right.y) / denominator))) * 180 / Math.PI;
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}
