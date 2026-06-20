(function () {
  "use strict";

  const data = window.SpipEnglishPretestData;
  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || data?.testId || "spip-year-7-english-pre";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const answerStorageKey = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";

  const state = {
    currentPart: data?.parts?.[0]?.id || "listening1",
    profile: null,
    answers: {},
    submitted: false,
    submissionPending: false,
    submittedScore: null,
    savedResultId: null,
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!data) {
      document.querySelector("[data-test-panel]").innerHTML = "<p>SPIP test data could not be loaded.</p>";
      return;
    }
    if (!loadProfile()) return;
    loadAnswers();
    buildShell();
    bindEvents();
    bindAudio();
    renderAll();
  });

  function loadProfile() {
    const profile = readProfile();
    if (!profile) {
      const landingUrl = new URL("index.html", window.location.href);
      landingUrl.searchParams.set("testId", testId);
      if (assignmentToken) landingUrl.searchParams.set("assignment", assignmentToken);
      window.location.replace(landingUrl.href);
      return false;
    }
    state.profile = profile;
    document.querySelector("[data-test-meta]").textContent = `${profile.fullName} (${profile.nickname}) · ${profile.level} · Test date ${profile.testDate}`;
    return true;
  }

  function readProfile() {
    try {
      const stored = window.sessionStorage?.getItem(profileStorageKey);
      const profile = normalizeProfile(JSON.parse(stored || "null"));
      if (profile) return profile;
    } catch {
      // Fall through to tab-local storage for restricted browser contexts.
    }
    try {
      const parsed = JSON.parse(window.name || "{}");
      return normalizeProfile(parsed?.[windowNameKey]?.[profileStorageKey]);
    } catch {
      return null;
    }
  }

  function normalizeProfile(value) {
    if (!value || typeof value !== "object") return null;
    const profile = {
      fullName: cleanText(value.fullName),
      nickname: cleanText(value.nickname),
      dateOfBirth: cleanText(value.dateOfBirth),
      subject: cleanText(value.subject),
      level: cleanText(value.level),
      testDate: cleanText(value.testDate),
      testId: cleanText(value.testId || testId),
      assignmentToken: cleanText(value.assignmentToken || assignmentToken),
    };
    return ["fullName", "nickname", "dateOfBirth", "subject", "level", "testDate", "assignmentToken"].every((field) => profile[field]) ? profile : null;
  }

  function loadAnswers() {
    try {
      const stored = JSON.parse(window.sessionStorage?.getItem(answerStorageKey) || "null");
      if (stored && typeof stored === "object") state.answers = stored;
    } catch {
      // Ignore corrupt answer state.
    }
  }

  function saveAnswers() {
    try {
      window.sessionStorage?.setItem(answerStorageKey, JSON.stringify(state.answers));
    } catch {
      // Session persistence is best effort.
    }
  }

  function buildShell() {
    const navParts = [...data.parts, reviewPart()];
    document.querySelector("[data-part-nav]").innerHTML = navParts.map((part) => `
      <button class="part-tab" type="button" data-part-button="${escapeHtml(part.id)}">${escapeHtml(part.label)}</button>
    `).join("");
    document.querySelector("[data-test-panel]").innerHTML = navParts.map(renderPart).join("");
  }

  function renderPart(part) {
    if (part.id === "review") {
      return `
        <section class="part" id="${part.id}" data-part>
          <div class="part-heading">
            <div>
              <p class="eyebrow">${escapeHtml(part.label)}</p>
              <h2>${escapeHtml(part.title)}</h2>
            </div>
            <p class="hint">${escapeHtml(part.hint)}</p>
          </div>
          <div class="student-summary" data-student-summary></div>
          <div class="review-grid" data-review-grid></div>
          <div class="result-card" hidden data-result-card></div>
        </section>
      `;
    }
    return `
      <section class="part" id="${escapeHtml(part.id)}" data-part>
        <div class="part-heading">
          <div>
            <p class="eyebrow">${escapeHtml(part.label)} · ${part.questions.length} questions</p>
            <h2>${escapeHtml(part.title)}</h2>
          </div>
          <p class="hint">${escapeHtml(part.hint || "")}</p>
        </div>
        ${part.note ? `<div class="pending-note">${escapeHtml(part.note)}</div>` : ""}
        ${renderMaterial(part.material)}
        <div class="spip-question-list">
          ${part.questions.map((question) => renderQuestion(part, question)).join("")}
        </div>
      </section>
    `;
  }

  function renderQuestion(part, question) {
    return `
      <article class="question-card spip-question ${question.pending ? "is-pending" : ""}" data-question-card="${escapeHtml(question.id)}">
        <div class="question-head">
          <div>
            <p class="eyebrow">Question ${question.number}</p>
            <h3>${escapeHtml(question.prompt)}</h3>
          </div>
          <span class="mark-pill">${question.pending ? "pending" : `${question.points || 1} mark`}</span>
        </div>
        ${renderVisual(question.visual)}
        ${renderQuestionInput(question)}
      </article>
    `;
  }

  function renderQuestionInput(question) {
    if (question.responseType === "writing") {
      const answer = state.answers[question.id] || "";
      const wordCount = countWords(answer);
      return `
        <label class="spip-writing-answer">
          <span>Answer</span>
          <textarea data-answer="${escapeHtml(question.id)}" rows="8" autocomplete="off" placeholder="Write your card here.">${escapeHtml(answer)}</textarea>
        </label>
        <p class="word-count ${wordCount >= (question.minWords || 0) && wordCount <= (question.maxWords || Infinity) ? "is-ok" : ""}" data-word-count="${escapeHtml(question.id)}">
          ${wordCount} words · target ${question.minWords || 35}-${question.maxWords || 45} words
        </p>
      `;
    }
    if (question.responseType === "text") {
      return `
        <label class="spip-text-answer">
          <span>Answer</span>
          <input data-answer="${escapeHtml(question.id)}" autocomplete="off" value="${escapeHtml(state.answers[question.id] || "")}" placeholder="${question.pending ? "pending official answer key" : "type your answer"}">
        </label>
      `;
    }
    const choiceGridClass = [
      "choice-grid",
      "spip-choice-grid",
      question.visualChoices ? "visual-choice-grid" : "",
      shouldUseCompactChoiceGrid(question) ? "compact-choice-grid" : "",
    ].filter(Boolean).join(" ");
    return `
      <div class="${choiceGridClass}">
        ${question.choices.map((choice, index) => `
          <label class="spip-choice-card">
            <input type="radio" name="${escapeHtml(question.id)}" data-answer="${escapeHtml(question.id)}" value="${escapeHtml(choice.value)}" ${state.answers[question.id] === choice.value ? "checked" : ""}>
            ${renderOptionVisual(question.visualChoices?.[index], choice)}
            <strong>${escapeHtml(choice.label)}</strong>
          </label>
        `).join("")}
      </div>
    `;
  }

  function shouldUseCompactChoiceGrid(question) {
    if (question.visualChoices || !Array.isArray(question.choices) || question.choices.length < 4) return false;
    return question.choices.every((choice) => String(choice.label || "").trim().length === 1);
  }

  function renderOptionVisual(visualChoice, choice) {
    if (!visualChoice) return "";
    if (typeof visualChoice === "string") {
      return `<span class="option-visual">${escapeHtml(visualChoice || `Option ${choice.label}`)}</span>`;
    }
    return `
      <span class="option-visual has-image">
        <img src="${escapeHtml(visualChoice.src)}" alt="${escapeHtml(visualChoice.alt || `Option ${choice.label}`)}" loading="lazy">
      </span>
    `;
  }

  function renderMaterial(material) {
    if (!material) return "";
    return `
      <section class="source-material">
        ${material.title ? `<h3>${escapeHtml(material.title)}</h3>` : ""}
        ${material.body ? `<p>${escapeHtml(material.body)}</p>` : ""}
        ${material.lines ? `<div class="gap-lines">${material.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>` : ""}
        ${material.cards ? `<div class="market-grid">${material.cards.map(([letter, title, body]) => `
          <article>
            <strong>${escapeHtml(letter)} · ${escapeHtml(title)}</strong>
            <p>${escapeHtml(body)}</p>
          </article>
        `).join("")}</div>` : ""}
        ${material.choices ? `<div class="sentence-bank">${material.choices.map((choice) => `<p><strong>${escapeHtml(choice.value.toUpperCase())}</strong> ${escapeHtml(choice.label)}</p>`).join("")}</div>` : ""}
      </section>
    `;
  }

  function renderVisual(visual) {
    if (!visual) return "";
    return `
      <div class="rebuilt-visual ${visual.type === "notice" ? "notice-visual" : "note-visual"}">
        <strong>${escapeHtml(visual.title)}</strong>
        <p>${escapeHtml(visual.body)}</p>
        ${visual.footnote ? `<small>${escapeHtml(visual.footnote)}</small>` : ""}
      </div>
    `;
  }

  function bindEvents() {
    document.querySelector("[data-part-nav]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-part-button]");
      if (!button) return;
      state.currentPart = button.dataset.partButton;
      renderAll();
    });
    document.querySelector("[data-test-panel]").addEventListener("input", handleAnswer);
    document.querySelector("[data-test-panel]").addEventListener("change", handleAnswer);
    document.querySelector("[data-submit-test]").addEventListener("click", submitTest);
  }

  function bindAudio() {
    const startButton = document.querySelector("[data-start-audio]");
    const status = document.querySelector("[data-audio-status]");
    const audio = document.querySelector("[data-audio-player]");
    const source = data.audioSrc || audio?.dataset.audioSrc || "";
    if (!source) {
      startButton.disabled = true;
      status.textContent = "Official SPIP listening audio has not been uploaded. Listening questions are not scored.";
      return;
    }
    audio.src = source;
    startButton.disabled = false;
    status.textContent = "Official SPIP listening audio is ready. Press start when you are ready; replay is disabled for this exam session.";
    startButton.addEventListener("click", () => {
      startButton.disabled = true;
      status.textContent = "Listening audio is playing.";
      audio.currentTime = 0;
      audio.play().catch(() => {
        status.textContent = "Audio could not be started. Try again.";
        startButton.disabled = false;
      });
    });
    audio.addEventListener("timeupdate", () => {
      document.querySelector("[data-audio-time]").textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
    });
    audio.addEventListener("ended", () => {
      status.textContent = "Listening complete. Replay is disabled for this exam session.";
    });
    audio.addEventListener("pause", () => {
      if (!audio.ended && !state.submitted) audio.play().catch(() => {});
    });
  }

  function handleAnswer(event) {
    const input = event.target.closest("[data-answer]");
    if (!input) return;
    if (input.type === "radio" && !input.checked) return;
    state.answers[input.dataset.answer] = input.value;
    saveAnswers();
    updateWordCount(input.dataset.answer);
    renderAll();
  }

  function updateWordCount(questionId) {
    const question = allQuestions().find((item) => item.id === questionId);
    if (!question || question.responseType !== "writing") return;
    const count = countWords(state.answers[question.id] || "");
    const wordCount = document.querySelector(`[data-word-count="${CSS.escape(question.id)}"]`);
    if (!wordCount) return;
    const min = question.minWords || 35;
    const max = question.maxWords || 45;
    wordCount.textContent = `${count} words · target ${min}-${max} words`;
    wordCount.classList.toggle("is-ok", count >= min && count <= max);
  }

  function renderAll() {
    document.querySelectorAll("[data-part]").forEach((part) => {
      part.classList.toggle("is-active", part.id === state.currentPart);
    });
    document.querySelectorAll("[data-part-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.partButton === state.currentPart);
    });
    renderProgress();
    renderReview();
    renderResult();
  }

  function renderProgress() {
    const answered = allQuestions().filter((question) => cleanText(state.answers[question.id])).length;
    document.querySelector("[data-progress-count]").textContent = String(answered);
  }

  function renderReview() {
    const summary = document.querySelector("[data-student-summary]");
    if (!summary) return;
    summary.innerHTML = `
      <strong>${escapeHtml(state.profile.fullName)}</strong>
      <span>${escapeHtml(state.profile.nickname)} · ${escapeHtml(state.profile.subject)} · ${escapeHtml(state.profile.level)} · ${escapeHtml(state.profile.testDate)}</span>
    `;
    const reviewGrid = document.querySelector("[data-review-grid]");
    reviewGrid.innerHTML = data.parts.map((part) => `
      <article class="review-card">
        <strong>${escapeHtml(part.label)}</strong>
        <span>${part.questions.filter((question) => cleanText(state.answers[question.id])).length}/${part.questions.length} answered</span>
        ${part.questions.some((question) => question.pending) ? "<small>Listening scoring pending official materials.</small>" : ""}
      </article>
    `).join("");
  }

  async function submitTest() {
    if (state.submitted || state.submissionPending) return;
    collectCurrentAnswers();
    state.submissionPending = true;
    renderResult("Submitting...");
    if (isDemoAssignment() || !window.KeaesApi?.isConfigured()) {
      state.submittedScore = scoreLocal(demoWritingGrades());
      state.submitted = true;
      state.submissionPending = false;
      state.currentPart = "review";
      renderAll();
      return;
    }
    try {
      const aiGrades = await gradeWriting();
      const result = await window.KeaesApi.submitAttempt({
        assignmentToken: state.profile.assignmentToken,
        student: state.profile,
        answers: { ...state.answers, rwAnswers: state.answers, aiGrades },
      });
      state.savedResultId = result?.attemptId || null;
      state.submittedScore = {
        score: Number(result?.scoreTotal ?? result?.total ?? 0),
        possible: Number(result?.scorePossible ?? result?.possible ?? data.totalPoints),
      };
      state.submitted = true;
      state.currentPart = "review";
    } catch (err) {
      renderResult(`Could not submit: ${err.message}`);
    } finally {
      state.submissionPending = false;
      renderAll();
    }
  }

  function collectCurrentAnswers() {
    document.querySelectorAll("[data-answer]").forEach((input) => {
      if (input.type === "radio") {
        if (input.checked) state.answers[input.dataset.answer] = input.value;
        return;
      }
      state.answers[input.dataset.answer] = input.value;
    });
    saveAnswers();
  }

  function renderResult(message = "") {
    const card = document.querySelector("[data-result-card]");
    if (!card) return;
    if (message) {
      card.hidden = false;
      card.innerHTML = `<p>${escapeHtml(message)}</p>`;
      return;
    }
    if (!state.submittedScore) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    card.innerHTML = `
      <p class="eyebrow">Submitted</p>
      <h3>${formatScore(state.submittedScore.score)}/${formatScore(state.submittedScore.possible)}</h3>
      <p>Reading and Writing are included in this score. Listening questions remain pending official answer key review.</p>
      ${state.savedResultId ? `<p>Result ID: ${escapeHtml(state.savedResultId)}</p>` : ""}
    `;
  }

  async function gradeWriting() {
    const writingQuestions = allQuestions().filter((question) => question.responseType === "writing");
    if (!writingQuestions.length) return {};
    if (!window.KeaesApi?.gradeEnglishLiteracyShortAnswers) {
      throw new Error("AI grading is not available. Ask staff to deploy the grading function before accepting SPIP writing submissions.");
    }
    const grades = await window.KeaesApi.gradeEnglishLiteracyShortAnswers({
      testId,
      assignmentToken: state.profile.assignmentToken,
      answers: writingQuestions.map((question) => ({
        questionId: question.id,
        prompt: question.prompt,
        answer: state.answers[question.id] || "",
        rubric: question.rubric || "",
      })),
    });
    const missingGrade = writingQuestions.find((question) => !grades?.[question.id] || typeof grades[question.id].score !== "number");
    if (missingGrade) {
      throw new Error("AI grading did not return a complete SPIP writing score. Please try submitting again.");
    }
    return grades;
  }

  function scoreLocal(aiGrades = {}) {
    return scoredQuestions().reduce((score, question) => {
      if (question.responseType === "writing") {
        const grade = aiGrades[question.id] || demoWritingGrade(question);
        return {
          score: score.score + Number(grade.score || 0),
          possible: score.possible + (question.points || 5),
        };
      }
      const response = normalizeAnswer(state.answers[question.id]);
      const correct = normalizeAnswer(question.answer);
      return {
        score: score.score + (response && response === correct ? (question.points || 1) : 0),
        possible: score.possible + (question.points || 1),
      };
    }, { score: 0, possible: 0 });
  }

  function demoWritingGrades() {
    return Object.fromEntries(
      allQuestions()
        .filter((question) => question.responseType === "writing")
        .map((question) => [question.id, demoWritingGrade(question)])
    );
  }

  function demoWritingGrade(question) {
    const response = state.answers[question.id] || "";
    const normalized = normalizeAnswer(response);
    const wordCount = countWords(response);
    const hasApology = /\b(sorry|apologise|apologize|can't come|cannot come)\b/.test(normalized);
    const hasReason = /\b(because|reason|busy|sick|ill|travel|family|exam|school|doctor|away)\b/.test(normalized);
    const hasPresent = /\b(present|gift|send|sending|book|toy|card|flowers|chocolate)\b/.test(normalized);
    const contentScore = [hasApology, hasReason, hasPresent].filter(Boolean).length;
    const hasGreeting = /\b(dear|hi|hello)\b/.test(normalized);
    const hasSignoff = /\b(from|love|your friend|best wishes|see you)\b/.test(normalized);
    const inRange = wordCount >= (question.minWords || 35) && wordCount <= (question.maxWords || 45);
    const languageScore = !response.trim() ? 0 : Math.min(2, [wordCount >= 20, inRange, hasGreeting || hasSignoff, normalized.length > 80].filter(Boolean).length >= 3 ? 2 : 1);
    const score = contentScore + languageScore;
    return {
      questionId: question.id,
      apology: hasApology,
      reason: hasReason,
      present: hasPresent,
      contentScore,
      languageScore,
      wordCount,
      score,
      feedback: response.trim() ? "Local preview writing score." : "No answer.",
    };
  }

  function reviewPart() {
    return {
      id: "review",
      label: "Review",
      title: "Check your answers.",
      hint: "Submit when you are ready.",
      questions: [],
    };
  }

  function allQuestions() {
    return data.parts.flatMap((part) => part.questions || []);
  }

  function scoredQuestions() {
    return allQuestions().filter((question) => !question.pending && (question.answer || question.responseType === "writing"));
  }

  function isDemoAssignment() {
    return ["127.0.0.1", "localhost"].includes(window.location.hostname) && assignmentToken === "demo";
  }

  function normalizeAnswer(value) {
    return cleanText(value).toLowerCase();
  }

  function countWords(value) {
    return cleanText(value).split(/\s+/).filter(Boolean).length;
  }

  function cleanText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }

  function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
