"use client";

import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { getResult } from "@/features/admin/admin-api";
import type { AdminResult } from "@/features/admin/types";
import { requireStaffProfile } from "@/features/auth/auth-api";
import { hasPermission } from "@/lib/permissions/permissions";

export function ResultReportClient({ attemptId }: { attemptId: string }) {
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

  return (
    <>
      <div className="section-head">
        <div>
          <p className="eyebrow">Student report</p>
          <h1>{result?.student.fullName || "Result detail"}</h1>
          {result ? <p>{result.testTitle} · {formatDate(result.submittedAt)}</p> : null}
        </div>
        <div className="button-row">
          <ButtonLink href="/admin/tests" variant="ghost"><ArrowLeft aria-hidden="true" /> Back</ButtonLink>
          <button className="ghost-button" type="button" onClick={loadResult}><RefreshCcw aria-hidden="true" /> Refresh</button>
        </div>
      </div>

      {status ? <div className="notice">{status}</div> : null}

      {result ? (
        <section className="report-layout">
          <article className="panel">
            <h2>Score summary</h2>
            <section className="score-summary">
              <div><span>Total score</span><strong>{formatScore(result.score.total)}/{formatScore(result.score.possible)}</strong></div>
              <div><span>Percent</span><strong>{result.score.percent}%</strong></div>
              <div><span>Level</span><strong>{result.student.level}</strong></div>
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
            <div className="correction-list">
              {result.answers.map((answer, index) => (
                <div className={`correction-row ${answer.correct ? "" : "is-wrong"}`} key={`${answer.part}-${index}`}>
                  <strong>{answer.part}: {answer.prompt}</strong>
                  <span>Student: {answer.response || "-"} · Correct: {answer.correctAnswer || "-"} · Score: {formatScore(answer.score)}/{formatScore(answer.possible)}</span>
                </div>
              ))}
            </div>
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
