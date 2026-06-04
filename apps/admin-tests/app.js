(function () {
  "use strict";

  const RESULT_STORAGE_KEY = "keaes-test-results-v1";
  const SESSION_KEY = "keaesx-employee-session";
  const tests = [
    {
      id: "starter-progress-listening",
      title: "Starter Progress Listening",
      subject: "English",
      level: "Cambridge Starters",
      href: "../starter-listening/index.html?testId=starter-progress-listening",
      status: "active",
    },
  ];

  let selectedResultId = null;

  document.addEventListener("DOMContentLoaded", () => {
    requireAdminSession();
    renderChrome();
    renderDashboard();
    bindActions();
  });

  function requireAdminSession() {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      window.location.href = "../../login.html";
    }
  }

  function renderChrome() {
    try {
      const employee = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      document.querySelectorAll("[data-employee-badge]").forEach((badge) => {
        badge.classList.toggle("hidden", !employee);
        if (employee) badge.textContent = employee.name || employee.email || "Employee";
      });
      document.querySelectorAll("[data-logout-button]").forEach((button) => button.classList.toggle("hidden", !employee));
    } catch {
      // Keep chrome empty if the mock session is malformed.
    }
  }

  function bindActions() {
    document.querySelector("[data-test-select]").addEventListener("change", updateGeneratedLink);
    document.querySelector("[data-copy-link]").addEventListener("click", copyLink);
    document.querySelector("[data-seed-results]").addEventListener("click", () => {
      if (!readResults().length) localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(sampleResults()));
      renderDashboard();
    });
    document.querySelectorAll("[data-logout-button]").forEach((button) => {
      button.addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = "../../index.html";
      });
    });
  }

  function renderDashboard() {
    renderTests();
    renderLinkGenerator();
    renderResults();
    renderMetrics();
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

  function updateGeneratedLink() {
    const selected = tests.find((test) => test.id === document.querySelector("[data-test-select]").value) || tests[0];
    const absoluteUrl = new URL(selected.href, window.location.href).href;
    document.querySelector("[data-share-url]").value = absoluteUrl;
    document.querySelector("[data-open-link]").href = absoluteUrl;
    document.querySelector("[data-message-template]").value = [
      `Please complete: ${selected.title}`,
      "",
      absoluteUrl,
      "",
      "Enter your student details before starting. Once the listening exam starts, the audio will continue until it finishes.",
    ].join("\n");
  }

  async function copyLink() {
    const input = document.querySelector("[data-share-url]");
    try {
      await navigator.clipboard.writeText(input.value);
      document.querySelector("[data-copy-link]").textContent = "Copied";
      setTimeout(() => (document.querySelector("[data-copy-link]").textContent = "Copy link"), 1200);
    } catch {
      input.select();
      document.execCommand("copy");
    }
  }

  function renderMetrics() {
    const results = readResults();
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
    const results = readResults();
    if (!selectedResultId && results[0]) selectedResultId = results[0].id;
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
      <tr><td colspan="6">No submitted results yet. Complete the test in this browser or load sample data.</td></tr>
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
        ${result.answers.slice(0, 8).map((answer) => `
          <div class="correction-row ${answer.correct ? "" : "is-wrong"}">
            <strong>${escapeHtml(answer.part)}: ${escapeHtml(answer.prompt)}</strong>
            <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function readResults() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RESULT_STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function sampleResults() {
    return [
      {
        id: "sample-result-1",
        testId: "starter-progress-listening",
        testTitle: "Starter Progress Listening",
        student: {
          fullName: "Mina Chen",
          nickname: "Mina",
          dateOfBirth: "2016-04-18",
          subject: "English",
          level: "Cambridge Starters",
          testDate: new Date().toISOString().slice(0, 10),
        },
        score: { total: 18, possible: 20, percent: 90 },
        partScores: [
          { part: "Part 1", total: 5, possible: 5 },
          { part: "Part 2", total: 4, possible: 5 },
          { part: "Part 3", total: 5, possible: 5 },
          { part: "Part 4", total: 4, possible: 5 },
        ],
        answers: [
          { part: "Part 1", prompt: "Put the clock between the two pictures.", response: "between the two pictures", correctAnswer: "Clock -> between the two pictures", correct: true },
          { part: "Part 2", prompt: "Which class are the two children in at school?", response: "7", correctAnswer: "8 / eight", correct: false },
        ],
        submittedAt: new Date().toISOString(),
      },
    ];
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
