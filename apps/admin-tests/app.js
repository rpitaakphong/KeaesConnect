(function () {
  "use strict";

  const tests = [
    {
      id: "starter-progress-listening",
      title: "Starter Progress Listening",
      subject: "English",
      level: "Cambridge Starters",
      status: "active",
    },
  ];

  let selectedResultId = null;
  let selectedAssignment = null;
  let results = [];

  document.addEventListener("DOMContentLoaded", async () => {
    await requireAdminSession();
    await window.KeaesWorkspacePortal?.refreshChrome?.();
    renderTests();
    renderLinkGenerator();
    bindActions();
    await refreshResults();
  });

  async function requireAdminSession() {
    if (!window.KeaesApi?.isConfigured()) {
      renderSetupMode();
      return;
    }
    await window.KeaesApi.requireStaffSession("../../login.html");
  }

  function bindActions() {
    document.querySelector("[data-test-select]").addEventListener("change", () => {
      selectedAssignment = null;
      updateGeneratedLink();
    });
    document.querySelector("[data-copy-link]").addEventListener("click", copyLink);
    document.querySelector("[data-open-link]").addEventListener("click", ensureGeneratedAssignment);
    document.querySelector("[data-refresh-results]").addEventListener("click", refreshResults);
  }

  function renderSetupMode() {
    document.querySelector("[data-backend-status]").textContent = "Setup required";
    document.querySelector("[data-results-table]").innerHTML = `
      <tr><td colspan="6">Supabase is not configured. Add your project URL and anon key in assets/js/supabase-config.js.</td></tr>
    `;
  }

  function renderTests() {
    document.querySelector("[data-test-list]").innerHTML = tests.map((test) => `
      <article class="test-card">
        <span class="badge">Active</span>
        <h3>${escapeHtml(test.title)}</h3>
        <p>${escapeHtml(test.subject)} · ${escapeHtml(test.level)}</p>
      </article>
    `).join("");
  }

  function renderLinkGenerator() {
    const select = document.querySelector("[data-test-select]");
    select.innerHTML = tests.map((test) => `
      <option value="${test.id}">${escapeHtml(test.title)}</option>
    `).join("");
    updateGeneratedLink();
  }

  async function ensureGeneratedAssignment(event) {
    event?.preventDefault();
    if (!window.KeaesApi?.isConfigured()) {
      setShareMessage("Supabase setup required before generating assignment links.");
      return null;
    }
    if (!selectedAssignment) {
      const selected = selectedTest();
      selectedAssignment = await window.KeaesApi.createAssignment(selected.id);
      updateGeneratedLink();
    }
    if (event?.currentTarget?.tagName === "A") window.open(event.currentTarget.href, "_blank", "noopener");
    return selectedAssignment;
  }

  function updateGeneratedLink() {
    const selected = selectedTest();
    const shareInput = document.querySelector("[data-share-url]");
    const openLink = document.querySelector("[data-open-link]");
    const message = document.querySelector("[data-message-template]");
    const assignmentToken = selectedAssignment?.assignment_token;
    const studentUrl = new URL("../starter-listening/index.html", window.location.href);
    studentUrl.searchParams.set("testId", selected.id);
    if (assignmentToken) studentUrl.searchParams.set("assignment", assignmentToken);
    const absoluteUrl = assignmentToken ? studentUrl.href : "Click Open test or Copy link to generate an assignment URL.";
    shareInput.value = absoluteUrl;
    openLink.href = assignmentToken ? studentUrl.href : "#";
    message.value = [
      `Please complete: ${selected.title}`,
      "",
      absoluteUrl,
      "",
      "Enter your student details before starting. Once the listening exam starts, the audio will continue until it finishes.",
    ].join("\n");
  }

  async function copyLink() {
    await ensureGeneratedAssignment();
    const input = document.querySelector("[data-share-url]");
    if (!selectedAssignment) return;
    try {
      await navigator.clipboard.writeText(input.value);
      document.querySelector("[data-copy-link]").textContent = "Copied";
      setTimeout(() => (document.querySelector("[data-copy-link]").textContent = "Copy link"), 1200);
    } catch {
      input.select();
      document.execCommand("copy");
    }
  }

  async function refreshResults() {
    if (!window.KeaesApi?.isConfigured()) {
      renderSetupMode();
      renderMetrics();
      return;
    }
    try {
      results = (await window.KeaesApi.listResults()).map(normalizeResult);
      if (!selectedResultId && results[0]) selectedResultId = results[0].id;
      renderResults();
      renderMetrics();
    } catch (err) {
      document.querySelector("[data-results-table]").innerHTML = `
        <tr><td colspan="6">Could not load Supabase results: ${escapeHtml(err.message)}</td></tr>
      `;
      renderMetrics();
    }
  }

  function renderMetrics() {
    const completed = results.length;
    const avg = completed ? Math.round(results.reduce((sum, result) => sum + result.score.percent, 0) / completed) : 0;
    const activeTests = tests.filter((test) => test.status === "active").length;
    const recent = results[0] ? formatDate(results[0].submittedAt) : "No submissions";
    document.querySelector("[data-metrics]").innerHTML = [
      ["Active tests", activeTests],
      ["Completed attempts", completed],
      ["Average score", `${avg}%`],
      ["Recent activity", recent],
    ].map(([label, value]) => `
      <article class="metric-card">
        <span>${label}</span>
        <strong>${value}</strong>
      </article>
    `).join("");
  }

  function renderResults() {
    const tbody = document.querySelector("[data-results-table]");
    tbody.innerHTML = results.length ? results.map((result) => `
      <tr data-result-id="${result.id}" class="${result.id === selectedResultId ? "is-selected" : ""}">
        <td><strong>${escapeHtml(result.student.fullName)}</strong><br><span>${escapeHtml(result.student.nickname)}</span></td>
        <td>${escapeHtml(result.testTitle)}</td>
        <td>${escapeHtml(result.student.subject)}</td>
        <td>${escapeHtml(result.student.level)}</td>
        <td><span class="score-pill">${result.score.total}/${result.score.possible} (${result.score.percent}%)</span></td>
        <td>${formatDate(result.submittedAt)}</td>
      </tr>
    `).join("") : `
      <tr><td colspan="6">No submitted results yet. Generate an assignment link and complete the test from a student browser.</td></tr>
    `;
    tbody.querySelectorAll("[data-result-id]").forEach((row) => {
      row.addEventListener("click", () => {
        selectedResultId = row.dataset.resultId;
        renderResults();
      });
    });
    renderResultDetail(results.find((result) => result.id === selectedResultId));
  }

  function renderResultDetail(result) {
    const panel = document.querySelector("[data-result-detail]");
    if (!result) {
      panel.innerHTML = "<h3>No result selected</h3><p>Select a student result to see score details and corrections.</p>";
      return;
    }
    panel.innerHTML = `
      <h3>${escapeHtml(result.student.fullName)}</h3>
      <p>${escapeHtml(result.student.nickname)} · DOB ${escapeHtml(result.student.dateOfBirth)}</p>
      <p>${escapeHtml(result.testTitle)} · ${formatDate(result.submittedAt)}</p>
      <h2>${result.score.total}/${result.score.possible} (${result.score.percent}%)</h2>
      <div class="part-list">
        ${result.partScores.map((part) => `
          <div class="part-row">
            <strong>${escapeHtml(part.part)}: ${part.total}/${part.possible}</strong>
          </div>
        `).join("")}
      </div>
      <div class="correction-list">
        ${result.answers.slice(0, 20).map((answer) => `
          <div class="correction-row ${answer.correct ? "" : "is-wrong"}">
            <strong>${escapeHtml(answer.part)}: ${escapeHtml(answer.prompt)}</strong>
            <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function normalizeResult(row) {
    return {
      id: row.attempt_id,
      testId: row.test_id,
      testTitle: row.test_title,
      student: {
        fullName: row.full_name,
        nickname: row.nickname,
        dateOfBirth: row.date_of_birth,
        subject: row.subject,
        level: row.level,
        testDate: row.test_date,
      },
      score: {
        total: row.score_total,
        possible: row.score_possible,
        percent: row.score_percent,
      },
      partScores: row.part_scores || [],
      answers: row.answers || [],
      submittedAt: row.submitted_at,
    };
  }

  function selectedTest() {
    return tests.find((test) => test.id === document.querySelector("[data-test-select]").value) || tests[0];
  }

  function setShareMessage(message) {
    document.querySelector("[data-share-url]").value = message;
    document.querySelector("[data-message-template]").value = message;
  }

  function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
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
