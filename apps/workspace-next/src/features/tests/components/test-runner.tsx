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
  const activeQuestionItems = useMemo(() => groupScienceQuestions(active?.questions || []), [active]);

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
          <TestAudio mode={test.audioMode} src={test.audioSrc} />
        </div>
        <div className="header-actions">
          <span className="badge">{answeredCount}/{questions.length} answered</span>
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
                  <article className={`story-panel test-story-${test.id}-${active.id}`}>
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
                {activeQuestionItems.map((item) => isScienceQuestionGroup(item) ? (
                  <ScienceQuestionGroupRenderer answers={answers} group={item} key={item.id} onChange={updateAnswer} />
                ) : (
                  <QuestionRenderer
                    answer={answers[item.id]}
                    key={item.id}
                    question={item}
                    onChange={(value) => updateAnswer(item.id, value)}
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

function TestAudio({ mode = "standard", src }: { mode?: TestDefinition["audioMode"]; src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [pending, setPending] = useState(false);
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
    <div className="locked-audio">
      <audio ref={audioRef} preload="auto" src={src}>
        Your browser does not support audio playback.
      </audio>
      <button className="primary-button locked-audio-button" disabled={pending || started} onClick={startAudio} type="button">
        {started ? "Audio locked" : pending ? "Starting..." : "Start listening"}
      </button>
      <div>
        <strong>{time}</strong>
        <span>{status}</span>
      </div>
    </div>
  );
}

function formatAudioTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

type ScienceQuestionGroup = {
  id: string;
  number: number;
  questions: TestQuestion[];
  visuals?: NonNullable<TestQuestion["visuals"]>;
};

function groupScienceQuestions(questions: TestQuestion[]): Array<TestQuestion | ScienceQuestionGroup> {
  const groupedNumbers = new Set([4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16]);
  const groupByNumberOnly = new Set([4, 7, 11]);
  const items: Array<TestQuestion | ScienceQuestionGroup> = [];
  let index = 0;

  while (index < questions.length) {
    const question = questions[index];
    if (!question.id.startsWith("spip-y7s-") || !groupedNumbers.has(question.number)) {
      items.push(question);
      index += 1;
      continue;
    }

    const firstImage = firstImageSrc(question);
    const hasSharedVisual = !groupByNumberOnly.has(question.number) && Boolean(firstImage);
    const groupQuestions = [question];
    let nextIndex = index + 1;
    while (nextIndex < questions.length) {
      const next = questions[nextIndex];
      if (
        next.number !== question.number ||
        !next.id.startsWith("spip-y7s-") ||
        (!groupByNumberOnly.has(question.number) && firstImageSrc(next) !== firstImage)
      ) break;
      groupQuestions.push(next);
      nextIndex += 1;
    }

    if (groupQuestions.length > 1) {
      items.push({
        id: `spip-y7s-q${question.number}-group`,
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
          <h3>Question {group.number}</h3>
        </div>
        <span className="badge">{points} {points === 1 ? "mark" : "marks"}</span>
      </div>
      {group.visuals?.length ? <QuestionVisuals visuals={group.visuals} /> : null}
      <div className="science-subquestion-list">
        {group.questions.map((question) => (
          <QuestionRenderer
            answer={answers[question.id]}
            hideVisuals={Boolean(group.visuals?.length)}
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
