"use client";

import { useEffect, useMemo, useState } from "react";
import type { StudentProfile, SubmitResult, TestAnswers, TestDefinition } from "@/features/tests/lib/types";
import { loadAnswers, loadStudentProfile, saveAnswers } from "@/features/tests/lib/profile-storage";
import { submitAttempt } from "@/features/tests/lib/submission-api";
import { QuestionRenderer } from "@/features/tests/components/question-renderer";

export function TestRunner({ test }: { test: TestDefinition }) {
  const [assignmentToken, setAssignmentToken] = useState("");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [answers, setAnswers] = useState<TestAnswers>({});
  const [activeSection, setActiveSection] = useState(test.sections[0]?.id || "");
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("assignment") || "";
    setAssignmentToken(token);
    const savedProfile = loadStudentProfile(test.id, token);
    if (!savedProfile) {
      window.location.href = `/tests/${test.id}/start?assignment=${encodeURIComponent(token)}`;
      return;
    }
    setProfile(savedProfile);
    setAnswers(loadAnswers(test.id, token));
  }, [test.id]);

  const questions = useMemo(() => test.sections.flatMap((section) => section.questions), [test.sections]);
  const answeredCount = questions.filter((question) => isAnswered(answers[question.id])).length;
  const active = test.sections.find((section) => section.id === activeSection) || test.sections[0];

  function updateAnswer(questionId: string, value: TestAnswers[string]) {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    saveAnswers(test.id, assignmentToken, next);
  }

  async function handleSubmit() {
    if (!profile || pending || result) return;
    setPending(true);
    setSubmitError("");
    try {
      setResult(await submitAttempt(profile, answers, test));
      setActiveSection("review");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit test.");
    } finally {
      setPending(false);
    }
  }

  if (!profile) {
    return <main className="app-shell"><div className="notice">Loading test...</div></main>;
  }

  return (
    <>
      <a className="skip-link" href="#test">Skip to test</a>
      <header className="exam-header">
        <div>
          <p className="eyebrow">{test.level}</p>
          <h1>{test.title}</h1>
          <p>{profile.fullName} · {profile.nickname}</p>
          {test.audioSrc ? (
            <audio className="test-audio" controls src={test.audioSrc}>
              Your browser does not support audio playback.
            </audio>
          ) : null}
        </div>
        <div className="header-actions">
          <span className="badge">{answeredCount}/{questions.length} answered</span>
          <button className="primary-button" type="button" onClick={handleSubmit} disabled={pending || Boolean(result)}>
            {pending ? "Submitting..." : result ? "Submitted" : "Submit test"}
          </button>
        </div>
      </header>

      <main id="test" className="test-shell">
        <div className="test-workspace">
          <aside className="part-nav" aria-label="Test sections">
            {test.sections.map((section) => (
              <button
                className={`part-tab ${section.id === activeSection ? "is-active" : ""}`}
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
            <button className={`part-tab ${activeSection === "review" ? "is-active" : ""}`} type="button" onClick={() => setActiveSection("review")}>
              Review
            </button>
          </aside>

          <section className="test-panel">
            {activeSection === "review" ? (
              <ReviewPanel
                answers={answers}
                answeredCount={answeredCount}
                error={submitError}
                onSubmit={handleSubmit}
                pending={pending}
                questionCount={questions.length}
                result={result}
              />
            ) : (
              <>
                <div className="section-head">
                  <div>
                    <p className="eyebrow">{active.label} - {active.questions.length} questions</p>
                    <h2>{active.title}</h2>
                    {active.hint ? <p>{active.hint}</p> : null}
                  </div>
                </div>
                {active.wordBank?.length ? (
                  <div className="word-bank" aria-label="Word bank">
                    {active.wordBank.map((word) => <span key={word}>{word}</span>)}
                  </div>
                ) : null}
                {active.story?.length ? (
                  <article className="story-panel">
                    {active.storyTitle ? <h3>{active.storyTitle}</h3> : null}
                    <div className={active.storyImage ? "story-with-image" : ""}>
                      <div>
                        {active.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                      {active.storyImage ? (
                        <figure className="story-figure" style={{ maxWidth: active.storyImage.maxWidth || 260 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={active.storyImage.src} alt={active.storyImage.alt} />
                        </figure>
                      ) : null}
                    </div>
                  </article>
                ) : null}
                {active.questions.map((question) => (
                  <QuestionRenderer
                    answer={answers[question.id]}
                    key={question.id}
                    question={question}
                    onChange={(value) => updateAnswer(question.id, value)}
                  />
                ))}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function ReviewPanel({
  answeredCount,
  error,
  onSubmit,
  pending,
  questionCount,
  result,
}: {
  answers: TestAnswers;
  answeredCount: number;
  error: string;
  onSubmit: () => void;
  pending: boolean;
  questionCount: number;
  result: SubmitResult | null;
}) {
  return (
    <article className="question-card">
      <p className="eyebrow">Review</p>
      <h2>Check your answers.</h2>
      <p>{answeredCount} of {questionCount} questions have an answer. Blank answers are marked incorrect.</p>
      {error ? <div className="notice error">{error}</div> : null}
      {result ? (
        <div className="notice">
          <h3>Total score</h3>
          <p>{result.total}/{result.possible}</p>
        </div>
      ) : (
        <button className="primary-button" type="button" onClick={onSubmit} disabled={pending}>
          {pending ? "Submitting..." : "Submit test"}
        </button>
      )}
    </article>
  );
}

function isAnswered(value: unknown) {
  if (typeof value === "string") return value.trim().length > 0;
  if (value && typeof value === "object") return Object.values(value).some((item) => String(item || "").trim().length > 0);
  return false;
}
