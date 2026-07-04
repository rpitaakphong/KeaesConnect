"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getAssignment } from "@/features/assignments/assignment-api";
import type { TestDefinition, StudentProfile } from "@/features/tests/lib/types";
import { clearSavedAnswers, saveStudentProfile } from "@/features/tests/lib/profile-storage";
import { cleanText } from "@/lib/formatting/text";

export function StudentGate({ test }: { test: TestDefinition }) {
  const [assignmentToken, setAssignmentToken] = useState("");
  const [status, setStatus] = useState("Loading assignment...");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("assignment") || "";
    setAssignmentToken(token);
    if (!token) {
      setStatus("This link is missing an assignment token. Ask staff to generate a fresh test link.");
      return;
    }
    getAssignment(token, test)
      .then((assignment) => {
        if (!assignment || assignment.test_id !== test.id) {
          setStatus("This assignment link is invalid or inactive. Ask staff for a new link.");
          return;
        }
        setStatus("Your details will be attached to your submitted score for admin review.");
        setReady(true);
      })
      .catch((err) => setStatus(err instanceof Error ? err.message : "Could not load assignment."));
  }, [test]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const profile: StudentProfile = {
      fullName: cleanText(values.get("fullName")),
      nickname: cleanText(values.get("nickname")),
      dateOfBirth: cleanText(values.get("dateOfBirth")),
      subject: test.subject,
      level: test.level,
      testDate: cleanText(values.get("testDate")),
      testId: test.id,
      assignmentToken,
    };
    if (["fullName", "nickname", "dateOfBirth", "testDate"].some((key) => !profile[key as keyof StudentProfile])) {
      event.currentTarget.reportValidity();
      return;
    }
    saveStudentProfile(profile);
    clearSavedAnswers(test.id, assignmentToken);
    window.location.href = `/tests/${test.id}/take?assignment=${encodeURIComponent(assignmentToken)}`;
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <main id="main" className="app-shell">
        <section className="login-layout" aria-labelledby="studentGateTitle">
          <article className="login-copy">
            <p className="eyebrow">{test.level}</p>
            <h1 id="studentGateTitle">{test.title}</h1>
            {test.durationMinutes ? <p>{test.durationMinutes} minutes</p> : null}
            <p>{status}</p>
          </article>
          <form className="login-card" onSubmit={handleSubmit}>
            <h2>Student details</h2>
            <label>Full name<input name="fullName" autoComplete="name" required disabled={!ready} /></label>
            <label>Nickname<input name="nickname" required disabled={!ready} /></label>
            <label>Date of birth<input name="dateOfBirth" type="date" required disabled={!ready} /></label>
            <label>Test date<input name="testDate" type="date" required defaultValue={today} disabled={!ready} /></label>
            <div className="field-grid">
              <label>Subject<input value={test.subject} readOnly /></label>
              <label>Level<input value={test.level} readOnly /></label>
            </div>
            <button className="primary-button" type="submit" disabled={!ready}>Start test</button>
          </form>
        </section>
      </main>
    </>
  );
}
