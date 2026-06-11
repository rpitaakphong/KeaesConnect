(function () {
  "use strict";

  const builtinTests = [
    {
      id: "starter-progress-test",
      title: "Starter Progress Test",
      subject: "English",
      level: "Cambridge Starters",
      status: "active",
      appPath: "../starter-listening/index.html",
      databaseReady: true,
    },
    {
      id: "english-literacy-1",
      title: "English Literacy Level 1",
      subject: "English",
      level: "English Literacy 1",
      status: "active",
      appPath: "../english-literacy/level-1/index.html",
      databaseReady: false,
    },
  ];
  let tests = builtinTests;

  let selectedResultId = null;
  let selectedAssignment = null;
  let results = [];

  document.addEventListener("DOMContentLoaded", async () => {
    await requireAdminSession();
    await window.KeaesWorkspacePortal?.refreshChrome?.();
    await loadTests();
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

  async function loadTests() {
    if (!window.KeaesApi?.isConfigured()) return;
    try {
      const rows = await window.KeaesApi.listTests();
      tests = mergeTests(rows.map((test) => ({
        id: test.id,
        title: test.title,
        subject: test.subject,
        level: test.level,
        status: test.status,
        appPath: normalizeAppPath(test),
        databaseReady: true,
      })));
      document.querySelector("[data-backend-status]").textContent = "Database mode";
    } catch (err) {
      document.querySelector("[data-backend-status]").textContent = "Catalog fallback";
      setShareMessage(`Could not load test catalog: ${err.message}`);
    }
  }

  function renderTests() {
    document.querySelector("[data-test-list]").innerHTML = tests.map((test) => `
      <article class="test-card ${test.databaseReady ? "" : "is-pending"}">
        <h3>${escapeHtml(test.title)}</h3>
        <p>${escapeHtml(test.subject)} · ${escapeHtml(test.level)}</p>
        ${test.databaseReady ? "" : "<p class=\"catalog-note\">Database setup needed before assignment links work.</p>"}
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
      if (!selected.databaseReady) {
        setShareMessage(`Run supabase/schema.sql before generating ${selected.title} assignment links.`);
        return null;
      }
      try {
        selectedAssignment = await window.KeaesApi.createAssignment(selected.id);
        updateGeneratedLink();
      } catch (err) {
        setShareMessage(`Could not create assignment for ${selected.title}: ${err.message}. Run supabase/schema.sql if this test is new.`);
        return null;
      }
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
    const studentUrl = new URL(selected.appPath || "../starter-listening/index.html", window.location.href);
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
      "Enter your student details before starting. Complete the test in one sitting and submit when finished.",
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
      return;
    }
    try {
      results = (await window.KeaesApi.listResults()).map(normalizeResult);
      if (!selectedResultId && results[0]) selectedResultId = results[0].id;
      renderResults();
    } catch (err) {
      document.querySelector("[data-results-table]").innerHTML = `
        <tr><td colspan="6">Could not load Supabase results: ${escapeHtml(err.message)}</td></tr>
      `;
    }
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
        ${result.answers.map((answer) => `
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

  function mergeTests(databaseTests) {
    const byId = new Map(builtinTests.map((test) => [test.id, test]));
    databaseTests.forEach((test) => byId.set(test.id, { ...byId.get(test.id), ...test }));
    return Array.from(byId.values()).filter((test) => test.status === "active");
  }

  function normalizeAppPath(test) {
    const path = test.app_path || defaultAppPath(test.id);
    if (!path) return "../starter-listening/index.html";
    if (path.startsWith("/apps/")) return `..${path.replace("/apps", "")}`;
    return path;
  }

  function defaultAppPath(testId) {
    if (testId === "english-literacy-1") return "/apps/english-literacy/level-1/index.html";
    return "/apps/starter-listening/index.html";
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
