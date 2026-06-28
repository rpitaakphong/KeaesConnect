"use client";

import { Download, FileSpreadsheet, RefreshCcw, RotateCcw, Table, UploadCloud } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { requireStaffProfile } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";
import {
  courseExportRows,
  exportRowsCsv,
  fileName,
  formatBytes,
  formatDate,
  formatHours,
  formatMonth,
  loadTeacherMappings,
  saveTeacherMappings,
  sessionExportRows,
  signedHours,
  teacherExportRows,
} from "@/features/hours-cross-check/hours-reconciliation";
import type { HoursWorkerRequest, HoursWorkerResponse, ParsedHoursBundle, ReconciliationResults, TeacherMappings, TeacherReview } from "@/features/hours-cross-check/types";
import { hasPermission } from "@/lib/permissions/permissions";

type Step = "upload" | "review" | "results";
type Tab = "synthesis" | "overview" | "teachers" | "courses" | "sessions" | "quality" | "settings";
type ProcessingState = {
  detail: string;
  title: string;
};

export function HoursCrossCheckClient() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [authStatus, setAuthStatus] = useState("Loading staff access...");
  const [step, setStep] = useState<Step>("upload");
  const [activeTab, setActiveTab] = useState<Tab>("synthesis");
  const [tngFile, setTngFile] = useState<File | null>(null);
  const [classFile, setClassFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedHoursBundle | null>(null);
  const [review, setReview] = useState<TeacherReview | null>(null);
  const [results, setResults] = useState<ReconciliationResults | null>(null);
  const [mappings, setMappings] = useState<TeacherMappings>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [processing, setProcessing] = useState<ProcessingState | null>(null);

  useEffect(() => {
    setMappings(loadTeacherMappings());
    requireStaffProfile()
      .then((staff) => {
        setProfile(staff);
        setAuthStatus(hasPermission(staff, "hours_cross_check") ? "Local-only" : "Not authorized");
      })
      .catch((err) => setAuthStatus(err instanceof Error ? err.message : "Could not load staff access."));
  }, []);

  const canUseTool = hasPermission(profile, "hours_cross_check");
  const issueCount = useMemo(() => {
    if (!results) return 0;
    return results.teacherRows.filter((row) => row.status !== "Matched").length
      + results.sessionMatches.filter((row) => row.status !== "Matched").length
      + results.warnings.length;
  }, [results]);

  async function parseForReview() {
    if (!tngFile || !classFile || pending) return;
    setPending(true);
    setMessage("Parsing files locally...");
    setProcessing({
      detail: "Reading Teach and Go and class-list files in this browser. Large Excel workbooks can take a moment.",
      title: "Checking teacher names",
    });
    try {
      await waitForPaint();
      const response = await runHoursWorker({
        classListFile: classFile,
        mappings,
        requestId: cryptoId(),
        tngFile,
        type: "parse",
      });
      if (response.type !== "parse") throw new Error("Unexpected worker response while parsing files.");
      setParsed(response.parsed);
      setReview(response.review);
      setResults(null);
      setStep("review");
      setMessage("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not parse the selected files.");
    } finally {
      setProcessing(null);
      setPending(false);
    }
  }

  async function runSummary(nextMappings = mappings) {
    if (!parsed || !review) return;
    setPending(true);
    setProcessing({
      detail: "Saving teacher-name choices and calculating differences, summaries, exceptions, and export rows.",
      title: "Building results dashboard",
    });
    try {
      await waitForPaint();
      saveTeacherMappings(nextMappings);
      setMappings(nextMappings);
      const refreshedReview = {
        ...review,
        items: review.items.map((item) => ({ ...item, selectedClassKey: nextMappings[item.tngKey] || item.selectedClassKey })),
      };
      const response = await runHoursWorker({
        mappings: nextMappings,
        parsed,
        requestId: cryptoId(),
        review: refreshedReview,
        type: "reconcile",
      });
      if (response.type !== "reconcile") throw new Error("Unexpected worker response while building the report.");
      setReview(refreshedReview);
      setResults(response.results);
      setStep("results");
      setActiveTab("synthesis");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not calculate the report.");
    } finally {
      setProcessing(null);
      setPending(false);
    }
  }

  function updateMapping(tngKey: string, value: string) {
    setMappings((current) => ({ ...current, [tngKey]: value }));
  }

  function resetAll() {
    setTngFile(null);
    setClassFile(null);
    setParsed(null);
    setReview(null);
    setResults(null);
    setMessage("");
    setStep("upload");
  }

  if (!profile) return <div className="notice">{authStatus}</div>;
  if (!canUseTool) {
    return (
      <section className="notice error">
        <h1>Not authorized</h1>
        <p>Your staff account does not have access to the hours cross-check tool.</p>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Class-Hours Reconciliation</h1>
          <p className="hero-copy">Cross-check monthly Teach and Go records against the class-list CSV export, verify teacher names, and export an audit-ready report.</p>
        </div>
        <span className="badge">{authStatus}</span>
      </section>

      {step === "upload" ? (
        <section className="panel step-panel is-active">
          <div className="section-head">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2>Upload monthly files</h2>
              <p>Use files for the same reporting month. Files are parsed locally in this browser.</p>
            </div>
            <button className="ghost-button" type="button" onClick={resetAll}><RotateCcw aria-hidden="true" /> Clear state</button>
          </div>
          <div className="upload-grid">
            <FileCard
              accept=".csv,.xlsx,.xls,text/csv"
              file={tngFile}
              icon={<FileSpreadsheet aria-hidden="true" />}
              label="Teach and Go"
              note=".csv, .xlsx, or .xls. Excel workbooks must contain a By Date sheet."
              onChange={setTngFile}
            />
            <FileCard
              accept=".csv,text/csv"
              file={classFile}
              icon={<Table aria-hidden="true" />}
              label="Class-list CSV export"
              note=".csv export with Branch, Date, Start Time, End Time, Hours, Subject, Tutor, Platform, and Type."
              onChange={setClassFile}
            />
          </div>
          {message ? <div className="notice error">{message}</div> : null}
          <div className="footer-actions">
            <p className="support-note">Teacher hours count each class session once. Student names are ignored.</p>
            <button className="primary-button" type="button" disabled={!tngFile || !classFile || pending} onClick={parseForReview}>
              <UploadCloud aria-hidden="true" /> {pending ? "Parsing..." : "Check Teacher Names"}
            </button>
          </div>
        </section>
      ) : null}

      {step === "review" && parsed && review ? (
        <TeacherReviewStep
          mappings={mappings}
          onBack={() => setStep("upload")}
          onMappingChange={updateMapping}
          onRun={() => runSummary(mappings)}
          pending={pending}
          parsed={parsed}
          review={review}
        />
      ) : null}

      {step === "results" && results && review && parsed ? (
        <ResultsStep
          activeTab={activeTab}
          issueCount={issueCount}
          mappings={mappings}
          onExport={(kind) => downloadReport(kind, results)}
          onMappingChange={updateMapping}
          onReset={resetAll}
          onRerun={() => runSummary(mappings)}
          onTab={setActiveTab}
          pending={pending}
          parsed={parsed}
          results={results}
          review={review}
        />
      ) : null}
      {processing ? <ProcessingOverlay detail={processing.detail} title={processing.title} /> : null}
    </>
  );
}

function FileCard({
  accept,
  file,
  icon,
  label,
  note,
  onChange,
}: {
  accept: string;
  file: File | null;
  icon: ReactNode;
  label: string;
  note: string;
  onChange: (file: File | null) => void;
}) {
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] || null);
  }

  return (
    <article className={`upload-card ${file ? "has-file" : ""}`}>
      <div className="upload-icon">{icon}</div>
      <h3>{label}</h3>
      <p>{note}</p>
      <div className={`file-meta ${file ? "" : "empty"}`}>
        {file ? <><strong>{file.name}</strong><br /><span>{file.type || "local file"} · {formatBytes(file.size)}</span></> : "No file selected"}
      </div>
      <div className="upload-actions">
        <label className="button secondary-button file-button">
          Choose file
          <input accept={accept} className="visually-hidden" onChange={handleFile} type="file" />
        </label>
        <button className="ghost-button" disabled={!file} onClick={() => onChange(null)} type="button">Remove</button>
      </div>
    </article>
  );
}

function TeacherReviewStep({
  mappings,
  onBack,
  onMappingChange,
  onRun,
  pending,
  parsed,
  review,
}: {
  mappings: TeacherMappings;
  onBack: () => void;
  onMappingChange: (tngKey: string, value: string) => void;
  onRun: () => void;
  pending: boolean;
  parsed: ParsedHoursBundle;
  review: TeacherReview;
}) {
  const needsReview = review.items.filter((item) => item.status === "Needs review").length;
  const tngHours = parsed.tng.sessions.reduce((total, session) => total + session.durationHours, 0);
  const classHours = parsed.classList.sessions.reduce((total, session) => total + session.durationHours, 0);

  return (
    <section className="panel step-panel is-active">
      <div className="section-head">
        <div>
          <p className="eyebrow">Step 2</p>
          <h2>Teacher name check</h2>
          <p>Verify uncertain Teach and Go teacher names before calculating differences.</p>
        </div>
      </div>
      <div className="metric-grid review-grid">
        <Metric label="Reporting month" value={formatMonth(parsed.range.start)} />
        <Metric label="Date range" value={`${formatDate(parsed.range.start)} to ${formatDate(parsed.range.end)}`} />
        <Metric label="Branch" value={parsed.branch} />
        <Metric label="Teach and Go rows" value={String(parsed.tng.sessions.length)} />
        <Metric label="Class-list rows" value={String(parsed.classList.sessions.length)} />
        <Metric label="Names to verify" value={String(needsReview)} />
        <Metric label="Teach and Go hours" value={formatHours(tngHours)} />
        <Metric label="Class-list hours" value={formatHours(classHours)} />
      </div>
      <div className="notice warning">Choose the matching class-list tutor, or leave as no match if they are different people.</div>
      <TeacherMappingTable mappings={mappings} onMappingChange={onMappingChange} review={review} />
      <div className="footer-actions">
        <button className="ghost-button" disabled={pending} type="button" onClick={onBack}>Replace files</button>
        <button className="primary-button" disabled={pending} type="button" onClick={onRun}>{pending ? "Building..." : "Save Names & Run Summary"}</button>
      </div>
    </section>
  );
}

function ResultsStep({
  activeTab,
  issueCount,
  mappings,
  onExport,
  onMappingChange,
  onReset,
  onRerun,
  onTab,
  pending,
  results,
  review,
}: {
  activeTab: Tab;
  issueCount: number;
  mappings: TeacherMappings;
  onExport: (kind: "teachers" | "courses" | "sessions" | "quality" | "combined") => void;
  onMappingChange: (tngKey: string, value: string) => void;
  onReset: () => void;
  onRerun: () => void;
  onTab: (tab: Tab) => void;
  pending: boolean;
  parsed: ParsedHoursBundle;
  results: ReconciliationResults;
  review: TeacherReview;
}) {
  return (
    <section className="panel step-panel is-active">
      <div className="dashboard-header hours-results-header">
        <div>
          <p className="eyebrow">Results dashboard</p>
          <h2>{results.title}</h2>
          <div className="badge-row">
            <span className="badge">{results.branch}</span>
            <span className={`badge ${issueCount ? "status-error" : "status-ok"}`}>{issueCount ? "Differences Found" : "All Checks Passed"}</span>
            <span className="badge">Students ignored</span>
          </div>
        </div>
        <div className="dashboard-actions">
          <button className="secondary-button" type="button" onClick={() => onExport("combined")}><Download aria-hidden="true" /> Export Report</button>
          <button className="ghost-button" type="button" onClick={onReset}><RefreshCcw aria-hidden="true" /> Reset</button>
        </div>
      </div>
      <SummaryCards issueCount={issueCount} results={results} />
      <div className="tabs" role="tablist" aria-label="Results tabs">
        {(["synthesis", "overview", "teachers", "courses", "sessions", "quality", "settings"] as Tab[]).map((tab) => (
          <button className={`tab ${activeTab === tab ? "is-active" : ""}`} key={tab} onClick={() => onTab(tab)} type="button">{tabLabel(tab)}</button>
        ))}
      </div>
      <div className="tab-panel is-active">
        {activeTab === "synthesis" ? <SynthesisPanel issueCount={issueCount} results={results} review={review} /> : null}
        {activeTab === "overview" ? <OverviewPanel results={results} /> : null}
        {activeTab === "teachers" ? <TeachersPanel onExport={() => onExport("teachers")} results={results} /> : null}
        {activeTab === "courses" ? <CoursesPanel onExport={() => onExport("courses")} results={results} /> : null}
        {activeTab === "sessions" ? <SessionsPanel onExport={() => onExport("sessions")} results={results} /> : null}
        {activeTab === "quality" ? <QualityPanel onExport={() => onExport("quality")} results={results} /> : null}
        {activeTab === "settings" ? (
          <>
            <div className="notice ok">Teacher-name mappings are stored only in this browser.</div>
            <TeacherMappingTable mappings={mappings} onMappingChange={onMappingChange} review={review} />
            <div className="footer-actions">
              <button className="primary-button" disabled={pending} type="button" onClick={onRerun}>{pending ? "Re-running..." : "Save Names & Re-run"}</button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function ProcessingOverlay({ detail, title }: ProcessingState) {
  return (
    <div aria-live="polite" aria-modal="true" className="processing-overlay" role="alertdialog">
      <div className="processing-card">
        <div className="processing-spinner" aria-hidden="true" />
        <div>
          <p className="eyebrow">Processing</p>
          <h2>{title}</h2>
          <p>{detail}</p>
          <p className="support-note">Please keep this tab open. Uploaded files stay local to this browser.</p>
        </div>
      </div>
    </div>
  );
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function runHoursWorker(request: HoursWorkerRequest): Promise<HoursWorkerResponse> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./hours-worker.ts", import.meta.url), { type: "module" });
    const cleanup = () => worker.terminate();
    worker.onmessage = (event: MessageEvent<HoursWorkerResponse>) => {
      const response = event.data;
      if (response.requestId !== request.requestId) return;
      cleanup();
      if (response.type === "error") {
        reject(new Error(response.message));
        return;
      }
      resolve(response);
    };
    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || "Hours Cross-Check worker failed."));
    };
    worker.postMessage(request);
  });
}

function cryptoId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`.replace(/[^a-z0-9-]/gi, "");
}

function TeacherMappingTable({ mappings, onMappingChange, review }: { mappings: TeacherMappings; onMappingChange: (tngKey: string, value: string) => void; review: TeacherReview }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Teach and Go teacher</th><th>TNG hours</th><th>Suggested class-list tutor</th><th>Status</th></tr></thead>
        <tbody>
          {review.items.map((item) => (
            <tr key={item.tngKey}>
              <td><strong>{item.tngName}</strong><br /><span>{item.tngKey}</span></td>
              <td>{formatHours(item.tngHours)}</td>
              <td>
                <select value={mappings[item.tngKey] || item.selectedClassKey || "__none__"} onChange={(event) => onMappingChange(item.tngKey, event.target.value)}>
                  <option value="__none__">No match / separate teacher</option>
                  {item.candidates.map((candidate) => (
                    <option key={candidate.key} value={candidate.key}>{candidate.name} ({formatHours(candidate.hours)}h, {Math.round(candidate.score * 100)}%)</option>
                  ))}
                </select>
              </td>
              <td><span className={`status-pill ${item.status === "Needs review" ? "error" : "ok"}`}>{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryCards({ issueCount, results }: { issueCount: number; results: ReconciliationResults }) {
  return (
    <div className="summary-grid">
      <Metric label="Teach and Go Hours" value={formatHours(results.overall.tngHours)} />
      <Metric label="Class-list Hours" value={formatHours(results.overall.classHours)} />
      <Metric label="Net Difference" value={signedHours(results.overall.difference)} />
      <Metric label="Teachers Reviewed" value={String(results.overall.teachers)} />
      <Metric label="Courses Seen" value={String(results.overall.courses)} />
      <Metric label="Items Requiring Attention" value={String(issueCount)} />
    </div>
  );
}

function SynthesisPanel({ issueCount, results, review }: { issueCount: number; results: ReconciliationResults; review: TeacherReview }) {
  const needsReview = review.items.filter((item) => item.status === "Needs review").length;
  const teacherDriver = results.teacherRows.find((row) => row.status !== "Matched");
  return (
    <div className="overview-grid">
      <article className="plain-card">
        <h3>{Math.abs(results.overall.difference) <= 0.01 ? "The two sources reconcile at the total-hour level." : `The sources differ by ${formatHours(Math.abs(results.overall.difference))} hours.`}</h3>
        <p>{issueCount ? "Focus first on remaining teacher-name reviews, teacher variances, and source-only sessions." : "No major exceptions were detected."}</p>
      </article>
      <article className="plain-card">
        <h3>Review priorities</h3>
        <ul className="status-list">
          <li><span>Teacher names left</span><strong>{needsReview}</strong></li>
          <li><span>Largest teacher variance</span><strong>{teacherDriver ? `${teacherDriver.displayName}: ${signedHours(teacherDriver.difference)}` : "None"}</strong></li>
          <li><span>Session exceptions</span><strong>{results.sessionMatches.filter((row) => row.status !== "Matched").length}</strong></li>
        </ul>
      </article>
    </div>
  );
}

function OverviewPanel({ results }: { results: ReconciliationResults }) {
  return (
    <div className="overview-grid">
      <article className="plain-card">
        <h3>Overall hour check</h3>
        <p>{Math.abs(results.overall.difference) <= 0.01 ? "Overall hours match within tolerance after teacher-name verification." : `Class-list is ${results.overall.difference > 0 ? "higher" : "lower"} than Teach and Go by ${formatHours(Math.abs(results.overall.difference))} hours.`}</p>
      </article>
      <article className="plain-card">
        <h3>Session summary</h3>
        <ul className="status-list">
          {Object.entries(results.sessionMatches.reduce<Record<string, number>>((acc, row) => ({ ...acc, [row.status]: (acc[row.status] || 0) + 1 }), {})).map(([status, count]) => (
            <li key={status}><span>{status}</span><strong>{count}</strong></li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function TeachersPanel({ onExport, results }: { onExport: () => void; results: ReconciliationResults }) {
  return <DataTable action={onExport} headers={["Teacher", "Teach and Go", "Class-list", "Difference", "Status"]} rows={results.teacherRows.map((row) => [row.displayName, formatHours(row.tngHours), formatHours(row.classHours), signedHours(row.difference), row.status])} />;
}

function CoursesPanel({ onExport, results }: { onExport: () => void; results: ReconciliationResults }) {
  return <DataTable action={onExport} headers={["Course", "Source", "Hours", "Sessions"]} rows={results.courseRows.map((row) => [row.displayName, row.source, formatHours(row.hours), String(row.sessions.length)])} />;
}

function SessionsPanel({ onExport, results }: { onExport: () => void; results: ReconciliationResults }) {
  return <DataTable action={onExport} headers={["Date", "Time", "Teacher", "TNG course", "Class course", "TNG hours", "Class hours", "Diff", "Confidence", "Status", "Reason"]} rows={results.sessionMatches.map((row) => [formatDate(row.date), row.time, row.teacher, row.tngCourse, row.classCourse, formatHours(row.tngDuration), formatHours(row.classDuration), signedHours(row.difference), `${row.confidence}%`, row.status, row.reason])} />;
}

function QualityPanel({ onExport, results }: { onExport: () => void; results: ReconciliationResults }) {
  return <DataTable action={onExport} headers={["Source", "Row", "Warning"]} rows={results.warnings.map((row) => [row.source, String(row.row), row.message])} />;
}

function DataTable({ action, headers, rows }: { action: () => void; headers: string[]; rows: string[][] }) {
  return (
    <>
      <div className="control-bar"><button className="secondary-button" type="button" onClick={action}><Download aria-hidden="true" /> Export</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td colSpan={headers.length}>No rows.</td></tr>}</tbody>
        </table>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="mini-card"><span>{label}</span><strong>{value}</strong></article>;
}

function tabLabel(tab: Tab) {
  return tab === "quality" ? "Data Quality" : tab === "settings" ? "Teacher Names" : tab[0].toUpperCase() + tab.slice(1);
}

function downloadReport(kind: "teachers" | "courses" | "sessions" | "quality" | "combined", results: ReconciliationResults) {
  if (kind === "combined") {
    downloadBlob(fileName(results, "combined-report").replace(".csv", ".json"), "application/json", JSON.stringify(results, null, 2));
    return;
  }
  const rows = kind === "teachers"
    ? teacherExportRows(results)
    : kind === "courses"
      ? courseExportRows(results)
      : kind === "sessions"
        ? sessionExportRows(results)
        : results.warnings;
  downloadBlob(fileName(results, kind), "text/csv;charset=utf-8", exportRowsCsv(rows));
}

function downloadBlob(name: string, type: string, content: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
