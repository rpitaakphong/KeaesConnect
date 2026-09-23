"use client";

import { ArrowLeft, Download, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { getResult } from "@/features/admin/admin-api";
import { AnswerReviewList, formatChoiceSelectionForText, resolveChoiceAnswer } from "@/features/admin/answer-review";
import type { AdminResult } from "@/features/admin/types";
import { formatAssignmentBranch } from "@/features/assignments/branches";
import { requireStaffProfile } from "@/features/auth/auth-api";
import { hasPermission } from "@/lib/permissions/permissions";

export function ResultReportClient({ attemptId }: { attemptId: string }) {
  const pdfUrlRef = useRef("");
  const [exportStatus, setExportStatus] = useState("");
  const [result, setResult] = useState<AdminResult | null>(null);
  const [status, setStatus] = useState("Loading result...");

  async function loadResult() {
    setStatus("Loading result...");
    try {
      const profile = await requireStaffProfile();
      if (!profile) return;
      if (!hasPermission(profile, "view_reports")) {
        setStatus("Your account does not have access to reports.");
        return;
      }
      setResult(await getResult(attemptId));
      setStatus("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not load result.");
    }
  }

  useEffect(() => {
    loadResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
  }, []);

  function handleExportPdf() {
    if (!result) return;
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    const blob = new Blob([buildResultPdf(result)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    pdfUrlRef.current = url;
    setExportStatus(opened ? "PDF opened in a new tab." : "PDF opened in this tab.");
    if (!opened) window.location.assign(url);
  }

  return (
    <>
      <div className="section-head report-head">
        <div>
          <p className="eyebrow">Student report</p>
          <h1>{result?.student.fullName || "Result detail"}</h1>
          {result ? <p>{result.testTitle} · {formatDate(result.submittedAt)}</p> : null}
          {result ? (
            <div className="report-print-summary">
              <span>Nickname: {result.student.nickname || "-"}</span>
              <span>DOB: {result.student.dateOfBirth || "-"}</span>
              <span>Subject: {result.student.subject || "-"}</span>
              <span>Level: {result.student.level || "-"}</span>
              <span>Branch: {formatAssignmentBranch(result.branch)}</span>
              <span>Total: {formatScore(result.score.total)}/{formatScore(result.score.possible)}</span>
              <span>Percent: {result.score.percent}%</span>
            </div>
          ) : null}
        </div>
        <div className="button-row report-actions no-print">
          <ButtonLink href="/admin/tests" variant="ghost"><ArrowLeft aria-hidden="true" /> Back</ButtonLink>
          <button className="ghost-button" type="button" onClick={handleExportPdf} disabled={!result}>
            <Download aria-hidden="true" /> Export PDF
          </button>
          <button className="ghost-button" type="button" onClick={loadResult}><RefreshCcw aria-hidden="true" /> Refresh</button>
        </div>
      </div>

      {status ? <div className="notice">{status}</div> : null}
      {exportStatus ? <p className="support-note no-print" aria-live="polite">{exportStatus}</p> : null}

      {result ? (
        <section className="report-layout">
          <article className="panel">
            <h2>Score summary</h2>
            <section className="score-summary">
              <div><span>Total score</span><strong>{formatScore(result.score.total)}/{formatScore(result.score.possible)}</strong></div>
              <div><span>Percent</span><strong>{result.score.percent}%</strong></div>
              <div><span>Level</span><strong>{result.student.level}</strong></div>
              <div><span>Branch</span><strong>{formatAssignmentBranch(result.branch)}</strong></div>
            </section>
            <div className="part-list">
              {result.partScores.map((part) => (
                <div className="part-row" key={part.part}>
                  <strong>{part.part}</strong>
                  <span>{formatScore(part.total)}/{formatScore(part.possible)}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <h2>Answers</h2>
            <AnswerReviewList result={result} />
          </article>
        </section>
      ) : null}
    </>
  );
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function buildResultPdf(result: AdminResult) {
  const width = 595.28;
  const height = 841.89;
  const margin = 36;
  const contentWidth = width - margin * 2;
  const colors = {
    border: [0.82, 0.89, 0.89],
    green: [0.07, 0.55, 0.52],
    greenSoft: [0.9, 0.98, 0.97],
    ink: [0.13, 0.2, 0.23],
    muted: [0.35, 0.45, 0.48],
    red: [0.58, 0.12, 0.16],
    redSoft: [1, 0.94, 0.94],
    surface: [0.97, 0.99, 0.98],
    white: [1, 1, 1],
  };
  const pages: string[][] = [[]];
  let y = height - margin;

  function commands() {
    return pages[pages.length - 1];
  }

  function addPage() {
    pages.push([]);
    y = height - margin;
    setStroke(colors.border);
    setFill(colors.green);
    commands().push(`${margin.toFixed(2)} ${(height - 28).toFixed(2)} m ${(width - margin).toFixed(2)} ${(height - 28).toFixed(2)} l S`);
    text("Student Report", margin, 8, true, colors.green);
    y -= 20;
  }

  function ensure(space: number) {
    if (y - space < margin) addPage();
  }

  function setFill(color: number[]) {
    commands().push(`${color.map((part) => part.toFixed(3)).join(" ")} rg`);
  }

  function setStroke(color: number[]) {
    commands().push(`${color.map((part) => part.toFixed(3)).join(" ")} RG`);
  }

  function rect(x: number, yPosition: number, rectWidth: number, rectHeight: number, fill: number[], stroke?: number[]) {
    setFill(fill);
    if (stroke) {
      setStroke(stroke);
      commands().push(`${x.toFixed(2)} ${yPosition.toFixed(2)} ${rectWidth.toFixed(2)} ${rectHeight.toFixed(2)} re B`);
    } else {
      commands().push(`${x.toFixed(2)} ${yPosition.toFixed(2)} ${rectWidth.toFixed(2)} ${rectHeight.toFixed(2)} re f`);
    }
  }

  function text(value: string, x: number, size: number, bold = false, color = colors.ink) {
    setFill(color);
    commands().push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdf(value)}) Tj ET`);
  }

  function wrapped(value: string, options: { bold?: boolean; color?: number[]; indent?: number; leading?: number; size?: number; width?: number } = {}) {
    const size = options.size || 8;
    const leading = options.leading || size + 3;
    const indent = options.indent || 0;
    const wrapWidth = options.width || contentWidth - indent;
    const maxChars = Math.max(20, Math.floor(wrapWidth / (size * 0.48)));
    const rows = wrapText(value, maxChars);
    for (const row of rows) {
      ensure(leading);
      text(row, margin + indent, size, options.bold, options.color);
      y -= leading;
    }
  }

  function section(title: string) {
    const barHeight = 18;
    ensure(30);
    y -= 5;
    const barBottom = y - barHeight;
    rect(margin, barBottom, contentWidth, barHeight, colors.greenSoft, colors.border);
    y = barBottom + 5.5;
    text(title, margin + 8, 9, true, colors.green);
    y = barBottom - 12;
  }

  rect(0, height - 104, width, 104, colors.green);
  text("Keaes Academics", margin, 9, true, colors.white);
  y = height - 58;
  text("Student Report", margin, 20, true, colors.white);
  y -= 18;
  wrapped(result.testTitle || "-", { color: colors.white, size: 8.5, leading: 10, width: contentWidth * 0.72 });
  rect(width - margin - 118, height - 88, 118, 54, colors.white);
  y = height - 51;
  text(`${formatScore(result.score.total)}/${formatScore(result.score.possible)}`, width - margin - 106, 17, true, colors.green);
  y -= 15;
  text(`${result.score.percent}%`, width - margin - 106, 10, true, colors.ink);
  y -= 13;
  text("Total / Percent", width - margin - 106, 7, false, colors.muted);
  y = height - 126;

  const cardGap = 8;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  const cards = [
    ["Student", result.student.fullName || "-", `${result.student.nickname ? `Nickname: ${result.student.nickname}` : "Nickname: -"}  DOB: ${result.student.dateOfBirth || "-"}`],
    ["Course", result.student.level || "-", `${result.student.subject ? `Subject: ${result.student.subject}` : "Subject: -"}  Branch: ${formatAssignmentBranch(result.branch)}`],
    ["Dates", result.student.testDate || "-", `Submitted: ${formatDate(result.submittedAt)}`],
  ];
  cards.forEach((card, index) => {
    const x = margin + index * (cardWidth + cardGap);
    rect(x, y - 44, cardWidth, 44, colors.surface, colors.border);
    const savedY = y;
    y = savedY - 13;
    text(card[0], x + 8, 6.8, true, colors.green);
    y -= 12;
    text(card[1], x + 8, 9, true, colors.ink);
    y -= 11;
    text(card[2], x + 8, 7, false, colors.muted);
    y = savedY;
  });
  y -= 58;

  section("Part Scores");
  if (result.partScores.length) {
    const columns = 3;
    const gap = 6;
    const partWidth = (contentWidth - gap * (columns - 1)) / columns;
    result.partScores.forEach((part, index) => {
      if (index > 0 && index % columns === 0) y -= 32;
      ensure(34);
      const x = margin + (index % columns) * (partWidth + gap);
      const rowY = y - 25;
      rect(x, rowY, partWidth, 25, colors.white, colors.border);
      const savedY = y;
      y = savedY - 10;
      text(part.part, x + 6, 6.8, true, colors.muted);
      y -= 10;
      text(`${formatScore(part.total)}/${formatScore(part.possible)}`, x + 6, 8.5, true, colors.ink);
      y = savedY;
    });
    y -= 36;
  } else {
    wrapped("No part scores available.", { size: 8 });
  }

  section("Answers");
  if (result.answers.length) {
    result.answers.forEach((answer, index) => {
      const choiceReview = resolveChoiceAnswer(result.testId, answer);
      const questionLabel = choiceReview ? `Question ${choiceReview.questionNumber}` : `Answer ${index + 1}`;
      const promptRows = wrapText(`${answer.part} · ${questionLabel}: ${answer.prompt}`, 95);
      const detailText = choiceReview
        ? `Student selected: ${formatChoiceSelectionForText(choiceReview.selected, choiceReview.selectedFallback)}   Correct answer: ${formatChoiceSelectionForText(choiceReview.correct, choiceReview.correctFallback)}   Score: ${formatScore(answer.score)}/${formatScore(answer.possible)}`
        : `Student: ${answer.response || "-"}   Correct: ${answer.correctAnswer || "-"}   Score: ${formatScore(answer.score)}/${formatScore(answer.possible)}`;
      const detailRows = wrapText(detailText, 98);
      const rowHeight = Math.max(28, 12 + promptRows.length * 8 + detailRows.length * 8);
      ensure(rowHeight + 6);
      const fill = answer.correct ? colors.white : colors.redSoft;
      const accent = answer.correct ? colors.green : colors.red;
      rect(margin, y - rowHeight, contentWidth, rowHeight, fill, colors.border);
      rect(margin, y - rowHeight, 3, rowHeight, accent);
      let rowY = y - 11;
      for (const row of promptRows) {
        y = rowY;
        text(row, margin + 10, 7.2, true, colors.ink);
        rowY -= 8;
      }
      for (const row of detailRows) {
        y = rowY;
        text(row, margin + 10, 6.8, false, colors.muted);
        rowY -= 8;
      }
      y = y - 8;
    });
  } else {
    wrapped("No answer details available.", { size: 8 });
  }

  appendPdfFooter(pages, width, margin, colors.muted);

  return serializePdf(pages, width, height);
}

function appendPdfFooter(pages: string[][], width: number, margin: number, color: number[]) {
  const fill = `${color.map((part) => part.toFixed(3)).join(" ")} rg`;
  pages.forEach((page, index) => {
    page.push(fill);
    page.push(`BT /F1 6.5 Tf ${margin.toFixed(2)} 18.00 Td (Generated student report) Tj ET`);
    page.push(`BT /F1 6.5 Tf ${(width - margin - 42).toFixed(2)} 18.00 Td (Page ${index + 1}/${pages.length}) Tj ET`);
  });
}

function serializePdf(pages: string[][], width: number, height: number) {
  const objects: string[] = [];
  const pageRefs: number[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((commands, index) => {
    const pageNumber = 5 + index * 2;
    const contentNumber = pageNumber + 1;
    pageRefs.push(pageNumber);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width.toFixed(2)} ${height.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`);
    const content = ["0.7 w", ...commands].join("\n");
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;

  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(output.length);
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    output += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return output;
}

function wrapText(value: string, maxChars: number) {
  const words = cleanPdfText(value).split(/\s+/).filter(Boolean);
  const rows: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (`${current} ${word}`.length <= maxChars) {
      current = `${current} ${word}`;
    } else {
      rows.push(current);
      current = word;
    }
    while (current.length > maxChars) {
      rows.push(current.slice(0, maxChars));
      current = current.slice(maxChars);
    }
  }
  if (current) rows.push(current);
  return rows.length ? rows : ["-"];
}

function cleanPdfText(value: string) {
  return String(value || "-")
    .replace(/[•·]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "?");
}

function escapePdf(value: string) {
  return cleanPdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
