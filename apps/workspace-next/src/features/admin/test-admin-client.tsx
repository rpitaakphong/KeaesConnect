"use client";

import { Copy, ExternalLink, Link as LinkIcon, RefreshCcw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildAssignmentUrl, createAssignment, getResult, listResults, listTests } from "@/features/admin/admin-api";
import type { AdminResult, CatalogTest } from "@/features/admin/types";
import { requireStaffProfile } from "@/features/auth/auth-api";
import type { StaffProfile } from "@/features/auth/types";
import { hasAnyPermission, hasPermission } from "@/lib/permissions/permissions";

export function TestAdminClient() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [tests, setTests] = useState<CatalogTest[]>([]);
  const [selectedId, setSelectedId] = useState("math-olympiad-2");
  const [catalogSubjectFilter, setCatalogSubjectFilter] = useState("");
  const [catalogCourseFilter, setCatalogCourseFilter] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Loading catalog...");
  const [pending, setPending] = useState(false);
  const [results, setResults] = useState<AdminResult[]>([]);
  const [resultStatus, setResultStatus] = useState("Loading results...");
  const [resultSearch, setResultSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [selectedResult, setSelectedResult] = useState<AdminResult | null>(null);
  const [resultPending, setResultPending] = useState(false);

  const catalogSubjectOptions = useMemo(() => uniqueSorted(tests.map((test) => test.subject)), [tests]);
  const catalogCourseOptions = useMemo(() => uniqueSorted(tests.map(courseFamily)), [tests]);
  const visibleCatalogTests = useMemo(() => tests.filter((test) => {
    const matchesSubject = !catalogSubjectFilter || test.subject === catalogSubjectFilter;
    const matchesCourse = !catalogCourseFilter || courseFamily(test) === catalogCourseFilter;
    return matchesSubject && matchesCourse;
  }), [catalogCourseFilter, catalogSubjectFilter, tests]);
  const selectedTest = useMemo(() => visibleCatalogTests.find((test) => test.id === selectedId) || visibleCatalogTests[0], [selectedId, visibleCatalogTests]);
  const canCatalog = hasAnyPermission(profile, ["test_catalog", "generate_links"]);
  const canGenerate = hasPermission(profile, "generate_links");
  const canViewResults = hasPermission(profile, "view_results");
  const canViewReports = hasPermission(profile, "view_reports");
  const visibleResults = useMemo(() => filterResults(results, resultSearch, courseFilter), [courseFilter, resultSearch, results]);
  const resultCourses = useMemo(() => {
    const byId = new Map(results.map((result) => [result.testId, result.testTitle]));
    return Array.from(byId, ([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
  }, [results]);

  const refreshCatalog = useCallback(async () => {
    try {
      const rows = await listTests();
      setTests(rows);
      setSelectedId((current) => rows.some((test) => test.id === current) ? current : rows[0]?.id || "");
      setStatus("Database mode");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not load catalog.");
    }
  }, []);

  const refreshResults = useCallback(async () => {
    if (!canViewResults) {
      setResultStatus("No result permission");
      return;
    }
    setResultStatus("Loading results...");
    try {
      const rows = await listResults();
      setResults(rows);
      setResultStatus(rows.length ? "Results loaded" : "No submitted results yet");
    } catch (err) {
      setResultStatus(err instanceof Error ? err.message : "Could not load results.");
    }
  }, [canViewResults]);

  useEffect(() => {
    requireStaffProfile().then(setProfile).catch(() => null);
    refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    if (profile) refreshResults();
  }, [profile, refreshResults]);

  useEffect(() => {
    if (!visibleCatalogTests.length) return;
    if (visibleCatalogTests.some((test) => test.id === selectedId)) return;
    setSelectedId(visibleCatalogTests[0].id);
    setShareUrl("");
    setMessage("");
  }, [selectedId, visibleCatalogTests]);

  async function generateLink() {
    if (!selectedTest) return;
    setPending(true);
    setMessage("");
    try {
      const assignment = await createAssignment(selectedTest.id);
      const url = buildAssignmentUrl(selectedTest, assignment.assignment_token);
      setShareUrl(url);
      setMessage([
        `Please complete ${selectedTest.title}.`,
        "",
        url,
        "",
        "Open the link, enter your details, and submit when you finish.",
      ].join("\n"));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not generate assignment link.");
    } finally {
      setPending(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
  }

  async function inspectResult(result: AdminResult) {
    setResultPending(true);
    try {
      setSelectedResult(canViewReports ? await getResult(result.id) : result);
    } catch {
      setSelectedResult(result);
    } finally {
      setResultPending(false);
    }
  }

  if (!profile) return <div className="notice">Loading staff access...</div>;
  if (!canCatalog) {
    return (
      <section className="notice error">
        <h1>Not authorized</h1>
        <p>Your staff account does not have access to the test catalog.</p>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Next.js test admin</p>
          <h1>Send tests and migrate shared assessments.</h1>
          <p className="hero-copy">All active tests generate `/tests/[testId]/start` links through the Next.js shared test runner.</p>
        </div>
        <div className="button-row">
          <a className="button ghost-button" href="/admin/test-inventory">Inventory</a>
          <span className="badge">{status}</span>
        </div>
      </section>

      <section className="admin-grid">
        <article className="panel test-catalog-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Test catalog</p>
              <h2>Available tests</h2>
            </div>
            <button className="ghost-button" type="button" onClick={refreshCatalog}>
              <RefreshCcw aria-hidden="true" /> Refresh
            </button>
          </div>
          <div className="catalog-filters" aria-label="Catalog filters">
            <label>
              Subject
              <select value={catalogSubjectFilter} onChange={(event) => setCatalogSubjectFilter(event.target.value)}>
                <option value="">All subjects</option>
                {catalogSubjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </label>
            <label>
              Course
              <select value={catalogCourseFilter} onChange={(event) => setCatalogCourseFilter(event.target.value)}>
                <option value="">All courses</option>
                {catalogCourseOptions.map((course) => <option key={course} value={course}>{course}</option>)}
              </select>
            </label>
          </div>
          <div className="test-list">
            {visibleCatalogTests.length ? visibleCatalogTests.map((test) => (
              <button
                className={`test-list-item ${test.id === selectedTest?.id ? "is-active" : ""}`}
                key={test.id}
                type="button"
                onClick={() => {
                  setSelectedId(test.id);
                  setShareUrl("");
                  setMessage("");
                }}
              >
                <div className="test-list-copy">
                  <h3>{test.title}</h3>
                  <p>
                    <span>{test.subject} · {test.level}</span>
                    <span className="test-course-pill">{courseFamily(test)}</span>
                  </p>
                </div>
              </button>
            )) : <div className="notice">No tests match the selected filters.</div>}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Send test</p>
              <h2>Generate link</h2>
            </div>
            <LinkIcon aria-hidden="true" />
          </div>
          {selectedTest ? (
            <div className="choice-grid">
              <div className="notice">
                <strong>{selectedTest.title}</strong>
                <p>This test opens in the Next.js shared test shell.</p>
              </div>
              <button className="primary-button" type="button" onClick={generateLink} disabled={!selectedTest || !canGenerate || pending}>
                {pending ? "Generating..." : "Generate assignment link"}
              </button>
              <label>
                Share URL
                <input value={shareUrl} readOnly placeholder={canGenerate ? "Generate a link first" : "Missing generate_links permission"} />
              </label>
              <div className="button-row">
                <button className="ghost-button" type="button" onClick={copyLink} disabled={!shareUrl}>
                  <Copy aria-hidden="true" /> Copy
                </button>
                <a className="button secondary-button" href={shareUrl || "#"} target="_blank" rel="noreferrer" aria-disabled={!shareUrl}>
                  <ExternalLink aria-hidden="true" /> Open
                </a>
              </div>
              <label>
                Message template
                <textarea value={message} readOnly rows={6} />
              </label>
            </div>
          ) : (
            <div className="notice">No tests available.</div>
          )}
        </article>
      </section>

      {canViewResults ? (
        <section className="panel results-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Student performance</p>
              <h2>Submitted results</h2>
            </div>
            <button className="ghost-button" type="button" onClick={refreshResults}>
              <RefreshCcw aria-hidden="true" /> Refresh
            </button>
          </div>
          <div className="results-controls">
            <label>
              Search student
              <span className="input-with-icon">
                <Search aria-hidden="true" />
                <input value={resultSearch} onChange={(event) => setResultSearch(event.target.value)} type="search" placeholder="Student name or nickname" />
              </span>
            </label>
            <label>
              Filter course
              <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
                <option value="">All courses</option>
                {resultCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>
          </div>
          <ResultTable
            canViewReports={canViewReports}
            loading={resultPending}
            onInspect={inspectResult}
            results={visibleResults}
            status={resultStatus}
            totalResults={results.length}
          />
        </section>
      ) : null}

      {selectedResult ? <ResultDetail result={selectedResult} onClose={() => setSelectedResult(null)} /> : null}
    </>
  );
}

function ResultTable({
  canViewReports,
  loading,
  onInspect,
  results,
  status,
  totalResults,
}: {
  canViewReports: boolean;
  loading: boolean;
  onInspect: (result: AdminResult) => void;
  results: AdminResult[];
  status: string;
  totalResults: number;
}) {
  if (!results.length) {
    return (
      <div className="notice">
        {totalResults ? "No results match the current filters." : status}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Test</th>
            <th>Subject</th>
            <th>Level</th>
            <th>Score</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td><strong>{result.student.fullName}</strong><br /><span>{result.student.nickname}</span></td>
              <td>{result.testTitle}</td>
              <td>{result.student.subject}</td>
              <td>{result.student.level}</td>
              <td><span className="score-pill">{formatScore(result.score.total)}/{formatScore(result.score.possible)} ({result.score.percent}%)</span></td>
              <td>{formatDate(result.submittedAt)}</td>
              <td>
                <div className="button-row">
                  <button className="ghost-button compact-button" type="button" onClick={() => onInspect(result)} disabled={loading}>
                    Inspect
                  </button>
                  {canViewReports ? (
                    <a className="button ghost-button compact-button" href={`/admin/tests/results/${result.id}`}>
                      Report
                    </a>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultDetail({ onClose, result }: { onClose: () => void; result: AdminResult }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="result-modal-card" role="dialog" aria-modal="true" aria-labelledby="resultDetailTitle" onMouseDown={(event) => event.stopPropagation()}>
        <div className="result-modal-head">
          <div>
            <p className="eyebrow">Result detail</p>
            <h2 id="resultDetailTitle">{result.student.fullName}</h2>
            <p>{result.student.nickname} · DOB {result.student.dateOfBirth}</p>
            <p>{result.testTitle} · {formatDate(result.submittedAt)}</p>
          </div>
          <button className="ghost-button compact-button" type="button" onClick={onClose} aria-label="Close result detail">
            <X aria-hidden="true" /> Close
          </button>
        </div>

        <section className="score-summary">
          <div><span>Total score</span><strong>{formatScore(result.score.total)}/{formatScore(result.score.possible)}</strong></div>
          <div><span>Percent</span><strong>{result.score.percent}%</strong></div>
          <div><span>Level</span><strong>{result.student.level}</strong></div>
        </section>

        <section>
          <h3>Part scores</h3>
          <div className="part-list">
            {result.partScores.length ? result.partScores.map((part) => (
              <div className="part-row" key={part.part}>
                <strong>{part.part}</strong>
                <span>{formatScore(part.total)}/{formatScore(part.possible)}</span>
              </div>
            )) : <p>No part scores available.</p>}
          </div>
        </section>

        <section>
          <h3>Corrections</h3>
          <div className="correction-list">
            {result.answers.length ? result.answers.map((answer, index) => (
              <div className={`correction-row ${answer.correct ? "" : "is-wrong"}`} key={`${answer.part}-${index}`}>
                <strong>{answer.part}: {answer.prompt}</strong>
                <span>Student: {answer.response || "-"} · Correct: {answer.correctAnswer || "-"} · Score: {formatScore(answer.score)}/{formatScore(answer.possible)}</span>
                {renderGradingDetails(answer.gradingDetails)}
              </div>
            )) : <p>No answer details available.</p>}
          </div>
        </section>
      </section>
    </div>
  );
}

function filterResults(results: AdminResult[], searchValue: string, courseFilter: string) {
  const search = normalizeSearch(searchValue);
  return results.filter((result) => {
    const matchesCourse = !courseFilter || result.testId === courseFilter;
    const searchableName = normalizeSearch(`${result.student.fullName} ${result.student.nickname}`);
    const matchesSearch = !search || searchableName.includes(search);
    return matchesCourse && matchesSearch;
  });
}

function courseFamily(test: CatalogTest) {
  const source = `${test.id} ${test.title} ${test.level}`.toLowerCase();
  if (source.includes("english-literacy")) return "English Literacy";
  if (source.includes("math-olympiad")) return "Math Olympiad";
  if (source.includes("spip")) return "SPIP Year 7";
  if (source.includes("starter-progress") || source.includes("starter")) return "Starter Progress";
  return test.level || "Other";
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function renderGradingDetails(details: Record<string, unknown> | null | undefined) {
  const parts = Array.isArray(details?.parts) ? details.parts : [];
  if (parts.length) {
    return (
      <span>
        Parts: {parts.map((part) => {
          const item = part as { id?: unknown; score?: unknown; possible?: unknown };
          return `${String(item.id || "")} ${formatScore(Number(item.score || 0))}/${formatScore(Number(item.possible || 0))}`;
        }).join(" · ")}
      </span>
    );
  }
  if (!details || typeof details !== "object" || !("contentScore" in details)) return null;
  return (
    <span>
      Content: {formatScore(Number(details.contentScore || 0))}/0.5 · Writing: {formatScore(Number(details.writingScore || 0))}/0.5
      {details.feedback ? ` · ${String(details.feedback)}` : ""}
    </span>
  );
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function normalizeSearch(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
