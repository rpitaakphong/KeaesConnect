(function () {
  "use strict";

  const data = window.MathOlympiadData;
  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || data?.testId || "math-olympiad";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const answerStorageKey = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";

  const state = {
    currentPart: data?.parts?.[0]?.id || "part1",
    profile: null,
    answers: {},
    submitted: false,
    submissionPending: false,
    submitError: "",
    submittedScore: null,
    savedResultId: null,
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!data) {
      document.querySelector("[data-test-panel]").innerHTML = "<p>Math Olympiad data could not be loaded.</p>";
      return;
    }
    if (!loadProfile()) return;
    loadAnswers();
    buildShell();
    bindEvents();
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
      // Ignore corrupt session answer state.
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
    document.querySelector("[data-part-nav]").innerHTML = [...data.parts, reviewPart()].map((part) => `
      <button class="part-tab" type="button" data-part-button="${part.id}">${escapeHtml(part.label)}</button>
    `).join("");
    document.querySelector("[data-test-panel]").innerHTML = [...data.parts, reviewPart()].map(renderPart).join("");
  }

  function renderPart(partItem) {
    if (partItem.id === "review") {
      return `
        <section class="part" id="${partItem.id}" data-part>
          <div class="part-heading">
            <div>
              <p class="eyebrow">${escapeHtml(partItem.label)}</p>
              <h2>${escapeHtml(partItem.title)}</h2>
            </div>
            <p class="hint">${escapeHtml(partItem.hint)}</p>
          </div>
          <div class="student-summary" data-student-summary></div>
          <div class="review-grid" data-review-grid></div>
          <div class="result-card" hidden data-result-card></div>
        </section>
      `;
    }
    return `
      <section class="part" id="${partItem.id}" data-part>
        <div class="part-heading">
          <div>
            <p class="eyebrow">${escapeHtml(partItem.label)} - ${partItem.questions.length} questions</p>
            <h2>${escapeHtml(partItem.title)}</h2>
          </div>
          <p class="hint">${escapeHtml(partItem.hint || "")}</p>
        </div>
        <div class="math-question-list">
          ${partItem.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `;
  }

  function renderQuestion(question) {
    return `
      <article class="question-card math-question" data-question-card="${question.id}">
        <div class="math-question-head">
          <div>
            <p class="eyebrow">Question ${question.number}</p>
            <h3>${escapeHtml(question.prompt)}</h3>
          </div>
          <span class="mark-pill">${formatScore(question.points)} ${Number(question.points) === 1 ? "mark" : "marks"}</span>
        </div>
        ${question.note ? `<p class="hint">${escapeHtml(question.note)}</p>` : ""}
        ${question.visualHtml ? `<div class="math-visual generated-visual">${question.visualHtml}</div>` : ""}
        ${renderQuestionInput(question)}
      </article>
    `;
  }

  function renderQuestionInput(question) {
    if (question.responseType === "choice") {
      const answer = normalizeQuestionAnswer(state.answers[question.id]).answer || "";
      return `
        <div class="choice-grid math-choice-grid">
          ${(question.choices || []).map((choice) => `
            <label class="math-choice-card">
              <input type="radio" name="${escapeHtml(question.id)}" data-answer="${escapeHtml(question.id)}" data-answer-part="answer" value="${escapeHtml(choice.value)}" ${answer === choice.value ? "checked" : ""}>
              <span>${choice.visualHtml || ""}<strong>${escapeHtml(choice.label)}</strong></span>
            </label>
          `).join("")}
        </div>
      `;
    }
    if (question.inlineRows?.length) {
      const fieldMap = new Map((question.fields || []).map((field) => [field.id, field]));
      return `
        <div class="math-inline-rows">
          ${question.inlineRows.map((row) => `
            <div class="math-inline-row">
              ${(row.items || []).map((item) => {
                if (item.type === "input") {
                  const field = fieldMap.get(item.id) || { id: item.id, label: item.id };
                  return lineInput(question.id, field.id, field.label, field.placeholder || "");
                }
                return `<span>${escapeHtml(item.text || "")}</span>`;
              }).join("")}
            </div>
          `).join("")}
        </div>
      `;
    }
    if (question.rankRows?.length) {
      const fieldMap = new Map((question.fields || []).map((field) => [field.id, field]));
      return `
        <div class="math-rank-rows">
          <p class="math-rank-instruction">Write 1 for the smallest fraction and 4 for the greatest fraction.</p>
          ${question.rankRows.map((row) => `
            <div class="math-rank-row">
              <strong>${escapeHtml(row.label || "")}</strong>
              <div class="math-rank-grid">
                ${(row.items || []).map((item) => {
                  const field = fieldMap.get(item.id) || { id: item.id, label: item.text || item.id };
                  return `
                    <label class="math-rank-item">
                      <span>${escapeHtml(item.text || "")}</span>
                      ${lineInput(question.id, field.id, field.label, field.placeholder || "")}
                    </label>
                  `;
                }).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
    if (question.answerTable) {
      const fieldMap = new Map((question.fields || []).map((field) => [field.id, field]));
      const followupFields = (question.followupFieldIds || [])
        .map((id) => fieldMap.get(id))
        .filter(Boolean);
      return `
        <div class="math-answer-table-wrap">
          <table class="math-answer-table">
            <thead>
              <tr>${(question.answerTable.headers || []).map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${(question.answerTable.rows || []).map((row) => `
                <tr>
                  ${(row.cells || []).map((cell) => {
                    if (cell.type === "input") {
                      const field = fieldMap.get(cell.id) || { id: cell.id, label: cell.id };
                      return `<td class="math-answer-cell-input">${lineInput(question.id, field.id, field.label, field.placeholder || "")}${cell.suffix ? `<span>${escapeHtml(cell.suffix)}</span>` : ""}</td>`;
                    }
                    return `<td>${escapeHtml(cell.text || "")}</td>`;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ${followupFields.length ? `
          <div class="math-lines ${question.compact ? "compact-lines" : ""}">
            ${followupFields.map((field) => `
              <label class="${field.visualHtml ? "has-field-visual" : ""}">
                ${field.visualHtml ? `<span class="math-field-visual">${field.visualHtml}</span>` : ""}
                <span>${escapeHtml(field.label)}</span>
                ${lineInput(question.id, field.id, field.label, field.placeholder || "")}
              </label>
            `).join("")}
          </div>
        ` : ""}
      `;
    }
    return `
      <div class="math-lines ${question.compact ? "compact-lines" : ""}">
        ${(question.fields || []).map((field) => `
          <label class="${field.visualHtml ? "has-field-visual" : ""}">
            ${field.visualHtml ? `<span class="math-field-visual">${field.visualHtml}</span>` : ""}
            <span>${escapeHtml(field.label)}</span>
            ${lineInput(question.id, field.id, field.label, field.placeholder || "")}
          </label>
        `).join("")}
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
    document.querySelector("[data-test-panel]").addEventListener("input", handleAnswerInput);
    document.querySelector("[data-test-panel]").addEventListener("change", handleAnswerInput);
    document.querySelectorAll("[data-submit]").forEach((button) => button.addEventListener("click", openSubmitDialog));
    const dialog = document.querySelector("[data-submit-dialog]");
    dialog?.addEventListener("close", () => {
      if (dialog.returnValue === "confirm") submitTest();
    });
  }

  function handleAnswerInput(event) {
    const input = event.target.closest("[data-answer]");
    if (!input || state.submitted) return;
    const questionId = input.dataset.answer;
    const partId = input.dataset.answerPart;
    state.answers[questionId] = normalizeQuestionAnswer(state.answers[questionId]);
    state.answers[questionId][partId] = cleanText(input.value);
    if (!hasAnswerValue(state.answers[questionId])) delete state.answers[questionId];
    saveAnswers();
    renderProgress();
    renderReview();
  }

  function openSubmitDialog() {
    if (state.submitted || state.submissionPending) return;
    const dialog = document.querySelector("[data-submit-dialog]");
    if (dialog?.showModal) {
      dialog.showModal();
    } else if (window.confirm("Submit test now? Blank answers will be marked incorrect.")) {
      submitTest();
    }
  }

  function submitTest() {
    if (state.submitted || state.submissionPending) return;
    state.submissionPending = true;
    state.submitError = "";
    renderAll();
    saveResult()
      .then((score) => {
        state.submittedScore = score;
        state.submitted = true;
        state.currentPart = "review";
      })
      .catch((err) => {
        state.submitError = err.message;
        state.currentPart = "review";
      })
      .finally(() => {
        state.submissionPending = false;
        renderAll();
      });
  }

  async function saveResult() {
    if (!state.profile || state.savedResultId) return state.submittedScore;
    if (isDemoAssignment()) {
      const result = scoreDemoSubmission();
      state.savedResultId = "demo";
      return result;
    }
    if (!window.KeaesApi?.isConfigured()) {
      throw new Error("Supabase is not configured. Ask staff to configure the database before accepting test submissions.");
    }
    const result = await window.KeaesApi.submitAttempt({
      assignmentToken: state.profile.assignmentToken,
      student: state.profile,
      answers: state.answers,
    });
    state.savedResultId = result.attemptId;
    return {
      total: result.total,
      possible: result.possible,
      sections: result.sections || {},
    };
  }

  function scoreDemoSubmission() {
    const sections = {};
    data.parts.forEach((partItem) => {
      sections[partItem.id] = partItem.questions.map((question) => {
        const answer = normalizeQuestionAnswer(state.answers[question.id]);
        const scored = scoreQuestion(question, answer);
        return {
          part: partItem.label,
          prompt: question.prompt,
          response: displayResponse(question, answer),
          correctAnswer: answerKey(question).display,
          correct: scored.correct,
          score: scored.awarded,
          possible: scored.possible,
          gradingDetails: scored.details,
        };
      });
    });
    const all = Object.values(sections).flat();
    return {
      total: roundScore(all.reduce((sum, item) => sum + item.score, 0)),
      possible: roundScore(all.reduce((sum, item) => sum + item.possible, 0)),
      sections,
    };
  }

  function scoreQuestion(question, answer) {
    const partScores = answerKey(question).parts.map((partKey) => {
      const raw = answer[partKey.id] ?? "";
      const correct = (partKey.accepted || []).some((accepted) => normalizeByType(raw, partKey.normalizer) === normalizeByType(accepted, partKey.normalizer));
      return {
        id: partKey.id,
        score: correct ? Number(partKey.points || 0) : 0,
        possible: Number(partKey.points || 0),
        correct,
      };
    });
    const awarded = roundScore(partScores.reduce((sum, item) => sum + item.score, 0));
    const possible = roundScore(partScores.reduce((sum, item) => sum + item.possible, 0));
    return {
      awarded,
      possible,
      correct: awarded >= possible,
      details: { parts: partScores },
    };
  }

  function renderAll() {
    renderStudent();
    renderNavigation();
    renderInputs();
    renderProgress();
    renderReview();
    renderSubmitState();
  }

  function renderStudent() {
    const line = document.querySelector("[data-student-line]");
    if (line && state.profile) {
      line.textContent = `${state.profile.fullName} (${state.profile.nickname}) · ${state.profile.level} · Test date ${state.profile.testDate}`;
    }
    const summary = document.querySelector("[data-student-summary]");
    if (summary && state.profile) {
      summary.innerHTML = `
        <h3>${escapeHtml(state.profile.fullName)} (${escapeHtml(state.profile.nickname)})</h3>
        <p>${escapeHtml(state.profile.subject)} · ${escapeHtml(state.profile.level)} · Test date ${escapeHtml(state.profile.testDate)}</p>
      `;
    }
  }

  function renderNavigation() {
    document.querySelectorAll("[data-part]").forEach((partElement) => {
      partElement.classList.toggle("is-active", partElement.id === state.currentPart);
    });
    document.querySelectorAll("[data-part-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.partButton === state.currentPart);
    });
  }

  function renderInputs() {
    document.querySelectorAll("[data-answer]").forEach((input) => {
      const answer = normalizeQuestionAnswer(state.answers[input.dataset.answer]);
      if (input.type === "radio") {
        input.checked = answer[input.dataset.answerPart] === input.value;
      } else {
        input.value = answer[input.dataset.answerPart] || "";
      }
      input.disabled = state.submitted || state.submissionPending;
    });
  }

  function renderProgress() {
    const answered = allQuestions().filter((question) => hasAnswerValue(state.answers[question.id])).length;
    document.querySelector("[data-progress-count]").textContent = answered;
  }

  function renderReview() {
    const grid = document.querySelector("[data-review-grid]");
    if (!grid) return;
    grid.innerHTML = data.parts.map((partItem) => {
      const count = partItem.questions.filter((question) => hasAnswerValue(state.answers[question.id])).length;
      return `
        <article class="review-card">
          <strong>${escapeHtml(partItem.label)}</strong>
          <span>${count}/${partItem.questions.length} answered</span>
        </article>
      `;
    }).join("");

    const result = document.querySelector("[data-result-card]");
    result.hidden = !state.submitted && !state.submitError;
    if (state.submitted) {
      result.innerHTML = renderScoreSummary(state.submittedScore);
    } else if (state.submitError) {
      result.innerHTML = `<div class="pending-note">Submission failed: ${escapeHtml(state.submitError)}</div>`;
    }
  }

  function renderSubmitState() {
    document.querySelectorAll("[data-submit]").forEach((button) => {
      button.disabled = state.submitted || state.submissionPending;
      button.textContent = state.submitted ? "Submitted" : state.submissionPending ? "Submitting..." : "Submit test";
    });
  }

  function renderScoreSummary(score) {
    if (!score) return "";
    const sections = Object.values(score.sections || {});
    const corrections = sections.flat().map((answer) => `
      <div class="correction-row ${answer.correct ? "" : "is-wrong"}">
        <strong>${escapeHtml(answer.part)}: ${escapeHtml(answer.prompt)}</strong>
        <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)} · Score: ${formatScore(answer.score ?? 0)}/${formatScore(answer.possible ?? 1)}</span>
      </div>
    `).join("");
    return `
      <div class="score-banner">
        <span>Total score</span>
        <strong>${formatScore(score.total)}/${formatScore(score.possible)}</strong>
      </div>
      <div class="correction-list">${corrections}</div>
    `;
  }

  function lineInput(questionId, partId, label, explicitPlaceholder = "") {
    const placeholder = explicitPlaceholder || answerPlaceholder(questionId, partId);
    const placeholderAttribute = placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : "";
    return `<input class="math-line-input" data-answer="${questionId}" data-answer-part="${partId}" autocomplete="off" inputmode="text" aria-label="${escapeHtml(label)}"${placeholderAttribute}>`;
  }

  function answerPlaceholder(questionId, partId) {
    const question = allQuestions().find((item) => item.id === questionId);
    const part = answerKey(question).parts.find((item) => item.id === partId);
    const accepted = part?.accepted || [];
    if (!part || !accepted.length) return "";
    if (part.normalizer === "time") return "answer in time";
    if (accepted.every((value) => /^[+\-*/÷x×=]$/.test(String(value).trim()))) return "answer in symbol";
    if (accepted.every((value) => /^-?\$?\d+(?:[.:]\d+)?(?:[%°]|cm²|cm2|cm|kg|g|ml|m|min)?$/i.test(String(value).trim()))) return "answer in number";
    if (accepted.every((value) => /^[A-Z]$/i.test(String(value).trim()))) return "answer in letter";
    return "answer in words";
  }

  function answerKey(question) {
    return {
      source: "mathMultiPart",
      display: question.display || question.answerParts.map((part) => part.accepted?.[0] || "").join(", "),
      parts: question.answerParts,
    };
  }

  function allQuestions() {
    return data.parts.flatMap((part) => part.questions);
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

  function displayResponse(question, answer) {
    const entries = answerKey(question).parts.map((part) => `${part.id}: ${answer[part.id] || "No answer"}`);
    return entries.join("; ");
  }

  function normalizeQuestionAnswer(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function hasAnswerValue(value) {
    const answer = normalizeQuestionAnswer(value);
    return Object.values(answer).some((item) => cleanText(item).length > 0);
  }

  function normalizeByType(value, type = "text") {
    const cleaned = cleanText(value).toLowerCase();
    if (type === "time") {
      return cleaned.replace(/\s+/g, "").replace(/:/g, ".").replace(/\.?a\.?m\.?/g, "am").replace(/\.?p\.?m\.?/g, "pm");
    }
    return cleaned
      .replace(/,/g, "")
      .replace(/\$/g, "")
      .replace(/\s+/g, "")
      .replace(/[.](?=[ap]m$)/g, "")
      .replace(/cm²/g, "cm2")
      .replace(/degrees?/g, "°")
      .replace(/litres?/g, "l")
      .replace(/minutes?/g, "min")
      .replace(/hours?/g, "h")
      .replace(/[()]/g, "");
  }

  function isDemoAssignment() {
    return ["127.0.0.1", "localhost"].includes(window.location.hostname) && assignmentToken === "demo";
  }

  function cleanText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function roundScore(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
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
