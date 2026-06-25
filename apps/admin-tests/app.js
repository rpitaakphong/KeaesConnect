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
    {
      id: "english-literacy-2",
      title: "English Literacy Level 2",
      subject: "English",
      level: "English Literacy 2",
      status: "active",
      appPath: "../english-literacy/level-2/index.html",
      databaseReady: false,
    },
    {
      id: "english-literacy-3",
      title: "English Literacy Level 3",
      subject: "English",
      level: "English Literacy 3",
      status: "active",
      appPath: "../english-literacy/level-3/index.html",
      databaseReady: false,
    },
    {
      id: "english-literacy-4",
      title: "English Literacy Level 4",
      subject: "English",
      level: "English Literacy 4",
      status: "active",
      appPath: "../english-literacy/level-4/index.html",
      databaseReady: false,
    },
    {
      id: "english-literacy-5",
      title: "English Literacy Level 5",
      subject: "English",
      level: "English Literacy 5",
      status: "active",
      appPath: "../english-literacy/level-5/index.html",
      databaseReady: false,
    },
    {
      id: "math-olympiad-1",
      title: "Math Olympiad Level 1",
      subject: "Math",
      level: "Math Olympiad 1",
      status: "active",
      appPath: "../math-olympiad/level-1/index.html",
      databaseReady: false,
    },
    {
      id: "math-olympiad-2",
      title: "Math Olympiad Level 2",
      subject: "Math",
      level: "Math Olympiad 2",
      status: "active",
      appPath: "../math-olympiad/level-2/index.html",
      databaseReady: false,
    },
    {
      id: "math-olympiad-3",
      title: "Math Olympiad Level 3",
      subject: "Math",
      level: "Math Olympiad 3",
      status: "active",
      appPath: "../math-olympiad/level-3/index.html",
      databaseReady: false,
    },
    {
      id: "math-olympiad-4",
      title: "Math Olympiad Level 4",
      subject: "Math",
      level: "Math Olympiad 4",
      status: "active",
      appPath: "../math-olympiad/level-4/index.html",
      databaseReady: false,
    },
    {
      id: "math-olympiad-5",
      title: "Math Olympiad Level 5",
      subject: "Math",
      level: "Math Olympiad 5",
      status: "active",
      appPath: "../math-olympiad/level-5/index.html",
      databaseReady: false,
    },
    {
      id: "math-olympiad-6",
      title: "Math Olympiad Level 6",
      subject: "Math",
      level: "Math Olympiad 6",
      status: "active",
      appPath: "../math-olympiad/level-6/index.html",
      databaseReady: false,
    },
    {
      id: "spip-year-7-english-pre",
      title: "SPIP Year 7 English Pre-test",
      subject: "English",
      level: "SPIP Year 7",
      status: "active",
      appPath: "../spip/year-7-english-pre/index.html",
      databaseReady: true,
    },
    {
      id: "spip-year-7-math-pre",
      title: "SPIP Year 7 Math Pre-test",
      subject: "Math",
      level: "SPIP Year 7",
      status: "active",
      appPath: "../spip/year-7-math-pre/index.html",
      databaseReady: true,
    },
    {
      id: "spip-year-7-science-pre",
      title: "SPIP Year 7 Science Pre-test",
      subject: "Science",
      level: "SPIP Year 7",
      status: "active",
      appPath: "../spip/year-7-science-pre/index.html",
      databaseReady: true,
    },
  ];
  let tests = builtinTests;

  let selectedTestId = builtinTests[0]?.id || null;
  let selectedResultId = null;
  let selectedAssignment = null;
  let results = [];
  let currentEmployee = null;
  const resultFilters = {
    search: "",
    course: "",
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const authorized = await requireAdminSession();
    if (!authorized) return;
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
      return true;
    }
    await window.KeaesApi.requireStaffSession("../../login.html");
    currentEmployee = await window.KeaesWorkspacePortal?.getEmployee?.();
    const canOpenAdmin = hasPermission("test_catalog") || hasPermission("generate_links") || hasPermission("view_results") || hasPermission("view_reports");
    if (!canOpenAdmin) {
      await window.KeaesWorkspacePortal?.requirePermission?.("test_catalog");
      return false;
    }
    return true;
  }

  function bindActions() {
    document.querySelector("[data-test-list]").addEventListener("click", selectCatalogTest);
    document.querySelector("[data-copy-link]")?.addEventListener("click", copyLink);
    document.querySelector("[data-open-link]")?.addEventListener("click", ensureGeneratedAssignment);
    document.querySelector("[data-refresh-results]")?.addEventListener("click", refreshResults);
    document.querySelector("[data-results-table]")?.addEventListener("click", inspectResultFromTable);
    document.querySelector("[data-result-search]")?.addEventListener("input", updateResultFilters);
    document.querySelector("[data-course-filter]")?.addEventListener("change", updateResultFilters);
    const modal = document.querySelector("[data-result-modal]");
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) closeResultDetail();
    });
  }

  function renderSetupMode() {
    document.querySelector("[data-backend-status]").textContent = "Setup required";
    document.querySelector("[data-results-table]").innerHTML = `
      <tr><td colspan="7">Supabase is not configured. Add your project URL and anon key in assets/js/supabase-config.js.</td></tr>
    `;
  }

  async function loadTests() {
    if (!window.KeaesApi?.isConfigured() || !canCatalog()) return;
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
    if (!canCatalog() && !hasPermission("generate_links")) return;
    if (!tests.some((test) => test.id === selectedTestId)) selectedTestId = tests[0]?.id || null;
    document.querySelector("[data-test-list]").innerHTML = tests.map((test) => `
      <button class="test-card ${test.databaseReady ? "" : "is-pending"} ${test.status !== "active" ? "is-disabled" : ""} ${test.id === selectedTestId ? "is-selected" : ""}" type="button" data-test-id="${escapeHtml(test.id)}" aria-pressed="${test.id === selectedTestId ? "true" : "false"}">
        <h3>${escapeHtml(test.title)}</h3>
        <p>${escapeHtml(test.subject)} · ${escapeHtml(test.level)}</p>
        ${test.status !== "active" ? `<p class="catalog-note">Inactive pilot · assignment links disabled</p>` : ""}
        ${test.databaseReady ? "" : "<p class=\"catalog-note\">Database setup needed before assignment links work.</p>"}
      </button>
    `).join("");
  }

  function renderLinkGenerator() {
    if (!hasPermission("generate_links")) return;
    if (!tests.some((test) => test.id === selectedTestId)) selectedTestId = tests[0]?.id || null;
    updateGeneratedLink();
  }

  function selectCatalogTest(event) {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const card = target?.closest("[data-test-id]");
    if (!card) return;
    selectedTestId = card.dataset.testId;
    selectedAssignment = null;
    renderTests();
    updateGeneratedLink();
  }

  async function ensureGeneratedAssignment(event) {
    event?.preventDefault();
    if (!window.KeaesApi?.isConfigured()) {
      setShareMessage("Supabase setup required before generating assignment links.");
      return null;
    }
    if (!hasPermission("generate_links")) {
      setShareMessage("Your account does not have permission to generate assignment links.");
      return null;
    }
    if (!selectedAssignment) {
      const selected = selectedTest();
      if (!selected.databaseReady) {
        setShareMessage(`Run supabase/schema.sql before generating ${selected.title} assignment links.`);
        return null;
      }
      if (selected.status !== "active") {
        setShareMessage(`${selected.title} is inactive while official materials and answer keys are verified.`);
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
    const summary = document.querySelector("[data-selected-test-summary]");
    if (!selected) return;
    summary.innerHTML = `
      <span>Selected test</span>
      <strong>${escapeHtml(selected.title)}</strong>
      <small>${escapeHtml(selected.subject)} · ${escapeHtml(selected.level)}</small>
    `;
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
    if (!hasPermission("view_results")) return;
    if (!window.KeaesApi?.isConfigured()) {
      renderSetupMode();
      return;
    }
    try {
      results = (await window.KeaesApi.listResults()).map(normalizeResult);
      if (!selectedResultId && results[0]) selectedResultId = results[0].id;
      renderCourseFilter();
      renderResults();
    } catch (err) {
      document.querySelector("[data-results-table]").innerHTML = `
        <tr><td colspan="7">Could not load Supabase results: ${escapeHtml(err.message)}</td></tr>
      `;
    }
  }

  function renderResults() {
    const tbody = document.querySelector("[data-results-table]");
    const filtered = filteredResults();
    tbody.innerHTML = filtered.length ? filtered.map((result) => `
      <tr data-result-id="${result.id}" class="${result.id === selectedResultId ? "is-selected" : ""}">
        <td><strong>${escapeHtml(result.student.fullName)}</strong><br><span>${escapeHtml(result.student.nickname)}</span></td>
        <td>${escapeHtml(result.testTitle)}</td>
        <td>${escapeHtml(result.student.subject)}</td>
        <td>${escapeHtml(result.student.level)}</td>
        <td><span class="score-pill">${formatScore(result.score.total)}/${formatScore(result.score.possible)} (${result.score.percent}%)</span></td>
        <td>${formatDate(result.submittedAt)}</td>
        <td>
          <div class="result-actions">
            <button class="inspect-button" type="button" data-inspect-result="${escapeHtml(result.id)}">Inspect</button>
            ${hasPermission("view_reports") ? `<button class="inspect-button" type="button" data-report-result="${escapeHtml(result.id)}" onclick="window.location.href='report.html?attemptId=${encodeURIComponent(result.id)}'">Report</button>` : ""}
          </div>
        </td>
      </tr>
    `).join("") : `
      <tr><td colspan="7">${results.length ? "No results match the current filters." : "No submitted results yet. Generate an assignment link and complete the test from a student browser."}</td></tr>
    `;
  }

  function updateResultFilters(event) {
    if (event.currentTarget.matches("[data-result-search]")) {
      resultFilters.search = event.currentTarget.value;
    }
    if (event.currentTarget.matches("[data-course-filter]")) {
      resultFilters.course = event.currentTarget.value;
    }
    renderResults();
  }

  function renderCourseFilter() {
    const select = document.querySelector("[data-course-filter]");
    const current = resultFilters.course;
    const courses = Array.from(new Map(results.map((result) => [
      result.testId,
      { id: result.testId, title: result.testTitle },
    ])).values()).sort((a, b) => a.title.localeCompare(b.title));
    select.innerHTML = `
      <option value="">All courses</option>
      ${courses.map((course) => `<option value="${escapeHtml(course.id)}">${escapeHtml(course.title)}</option>`).join("")}
    `;
    if (courses.some((course) => course.id === current)) {
      select.value = current;
    } else {
      resultFilters.course = "";
      select.value = "";
    }
  }

  function filteredResults() {
    const search = normalizeSearch(resultFilters.search);
    return results.filter((result) => {
      const matchesCourse = !resultFilters.course || result.testId === resultFilters.course;
      const searchableName = normalizeSearch(`${result.student.fullName} ${result.student.nickname}`);
      const matchesSearch = !search || searchableName.includes(search);
      return matchesCourse && matchesSearch;
    });
  }

  function inspectResultFromTable(event) {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const reportButton = target?.closest("[data-report-result]");
    if (reportButton) {
      if (!hasPermission("view_reports")) return;
      const reportUrl = new URL("report.html", window.location.href);
      reportUrl.searchParams.set("attemptId", reportButton.dataset.reportResult);
      window.location.href = reportUrl.href;
      return;
    }
    const button = target?.closest("[data-inspect-result]");
    if (!button) return;
    selectedResultId = button.dataset.inspectResult;
    renderResults();
    openResultDetail(results.find((result) => result.id === selectedResultId));
  }

  function canCatalog() {
    return hasPermission("test_catalog") || hasPermission("generate_links");
  }

  function hasPermission(featureKey) {
    return window.KeaesWorkspacePortal?.hasPermission?.(currentEmployee, featureKey) || false;
  }

  function openResultDetail(result) {
    const modal = document.querySelector("[data-result-modal]");
    const panel = document.querySelector("[data-result-detail]");
    if (!modal || !panel || !result) {
      return;
    }
    panel.innerHTML = `
      <div class="result-modal-head">
        <div>
          <p class="eyebrow">Result detail</p>
          <h2>${escapeHtml(result.student.fullName)}</h2>
          <p>${escapeHtml(result.student.nickname)} · DOB ${escapeHtml(result.student.dateOfBirth)}</p>
          <p>${escapeHtml(result.testTitle)} · ${formatDate(result.submittedAt)}</p>
        </div>
        <button class="modal-close-button" type="button" data-close-result-detail aria-label="Close result detail">Close</button>
      </div>
      <section class="score-summary">
        <div>
          <span>Total score</span>
          <strong>${formatScore(result.score.total)}/${formatScore(result.score.possible)}</strong>
        </div>
        <div>
          <span>Percent</span>
          <strong>${result.score.percent}%</strong>
        </div>
        <div>
          <span>Level</span>
          <strong>${escapeHtml(result.student.level)}</strong>
        </div>
      </section>
      <section>
        <h3>Part scores</h3>
        <div class="part-list">
          ${result.partScores.map((part) => `
            <div class="part-row">
              <strong>${escapeHtml(part.part)}</strong>
              <span>${formatScore(part.total)}/${formatScore(part.possible)}</span>
            </div>
          `).join("") || "<p>No part scores available.</p>"}
        </div>
      </section>
      <section>
        <h3>Corrections</h3>
      <div class="correction-list">
        ${result.answers.map((answer) => `
          <div class="correction-row ${answer.correct ? "" : "is-wrong"}">
            <strong>${escapeHtml(answer.part)}: ${escapeHtml(answer.prompt)}</strong>
            <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)} · Score: ${formatScore(answer.score ?? (answer.correct ? 1 : 0))}/${formatScore(answer.possible ?? 1)}</span>
            ${renderGradingDetails(answer.gradingDetails)}
          </div>
        `).join("") || "<p>No answer details available.</p>"}
      </div>
      </section>
    `;
    panel.querySelector("[data-close-result-detail]")?.addEventListener("click", closeResultDetail);
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  function closeResultDetail() {
    const modal = document.querySelector("[data-result-modal]");
    if (!modal) return;
    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }
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
    return tests.find((test) => test.id === selectedTestId) || tests[0];
  }

  function mergeTests(databaseTests) {
    const byId = new Map(builtinTests.map((test) => [test.id, test]));
    databaseTests.forEach((test) => byId.set(test.id, { ...byId.get(test.id), ...test }));
    return Array.from(byId.values());
  }

  function normalizeAppPath(test) {
    const path = test.app_path || defaultAppPath(test.id);
    if (!path) return "../starter-listening/index.html";
    if (path.startsWith("/apps/")) return `..${path.replace("/apps", "")}`;
    return path;
  }

  function defaultAppPath(testId) {
    if (testId === "english-literacy-1") return "/apps/english-literacy/level-1/index.html";
    if (testId === "english-literacy-2") return "/apps/english-literacy/level-2/index.html";
    if (testId === "english-literacy-3") return "/apps/english-literacy/level-3/index.html";
    if (testId === "english-literacy-4") return "/apps/english-literacy/level-4/index.html";
    if (testId === "english-literacy-5") return "/apps/english-literacy/level-5/index.html";
    if (testId === "math-olympiad-1") return "/apps/math-olympiad/level-1/index.html";
    if (testId === "math-olympiad-2") return "/apps/math-olympiad/level-2/index.html";
    if (testId === "math-olympiad-3") return "/apps/math-olympiad/level-3/index.html";
    if (testId === "math-olympiad-4") return "/apps/math-olympiad/level-4/index.html";
    if (testId === "math-olympiad-5") return "/apps/math-olympiad/level-5/index.html";
    if (testId === "math-olympiad-6") return "/apps/math-olympiad/level-6/index.html";
    if (testId === "spip-year-7-english-pre") return "/apps/spip/year-7-english-pre/index.html";
    if (testId === "spip-year-7-math-pre") return "/apps/spip/year-7-math-pre/index.html";
    if (testId === "spip-year-7-science-pre") return "/apps/spip/year-7-science-pre/index.html";
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

  function renderGradingDetails(details) {
    if (details?.parts?.length) {
      return `
        <span>Parts: ${details.parts.map((part) => `${escapeHtml(part.id)} ${formatScore(part.score)}/${formatScore(part.possible)}`).join(" · ")}</span>
      `;
    }
    if (!details || typeof details !== "object" || !("contentScore" in details)) return "";
    return `
      <span>Content: ${formatScore(details.contentScore)}/0.5 · Writing: ${formatScore(details.writingScore)}/0.5</span>
      ${details.feedback ? `<span>${escapeHtml(details.feedback)}</span>` : ""}
    `;
  }

  function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
  }

  function normalizeSearch(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
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
