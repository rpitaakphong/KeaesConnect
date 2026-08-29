"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StudentProfile, SubmitResult, TestAnswers, TestDefinition, TestQuestion } from "@/features/tests/lib/types";
import { loadAnswers, loadStudentProfile, saveAnswers } from "@/features/tests/lib/profile-storage";
import { submitAttempt } from "@/features/tests/lib/submission-api";
import { QuestionRenderer, QuestionVisuals } from "@/features/tests/components/question-renderer";

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
    if (!savedProfile || savedProfile.testId !== test.id) {
      window.location.href = `/tests/${test.id}/start?assignment=${encodeURIComponent(token)}`;
      return;
    }
    setProfile(savedProfile);
    setAnswers(loadAnswers(test.id, token));
  }, [test.id]);

  const questions = useMemo(() => test.sections.flatMap((section) => section.questions), [test.sections]);
  const answeredCount = questions.filter((question) => isAnswered(answers[question.id])).length;
  const active = test.sections.find((section) => section.id === activeSection) || test.sections[0];
  const activeQuestionItems = useMemo(
    () => groupScienceQuestions(active?.questions || [], Boolean(active?.groupByQuestionNumber)),
    [active],
  );
  const activeQuestionCount = active?.groupByQuestionNumber
    ? new Set(active.questions.map((question) => question.number)).size
    : active?.questions.length || 0;

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
          <p>{profile.fullName} · {profile.nickname}{test.durationMinutes ? ` · ${test.durationMinutes} minutes` : ""}</p>
          <TestAudio confirmation={test.audioStartConfirmation} mode={test.audioMode} src={test.audioSrc} />
        </div>
        <div className="header-actions">
          <span className="badge">{answeredCount}/{questions.length} answered</span>
        </div>
      </header>

      <main id="test" className="test-shell" data-test-id={test.id}>
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
            <button className={`part-tab review-submit-tab ${activeSection === "review" ? "is-active" : ""}`} type="button" onClick={() => setActiveSection("review")}>
              Review and Submit
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
                    <p className="eyebrow">{active.label} - {activeQuestionCount} questions</p>
                    <h2>{active.title}</h2>
                    {active.hint ? <p>{active.hint}</p> : null}
                  </div>
                </div>
                {active.wordBank?.length ? (
                  <div className="word-bank" aria-label="Word bank">
                    {active.wordBank.map((word) => <span key={word}>{word}</span>)}
                  </div>
                ) : null}
                {active.transformationExample ? <TransformationExample example={active.transformationExample} /> : null}
                {active.story?.length ? (
                  <article className={`story-panel test-story-${test.id}-${active.id} ${storyPanelLayoutClass(active.storyLayout)}`}>
                    {active.storyTitle ? <h3>{active.storyTitle}</h3> : null}
                    <div className={active.storyImage ? "story-with-image" : ""}>
                      {active.storyImage && active.storyLayout === "imageFirst" ? (
                        <figure className="story-figure" style={{ maxWidth: active.storyImage.maxWidth || 260 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={active.storyImage.src} alt={active.storyImage.alt} />
                        </figure>
                      ) : null}
                      <div>
                        {active.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                      {active.storyImage && active.storyLayout !== "imageFirst" ? (
                        <figure className="story-figure" style={{ maxWidth: active.storyImage.maxWidth || 260 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={active.storyImage.src} alt={active.storyImage.alt} />
                        </figure>
                      ) : null}
                    </div>
                  </article>
                ) : null}
                {active.visuals?.length ? <QuestionVisuals visuals={active.visuals} /> : null}
                {active.questionLayout === "grouped" ? (
                  <GroupedQuestionCard answers={answers} questions={active.questions} title={active.title} onChange={updateAnswer} />
                ) : (
                  activeQuestionItems.map((item) => isScienceQuestionGroup(item) ? (
                    <ScienceQuestionGroupRenderer answers={answers} group={item} key={item.id} onChange={updateAnswer} />
                  ) : (
                    <QuestionRenderer
                      answer={answers[item.id]}
                      key={item.id}
                      question={item}
                      onChange={(value) => updateAnswer(item.id, value)}
                    />
                  ))
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function TestAudio({
  confirmation,
  mode = "standard",
  src,
}: {
  confirmation?: TestDefinition["audioStartConfirmation"];
  mode?: TestDefinition["audioMode"];
  src?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [status, setStatus] = useState("Start when the teacher tells you to begin.");
  const [time, setTime] = useState("00:00 / --:--");

  useEffect(() => {
    if (!src || mode !== "lockedOnceStarted") return;
    const audio = audioRef.current;
    if (!audio) return;
    const audioElement = audio;

    function updateTime() {
      const duration = Number.isFinite(audioElement.duration) ? audioElement.duration : 0;
      setTime(`${formatAudioTime(audioElement.currentTime)} / ${duration ? formatAudioTime(duration) : "--:--"}`);
    }

    function handlePause() {
      if (!started || ended) return;
      audioElement.play().catch(() => setStatus("Playback was interrupted. Keep this page active so the audio can continue."));
    }

    function handleEnded() {
      setEnded(true);
      setStatus("Listening audio finished.");
    }

    audioElement.addEventListener("loadedmetadata", updateTime);
    audioElement.addEventListener("timeupdate", updateTime);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);
    return () => {
      audioElement.removeEventListener("loadedmetadata", updateTime);
      audioElement.removeEventListener("timeupdate", updateTime);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [ended, mode, src, started]);

  if (!src) return null;
  if (mode !== "lockedOnceStarted") {
    return (
      <audio className="test-audio" controls src={src}>
        Your browser does not support audio playback.
      </audio>
    );
  }

  async function startAudio() {
    const audio = audioRef.current;
    if (!audio || pending || started) return;
    setPending(true);
    try {
      audio.currentTime = 0;
      await audio.play();
      setStarted(true);
      setStatus("Listening audio is playing. It cannot be paused or replayed from this page.");
    } catch {
      setStatus("Audio could not start. Tap Start listening again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="locked-audio">
        <audio ref={audioRef} preload="auto" src={src}>
          Your browser does not support audio playback.
        </audio>
        <button
          className="primary-button locked-audio-button"
          disabled={pending || started}
          onClick={() => confirmation ? setConfirmOpen(true) : void startAudio()}
          type="button"
        >
          {started ? "Audio locked" : pending ? "Starting..." : "Start listening"}
        </button>
        <div>
          <strong>{time}</strong>
          <span>{status}</span>
        </div>
      </div>
      {confirmation && confirmOpen ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setConfirmOpen(false)}>
          <section
            aria-labelledby="audioStartConfirmationTitle"
            aria-modal="true"
            className="audio-confirmation-dialog"
            role="alertdialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div>
              <p className="eyebrow">Listening section</p>
              <h2 id="audioStartConfirmationTitle">{confirmation.title}</h2>
              <p>{confirmation.message}</p>
            </div>
            <div className="button-row audio-confirmation-actions">
              <button className="ghost-button" onClick={() => setConfirmOpen(false)} type="button">
                {confirmation.cancelLabel || "Cancel"}
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  setConfirmOpen(false);
                  void startAudio();
                }}
                type="button"
              >
                {confirmation.confirmLabel || "Start listening"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function TransformationExample({ example }: { example: NonNullable<TestDefinition["sections"][number]["transformationExample"]> }) {
  return (
    <section aria-label="Worked example" className="transformation-example">
      <h3>Example</h3>
      <div className="transformation-example-source">
        <strong>{example.number}</strong>
        <span>{example.source}</span>
      </div>
      <strong className="transformation-example-keyword">{example.keyword}</strong>
      <p className="transformation-example-sentence">
        <span>{example.sentencePrefix}</span>
        <span aria-label="missing words" className="transformation-example-gap" />
        <span>{example.sentenceSuffix}</span>
      </p>
      <p>{example.explanation}</p>
      <div className="transformation-example-answer">
        <strong>{example.number}</strong>
        <span>{example.answer}</span>
      </div>
      <p className="transformation-example-footer">{example.footer}</p>
    </section>
  );
}

function storyPanelLayoutClass(layout: TestDefinition["sections"][number]["storyLayout"]) {
  if (layout === "heroImage") return "story-panel-hero-image";
  if (layout === "imageFirst") return "story-panel-image-first";
  return "";
}

function formatAudioTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

type ScienceQuestionGroup = {
  id: string;
  intro?: NonNullable<TestQuestion["groupIntro"]>;
  number: number;
  questions: TestQuestion[];
  visuals?: NonNullable<TestQuestion["visuals"]>;
};

function groupScienceQuestions(questions: TestQuestion[], groupAllByNumber = false): Array<TestQuestion | ScienceQuestionGroup> {
  const groupedNumbers = new Set([4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16]);
  const groupByNumberOnly = new Set([4, 7, 11]);
  const items: Array<TestQuestion | ScienceQuestionGroup> = [];
  let index = 0;

  while (index < questions.length) {
    const question = questions[index];
    const shouldGroup = groupAllByNumber || (question.id.startsWith("spip-y7s-") && groupedNumbers.has(question.number));
    if (!shouldGroup) {
      items.push(question);
      index += 1;
      continue;
    }

    const firstImage = firstImageSrc(question);
    const hasSharedVisual = Boolean(firstImage) && (groupAllByNumber || !groupByNumberOnly.has(question.number));
    const groupQuestions = [question];
    let nextIndex = index + 1;
    while (nextIndex < questions.length) {
      const next = questions[nextIndex];
      if (
        next.number !== question.number ||
        (!groupAllByNumber && !next.id.startsWith("spip-y7s-")) ||
        (!groupAllByNumber && !groupByNumberOnly.has(question.number) && firstImageSrc(next) !== firstImage)
      ) break;
      groupQuestions.push(next);
      nextIndex += 1;
    }

    if (groupQuestions.length > 1) {
      items.push({
        id: `${groupAllByNumber ? "question" : "spip-y7s"}-q${question.number}-group`,
        intro: question.groupIntro,
        number: question.number,
        questions: groupQuestions,
        visuals: hasSharedVisual ? question.visuals : undefined,
      });
    } else {
      items.push(question);
    }
    index = nextIndex;
  }

  return items;
}

function firstImageSrc(question: TestQuestion) {
  const visual = question.visuals?.find((item) => item.type === "image");
  return visual?.type === "image" ? visual.src : "";
}

function isScienceQuestionGroup(item: TestQuestion | ScienceQuestionGroup): item is ScienceQuestionGroup {
  return "questions" in item;
}

function GroupedQuestionCard({
  answers,
  onChange,
  questions,
  title,
}: {
  answers: TestAnswers;
  onChange: (questionId: string, value: TestAnswers[string]) => void;
  questions: TestQuestion[];
  title: string;
}) {
  const firstNumber = questions[0]?.number;
  const lastNumber = questions[questions.length - 1]?.number;
  const points = questions.reduce((total, question) => total + question.points, 0);
  const numberLabel = firstNumber === lastNumber ? `Question ${firstNumber}` : `Questions ${firstNumber}-${lastNumber}`;

  return (
    <article className="question-card grouped-question-card">
      <div className="question-head">
        <div>
          <p className="eyebrow">{numberLabel}</p>
          <h3>{title}</h3>
        </div>
        <span className="badge">{points} {points === 1 ? "mark" : "marks"}</span>
      </div>
      <div className="science-subquestion-list">
        {questions.map((question) => (
          <QuestionRenderer
            answer={answers[question.id]}
            key={question.id}
            onChange={(value) => onChange(question.id, value)}
            question={question}
            variant="subquestion"
          />
        ))}
      </div>
    </article>
  );
}

function ScienceQuestionGroupRenderer({
  answers,
  group,
  onChange,
}: {
  answers: TestAnswers;
  group: ScienceQuestionGroup;
  onChange: (questionId: string, value: TestAnswers[string]) => void;
}) {
  const points = group.questions.reduce((total, question) => total + question.points, 0);
  return (
    <article className="question-card science-question-group">
      <div className="question-head">
        <div>
          <p className="eyebrow">Question {group.number}</p>
        </div>
        <span className="badge">{points} {points === 1 ? "mark" : "marks"}</span>
      </div>
      {group.intro ? <QuestionGroupIntro intro={group.intro} /> : null}
      {group.visuals?.length ? <QuestionVisuals visuals={group.visuals} /> : null}
      <div className="science-subquestion-list">
        {group.questions.map((question) => (
          <QuestionRenderer
            answer={answers[question.id]}
            hideImageVisuals={Boolean(group.visuals?.length)}
            key={question.id}
            onChange={(value) => onChange(question.id, value)}
            question={question}
            variant="subquestion"
          />
        ))}
      </div>
    </article>
  );
}

function QuestionGroupIntro({ intro }: { intro: NonNullable<TestQuestion["groupIntro"]> }) {
  return (
    <div className="question-group-intro">
      {intro.lead ? <p>{intro.lead}</p> : null}
      {intro.items?.length ? (
        <div aria-label="Given values" className="question-group-values">
          {intro.items.map((item) => <span key={item}>{item}</span>)}
        </div>
      ) : null}
      {intro.table ? (
        <div className="question-group-table-wrap">
          <table className="cambridge-data-table">
            <thead>
              <tr>{intro.table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {intro.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {intro.instruction ? <p>{intro.instruction}</p> : null}
    </div>
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
