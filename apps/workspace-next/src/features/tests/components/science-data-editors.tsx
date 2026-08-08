"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { TestQuestion } from "@/features/tests/lib/types";

type AnswerMap = Record<string, string | string[]>;

export function TallyTableEditor({
  answer,
  onChange,
  question,
}: {
  answer: AnswerMap;
  onChange: (value: AnswerMap) => void;
  question: Extract<TestQuestion, { type: "tallyTable" }>;
}) {
  function setValue(key: string, value: number | string) {
    onChange({ ...answer, [key]: String(value) });
  }

  function adjust(binId: string, delta: number) {
    const key = `${binId}Tally`;
    const current = Number(answer[key] || 0);
    setValue(key, Math.max(0, Math.min(question.measurementIds.length, current + delta)));
  }

  return (
    <div className="science-table-wrap">
      <table className="science-tally-table">
        <thead>
          <tr>
            <th>Length of seeds in mm</th>
            {question.bins.map((bin) => <th key={bin.id}>{bin.label}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Given number of seeds</th>
            {question.bins.map((bin) => <td key={bin.id}><strong>{bin.baseCount}</strong></td>)}
          </tr>
          <tr>
            <th>Add the measured seeds</th>
            {question.bins.map((bin) => {
              if (!bin.editable) return <td key={bin.id}><span className="science-fixed-value">Not required</span></td>;
              const count = Number(answer[`${bin.id}Tally`] || 0);
              return (
                <td key={bin.id}>
                  <div className="tally-stepper">
                    <button aria-label={`Remove a tally from ${bin.label}`} onClick={() => adjust(bin.id, -1)} title="Remove tally" type="button"><Minus size={16} /></button>
                    <output aria-label={`${count} additional tallies`}>{tallyMarks(count) || "0"}</output>
                    <button aria-label={`Add a tally to ${bin.label}`} onClick={() => adjust(bin.id, 1)} title="Add tally" type="button"><Plus size={16} /></button>
                  </div>
                </td>
              );
            })}
          </tr>
          <tr>
            <th>Total number of seeds</th>
            {question.bins.map((bin) => bin.editable ? (
              <td key={bin.id}>
                <input
                  aria-label={`Total seeds measuring ${bin.label} millimetres`}
                  inputMode="numeric"
                  max={50}
                  min={0}
                  onChange={(event) => setValue(`${bin.id}Total`, event.target.value)}
                  value={String(answer[`${bin.id}Total`] || "")}
                />
              </td>
            ) : <td key={bin.id}><strong>{bin.baseCount}</strong></td>)}
          </tr>
        </tbody>
      </table>
      <button className="science-reset-button" onClick={() => onChange({})} type="button"><RotateCcw size={16} /> Reset table</button>
    </div>
  );
}

export function HistogramEditor({
  answer,
  onChange,
  question,
}: {
  answer: AnswerMap;
  onChange: (value: AnswerMap) => void;
  question: Extract<TestQuestion, { type: "histogram" }>;
}) {
  const boardRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const yMax = Number(answer.yMax || question.yMaxOptions[0]);
  const plot = { left: 90, right: 735, top: 25, bottom: 390 };
  const width = (plot.right - plot.left) / question.categories.length;

  function setValue(key: string, value: string | number) {
    onChange({ ...answer, [key]: String(value) });
  }

  function barValue(category: (typeof question.categories)[number]) {
    return category.fixedValue ?? Number(answer[`bar-${category.id}`] || 0);
  }

  function updateBar(event: ReactPointerEvent<SVGSVGElement>, categoryId: string) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = ((event.clientY - rect.top) / rect.height) * 440;
    const value = Math.max(0, Math.min(yMax, Math.round(((plot.bottom - y) / (plot.bottom - plot.top)) * yMax)));
    setValue(`bar-${categoryId}`, value);
  }

  function begin(event: ReactPointerEvent<SVGSVGElement>) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 760;
    const index = Math.floor((x - plot.left) / width);
    const category = question.categories[index];
    if (!category || category.fixedValue !== undefined) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(category.id);
    updateBar(event, category.id);
  }

  return (
    <div className="science-histogram-editor">
      <div className="science-histogram-controls">
        <label>Y-axis label<input onChange={(event) => setValue("yLabel", event.target.value)} placeholder="quantity" value={String(answer.yLabel || "")} /></label>
        <label>Top of scale<select onChange={(event) => setValue("yMax", event.target.value)} value={String(yMax)}>{question.yMaxOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      </div>
      <p className="ray-tool-status">Drag the top of each teal bar to the required height. The two grey bars are already given.</p>
      <svg
        aria-label="Histogram of seed lengths"
        className="science-histogram-board"
        onPointerCancel={() => setDragging(null)}
        onPointerDown={begin}
        onPointerMove={(event) => dragging && updateBar(event, dragging)}
        onPointerUp={() => setDragging(null)}
        ref={boardRef}
        role="application"
        viewBox="0 0 760 440"
      >
        {Array.from({ length: 11 }, (_, index) => {
          const value = yMax * index / 10;
          const y = plot.bottom - (plot.bottom - plot.top) * index / 10;
          return <g key={index}><line className="histogram-grid-line" x1={plot.left} x2={plot.right} y1={y} y2={y} /><text className="histogram-axis-text" textAnchor="end" x={plot.left - 10} y={y + 5}>{Number.isInteger(value) ? value : value.toFixed(1)}</text></g>;
        })}
        <line className="histogram-axis" x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.bottom} />
        <line className="histogram-axis" x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} />
        {question.categories.map((category, index) => {
          const value = barValue(category);
          const height = (value / yMax) * (plot.bottom - plot.top);
          const x = plot.left + index * width + 2;
          return (
            <g key={category.id}>
              <rect className={category.fixedValue === undefined ? "histogram-bar is-editable" : "histogram-bar"} height={height} width={width - 4} x={x} y={plot.bottom - height} />
              <text className="histogram-value" textAnchor="middle" x={x + (width - 4) / 2} y={Math.max(plot.top + 16, plot.bottom - height - 7)}>{value}</text>
              <text className="histogram-category" textAnchor="middle" x={x + (width - 4) / 2} y={plot.bottom + 24}>{category.label}</text>
            </g>
          );
        })}
        <text className="histogram-axis-title" textAnchor="middle" x={(plot.left + plot.right) / 2} y="432">length of seeds in mm</text>
      </svg>
      <button className="science-reset-button" onClick={() => onChange({})} type="button"><RotateCcw size={16} /> Clear histogram</button>
    </div>
  );
}

function tallyMarks(count: number) {
  return Array.from({ length: count }, (_, index) => (index + 1) % 5 === 0 ? "/" : "|").join("");
}
