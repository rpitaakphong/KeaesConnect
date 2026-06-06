(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "starter-progress-test";
  const PROFILE_STORAGE_KEY = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const ANSWER_STORAGE_KEY = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const RW_UI_VERSION_KEY = `keaes-rw-ui-version-v1:${assignmentToken || testId}`;
  const RW_UI_VERSION = "icon-choices-empty-default";
  const WINDOW_NAME_PROFILE_KEY = "__keaesTestProfilesV1";

  const state = {
    currentPart: "rwPart1",
    studentProfile: null,
    answers: {
      connections: { radio: "bookcase" },
      textAnswers: {},
      choices: {},
      colours: { exampleDuck: "#f59e0b" },
      rwAnswers: {},
    },
    submitted: false,
    submissionPending: false,
    submitError: "",
    submittedScore: null,
    savedResultId: null,
  };

  const rwParts = [
    {
      id: "rwPart1",
      label: "Reading & Writing Part 1",
      list: "part1",
      type: "choice",
      choices: [
        { value: "tick", label: "Tick", symbol: "✓" },
        { value: "cross", label: "Cross", symbol: "×" },
      ],
      questions: [
        { id: "rw1q1", prompt: "This is a lizard.", image: "assets/rw-p1-lizard.jpg", alt: "Lizard picture." },
        { id: "rw1q2", prompt: "This is a bike.", image: "assets/rw-p1-bike.jpg", alt: "Bike picture." },
        { id: "rw1q3", prompt: "This is a pineapple.", image: "assets/rw-p1-pineapple.jpg", alt: "Pineapple picture." },
        { id: "rw1q4", prompt: "This is a television.", image: "assets/rw-p1-phone.jpg", alt: "Phone picture." },
        { id: "rw1q5", prompt: "This is a guitar.", image: "assets/rw-p1-guitar.jpg", alt: "Guitar picture." },
      ],
    },
    {
      id: "rwPart2",
      label: "Reading & Writing Part 2",
      list: "part2",
      type: "choice",
      variant: "text-choice",
      choices: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      questions: [
        { id: "rw2q1", prompt: "There are two children in the sea." },
        { id: "rw2q2", prompt: "The duck is walking behind the two elephants." },
        { id: "rw2q3", prompt: "The girls are playing with a ball." },
        { id: "rw2q4", prompt: "The woman in the boat has got a camera." },
        { id: "rw2q5", prompt: "The crocodile is eating a coconut." },
      ],
    },
    {
      id: "rwPart3",
      label: "Reading & Writing Part 3",
      list: "part3",
      type: "text",
      questions: [
        { id: "rw3q1", prompt: "1. Blue trousers", image: "assets/rw-p3-jeans.jpg", alt: "Blue trousers.", letters: ["n", "a", "j", "s", "e"] },
        { id: "rw3q2", prompt: "2. Purple shoes", image: "assets/rw-p3-shoes.jpg", alt: "Purple shoes.", letters: ["e", "s", "o", "h", "s"] },
        { id: "rw3q3", prompt: "3. Green jacket", image: "assets/rw-p3-jacket.jpg", alt: "Green jacket.", letters: ["c", "j", "t", "k", "e", "a"] },
        { id: "rw3q4", prompt: "4. Handbag", image: "assets/rw-p3-handbag.jpg", alt: "Handbag.", letters: ["n", "g", "a", "a", "b", "d", "h"] },
        { id: "rw3q5", prompt: "5. Green trousers", image: "assets/rw-p3-trousers.jpg", alt: "Green trousers.", letters: ["r", "o", "t", "s", "r", "e", "u", "s"] },
      ],
    },
    {
      id: "rwPart4",
      label: "Reading & Writing Part 4",
      list: "part4",
      type: "select",
      options: ["", "hippo", "water", "carrots", "hair", "man", "house", "piano"],
      questions: [
        { id: "rw4q1", prompt: "1. Long _____ on my head." },
        { id: "rw4q2", prompt: "2. I don't live in a _____ or a garden." },
        { id: "rw4q3", prompt: "3. I like eating _____ and apples." },
        { id: "rw4q4", prompt: "4. I drink _____." },
        { id: "rw4q5", prompt: "5. A woman, a _____ or a child can ride me." },
      ],
    },
    {
      id: "rwPart5",
      label: "Reading & Writing Part 5",
      list: "part5",
      type: "text",
      questions: [
        { id: "rw5q1", prompt: "1. What is the teacher drawing? a ..." },
        { id: "rw5q2", prompt: "2. Who is holding the cat? a ..." },
        { id: "rw5q3", prompt: "3. What is the teacher doing now?" },
        { id: "rw5q4", prompt: "4. Where is the cat now? at the ..." },
        { id: "rw5q5", prompt: "5. How many children are looking at the cat?" },
      ],
    },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    if (!loadStudentProfile()) return;
    clearLegacyRwSelections();
    loadSavedAnswers();
    buildAnswerLists();
    bindNavigation();
    bindInputs();
    bindSubmit();
    renderAll();
  });

  function loadStudentProfile() {
    const profile = readStudentProfile();
    if (!profile) {
      const landingUrl = new URL("index.html", window.location.href);
      landingUrl.searchParams.set("testId", testId);
      if (assignmentToken) landingUrl.searchParams.set("assignment", assignmentToken);
      window.location.replace(landingUrl.href);
      return false;
    }
    state.studentProfile = profile;
    return true;
  }

  function readStudentProfile() {
    try {
      const stored = window.sessionStorage?.getItem(PROFILE_STORAGE_KEY);
      const profile = normalizeStudentProfile(JSON.parse(stored || "null"));
      if (profile) return profile;
    } catch {
      // Fall through to tab-local storage for restricted browser contexts.
    }
    try {
      const parsed = JSON.parse(window.name || "{}");
      return normalizeStudentProfile(parsed?.[WINDOW_NAME_PROFILE_KEY]?.[PROFILE_STORAGE_KEY]);
    } catch {
      return null;
    }
  }

  function normalizeStudentProfile(value) {
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
    return ["fullName", "nickname", "dateOfBirth", "subject", "level", "testDate", "assignmentToken"].every((key) => profile[key]) ? profile : null;
  }

  function loadSavedAnswers() {
    try {
      const stored = JSON.parse(window.sessionStorage?.getItem(ANSWER_STORAGE_KEY) || "null");
      if (!stored || typeof stored !== "object") return;
      state.answers = {
        connections: { radio: "bookcase", ...(stored.connections || {}) },
        textAnswers: stored.textAnswers || {},
        choices: stored.choices || {},
        colours: { exampleDuck: "#f59e0b", ...(stored.colours || {}) },
        rwAnswers: stored.rwAnswers || {},
      };
    } catch {
      // Ignore corrupt session answer state.
    }
  }

  function clearLegacyRwSelections() {
    try {
      if (window.sessionStorage?.getItem(RW_UI_VERSION_KEY) === RW_UI_VERSION) return;
      const stored = JSON.parse(window.sessionStorage?.getItem(ANSWER_STORAGE_KEY) || "null");
      if (stored && typeof stored === "object" && stored.rwAnswers) {
        stored.rwAnswers = {};
        window.sessionStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(stored));
      }
      window.sessionStorage?.setItem(RW_UI_VERSION_KEY, RW_UI_VERSION);
    } catch {
      // Ignore restricted or corrupt session state.
    }
  }

  function saveAnswers() {
    try {
      window.sessionStorage?.setItem(ANSWER_STORAGE_KEY, JSON.stringify(state.answers));
    } catch {
      // Session persistence is best effort.
    }
  }

  function buildAnswerLists() {
    rwParts.forEach((part) => {
      const list = document.querySelector(`[data-rw-list="${part.list}"]`);
      if (!list) return;
      list.innerHTML = part.type === "select"
        ? renderStoryQuestion(part)
        : part.questions.map((question) => renderQuestion(part, question)).join("");
    });
  }

  function renderQuestion(part, question) {
    if (part.type === "choice") {
      const image = question.image ? `<img class="rw-question-image" src="${escapeHtml(question.image)}" alt="${escapeHtml(question.alt || "")}">` : "";
      return `
        <fieldset class="rw-question ${question.image ? "rw-picture-question" : ""}">
          <legend>${escapeHtml(question.prompt)}</legend>
          ${image}
          <div class="rw-choice-row ${part.variant || ""}">
            ${part.choices.map((choice) => `
              <label class="rw-choice">
                <input type="radio" name="${question.id}" value="${choice.value}" data-rw-answer="${question.id}">
                ${choice.symbol
                  ? `<span class="choice-symbol" aria-hidden="true">${escapeHtml(choice.symbol)}</span><span class="sr-only">${choice.label}</span>`
                  : `<span class="choice-label">${escapeHtml(choice.label)}</span>`}
              </label>
            `).join("")}
          </div>
        </fieldset>
      `;
    }
    if (part.type === "select") {
      return `
        <label class="rw-question">${escapeHtml(question.prompt)}
          <select data-rw-answer="${question.id}">
            ${part.options.map((option) => `<option value="${escapeHtml(option)}">${option ? escapeHtml(option) : "Choose a word"}</option>`).join("")}
          </select>
        </label>
      `;
    }
    if (question.image) {
      return `
        <label class="rw-question rw-spell-question">${escapeHtml(question.prompt)}
          <img class="rw-question-image" src="${escapeHtml(question.image)}" alt="${escapeHtml(question.alt || "")}">
          <span class="letter-clues" aria-label="Letters">${question.letters.map((letter) => `<span>${escapeHtml(letter)}</span>`).join("")}</span>
          <input data-rw-answer="${question.id}" autocomplete="off">
        </label>
      `;
    }
    return `
      <label class="rw-question">${escapeHtml(question.prompt)}
        <input data-rw-answer="${question.id}" autocomplete="off">
      </label>
    `;
  }

  function renderStoryQuestion(part) {
    const select = (id) => `
      <select class="inline-answer" data-rw-answer="${id}">
        ${part.options.map((option) => `<option value="${escapeHtml(option)}">${option ? escapeHtml(option) : "Choose"}</option>`).join("")}
      </select>
    `;
    return `
      <p>I've got four <strong>legs</strong>, two ears, two eyes and long ${select("rw4q1")} on my head.</p>
      <p>I'm a big animal. I don't live in a ${select("rw4q2")} or a garden.</p>
      <p>I like eating ${select("rw4q3")} and apples. I drink ${select("rw4q4")}.</p>
      <p>A woman, a ${select("rw4q5")} or a child can ride me.</p>
      <p><strong>What am I?</strong> I am a horse.</p>
    `;
  }

  function bindNavigation() {
    document.querySelectorAll("[data-rw-part-button]").forEach((button) => {
      button.addEventListener("click", () => {
        state.currentPart = button.dataset.rwPartButton;
        renderAll();
      });
    });
  }

  function bindInputs() {
    document.querySelectorAll("[data-rw-answer]").forEach((input) => {
      const eventName = input.type === "radio" || input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(eventName, () => {
        if (state.submitted) return;
        state.answers.rwAnswers[input.dataset.rwAnswer] = input.value;
        saveAnswers();
        renderAll();
      });
    });
  }

  function bindSubmit() {
    document.querySelectorAll("[data-submit]").forEach((button) => {
      button.addEventListener("click", confirmSubmit);
    });
    const dialog = document.querySelector("[data-submit-dialog]");
    if (!dialog) return;
    dialog.addEventListener("close", () => {
      if (dialog.returnValue === "confirm") finalizeSubmission();
    });
  }

  function confirmSubmit() {
    if (state.submitted) return;
    const dialog = document.querySelector("[data-submit-dialog]");
    if (dialog?.showModal) {
      dialog.returnValue = "";
      dialog.showModal();
      return;
    }
    if (window.confirm("Submit full test now? Your answers will be marked and you cannot continue the test.")) {
      finalizeSubmission();
    }
  }

  function finalizeSubmission() {
    if (state.submitted || state.submissionPending) return;
    state.submissionPending = true;
    state.submitError = "";
    state.currentPart = "rwReview";
    renderAll();
    saveResult()
      .then((score) => {
        state.submittedScore = score;
        state.submitted = true;
      })
      .catch((err) => {
        state.submitError = err.message;
      })
      .finally(() => {
        state.submissionPending = false;
        renderAll();
      });
  }

  async function saveResult() {
    if (!state.studentProfile || state.savedResultId) return state.submittedScore;
    if (!window.KeaesApi?.isConfigured()) {
      throw new Error("Supabase is not configured. Ask staff to configure the database before accepting test submissions.");
    }
    const result = await window.KeaesApi.submitAttempt({
      assignmentToken: state.studentProfile.assignmentToken,
      student: state.studentProfile,
      answers: state.answers,
    });
    state.savedResultId = result.attemptId;
    return normalizeServerScore(result);
  }

  function normalizeServerScore(result) {
    return {
      total: result.total,
      possible: result.possible,
      sections: result.sections || {},
    };
  }

  function renderAll() {
    renderLinks();
    renderStudentProfile();
    renderNavigation();
    renderInputs();
    renderReview();
    renderProgress();
  }

  function renderLinks() {
    const link = document.querySelector("[data-listening-link]");
    if (!link) return;
    const url = new URL("test.html", window.location.href);
    url.searchParams.set("testId", testId);
    if (assignmentToken) url.searchParams.set("assignment", assignmentToken);
    link.href = url.href;
  }

  function renderStudentProfile() {
    const summary = document.querySelector("[data-student-summary]");
    if (!summary || !state.studentProfile) return;
    summary.hidden = false;
    summary.innerHTML = `
      <h3>${escapeHtml(state.studentProfile.fullName)} (${escapeHtml(state.studentProfile.nickname)})</h3>
      <p>${escapeHtml(state.studentProfile.subject)} · ${escapeHtml(state.studentProfile.level)} · Test date ${escapeHtml(state.studentProfile.testDate)}</p>
    `;
  }

  function renderNavigation() {
    document.querySelectorAll("[data-rw-part]").forEach((part) => {
      part.classList.toggle("is-active", part.id === state.currentPart);
    });
    document.querySelectorAll("[data-rw-part-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.rwPartButton === state.currentPart);
    });
  }

  function renderInputs() {
    document.querySelectorAll("[data-rw-answer]").forEach((input) => {
      const stored = state.answers.rwAnswers[input.dataset.rwAnswer] || "";
      if (input.type === "radio") input.checked = input.value === stored;
      else if (input.value !== stored) input.value = stored;
      input.disabled = state.submitted || state.submissionPending;
    });
    document.querySelectorAll("[data-submit]").forEach((button) => {
      button.disabled = state.submitted || state.submissionPending;
      button.textContent = state.submitted ? "Submitted" : state.submissionPending ? "Submitting..." : "Submit test";
    });
  }

  function renderReview() {
    const grid = document.querySelector("[data-review-grid]");
    if (grid) {
      grid.innerHTML = getPartStatus().map((part) => `
        <article class="review-card">
          <h3>${escapeHtml(part.label)}</h3>
          <p>${part.completed}/${part.total} answers completed</p>
        </article>
      `).join("");
    }
    const result = document.querySelector("[data-result-card]");
    if (!result) return;
    result.hidden = !state.submitted && !state.submitError;
    if (state.submitted) {
      result.innerHTML = renderScoreSummary(state.submittedScore);
    } else if (state.submitError) {
      result.innerHTML = `<div class="pending-note">Submission failed: ${escapeHtml(state.submitError)}</div>`;
    }
  }

  function renderProgress() {
    const completed = getPartStatus().reduce((sum, part) => sum + part.completed, 0);
    document.querySelectorAll("[data-progress-count]").forEach((node) => {
      node.textContent = completed;
    });
  }

  function getPartStatus() {
    const answers = state.answers;
    const rw = answers.rwAnswers || {};
    return [
      { label: "Listening Part 1", completed: ["clock", "book", "phone", "camera", "shell"].filter((id) => answers.connections?.[id]).length, total: 5 },
      { label: "Listening Part 2", completed: ["p2q1", "p2q2", "p2q3", "p2q4", "p2q5"].filter((id) => (answers.textAnswers?.[id] || "").trim()).length, total: 5 },
      { label: "Listening Part 3", completed: ["p3q1", "p3q2", "p3q3", "p3q4", "p3q5"].filter((id) => answers.choices?.[id]).length, total: 5 },
      { label: "Listening Part 4", completed: ["man-bird", "tree-bird", "flying-bird", "standing-bird", "flower-bird"].filter((id) => answers.colours?.[id]).length, total: 5 },
      ...rwParts.map((part) => ({ label: part.label, completed: part.questions.filter((q) => (rw[q.id] || "").trim()).length, total: 5 })),
    ];
  }

  function renderScoreSummary(score) {
    const partScores = Object.entries(score.sections)
      .map(([part, items]) => {
        const correct = items.filter((item) => item.correct).length;
        return `
          <article class="part-score">
            <span>${escapeHtml(formatPartLabel(part, items[0]?.part))}</span>
            <strong>${correct}/${items.length}</strong>
          </article>
        `;
      })
      .join("");
    const corrections = Object.values(score.sections)
      .flat()
      .map((item, index) => `
        <article class="correction-item ${item.correct ? "is-correct" : ""}">
          <h4>${index + 1}. ${escapeHtml(item.part)}: ${escapeHtml(item.prompt)}</h4>
          <p>Your answer: <strong>${escapeHtml(item.response)}</strong></p>
          <p>Correct answer: <strong>${escapeHtml(item.correctAnswer)}</strong></p>
          ${item.transcript ? `<p class="transcript-ref">Reference: ${escapeHtml(item.transcript)}</p>` : ""}
        </article>
      `)
      .join("");
    return `
      <div class="score-banner">
        <span>Total score</span>
        <strong>${score.total}/${score.possible}</strong>
      </div>
      <div class="part-score-grid">${partScores}</div>
      <h3>Corrections</h3>
      <div class="correction-list">${corrections}</div>
    `;
  }

  function formatPartLabel(key, fallback) {
    if (fallback) return fallback;
    return String(key).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
  }

  function cleanText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
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
