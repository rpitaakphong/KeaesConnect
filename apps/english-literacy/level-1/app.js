(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "english-literacy-1";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const answerStorageKey = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";

  const state = {
    currentPart: "partA",
    profile: null,
    answers: {},
    submitted: false,
    submissionPending: false,
    submitError: "",
    submittedScore: null,
    savedResultId: null,
  };

  const parts = [
    {
      id: "partA",
      label: "Part A",
      title: "Which word rhymes with the word on the left?",
      hint: "Choose one answer for each word.",
      questions: [
        choice("el1-q1", "1. Boat", ["bat", "coat", "bet"]),
        choice("el1-q2", "2. Glad", ["sad", "happy", "cat"]),
        choice("el1-q3", "3. Cage", ["car", "page", "cake"]),
        choice("el1-q4", "4. Wish", ["list", "wash", "fish"]),
        choice("el1-q5", "5. Play", ["bay", "baby", "pal"]),
      ],
    },
    {
      id: "part2",
      label: "Part 2",
      title: "Name each picture using words with consonant blends.",
      hint: "Type the name of each picture.",
      questions: [
        imageText("el1-q6", "6.", "assets/q6-truck-color.png", "Truck"),
        imageText("el1-q7", "7.", "assets/q7-crab-color.png", "Crab"),
        imageText("el1-q8", "8.", "assets/q8-flag-color.png", "Flag"),
        imageText("el1-q9", "9.", "assets/q9-glue-color.png", "Glue"),
        imageText("el1-q10", "10.", "assets/q10-oven-color.png", "Oven"),
        imageText("el1-q11", "11.", "assets/q11-clock-color.png", "Clock"),
        imageText("el1-q12", "12.", "assets/q12-crown-color.png", "Crown"),
        imageText("el1-q13", "13.", "assets/q13-broom-color.png", "Broom"),
        imageText("el1-q14", "14.", "assets/q14-frog-color.png", "Frog"),
        imageText("el1-q15", "15.", "assets/q15-spoon-color.png", "Spoon"),
      ],
    },
    {
      id: "part3",
      label: "Part 3",
      title: "Cross the odd one out.",
      hint: "Choose the picture that does not belong.",
      questions: [
        imageChoice("el1-q16", "16.", [
          option("star", "assets/q16-star-color.png", "Star"),
          option("cloud", "assets/q16-cloud-color.png", "Cloud"),
          option("car", "assets/q16-car-color.png", "Car"),
        ]),
        imageChoice("el1-q17", "17.", [
          option("coin", "assets/q17-coin-color.png", "Coin"),
          option("toys", "assets/q17-toys-color.png", "Toys"),
          option("boy", "assets/q17-boy-color.png", "Boy"),
        ]),
        imageChoice("el1-q18", "18.", [
          option("glass", "assets/q18-glass-color.png", "Glass"),
          option("grass", "assets/q18-grass-color.png", "Grass"),
          option("boat", "assets/q18-boat-color.png", "Boat"),
        ]),
        imageChoice("el1-q19", "19.", [
          option("mouse", "assets/q19-mouse-color.png", "Mouse"),
          option("house", "assets/q19-house-color.png", "House"),
          option("dog", "assets/q19-dog-color.png", "Dog"),
        ]),
        imageChoice("el1-q20", "20.", [
          option("honey", "assets/q20-honey-color.png", "Honey"),
          option("bee", "assets/q20-bee-color.png", "Bee"),
          option("money", "assets/q20-money-color.png", "Money"),
        ]),
      ],
    },
    {
      id: "part4",
      label: "Part 4",
      title: "Write the missing letters in each word.",
      hint: "Type only the missing letters.",
      questions: [
        letter("el1-q21", "21. sup __ market", "Missing letters"),
        letter("el1-q22", "22. __ agonfly", "Missing letters"),
        letter("el1-q23", "23. rainb __", "Missing letters"),
        letter("el1-q24", "24. bestfr __ nd", "Missing letters"),
        letter("el1-q25", "25. bedr __ m", "Missing letters"),
      ],
    },
    {
      id: "part5",
      label: "Part 5",
      title: "Read the story and write TRUE or FALSE.",
      hint: "Choose true or false for each sentence.",
      story: "It's Arbor Day, and Marla and Tio are planting a tree in their backyard. Their parents are watching TV in the living room and they don't know what the children are doing. Marla and Tio learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.",
      questions: [
        trueFalse("el1-q26", "26. It is New Year's Day."),
        trueFalse("el1-q27", "27. Marla and Tio are playing in the park."),
        trueFalse("el1-q28", "28. Their parents are watching TV."),
        trueFalse("el1-q29", "29. The children are planting flowers."),
        trueFalse("el1-q30", "30. Their teachers said trees provide home for birds."),
      ],
    },
    {
      id: "review",
      label: "Review",
      title: "Check your answers.",
      hint: "Submit when you are ready.",
      questions: [],
    },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    if (!loadProfile()) return;
    loadAnswers();
    buildShell();
    bindEvents();
    renderAll();
  });

  function choice(id, prompt, choices) {
    return { id, type: "choice", prompt, choices: choices.map((value) => ({ value, label: value })) };
  }

  function imageText(id, prompt, image, alt) {
    return { id, type: "imageText", prompt, image, alt };
  }

  function imageChoice(id, prompt, choices) {
    return { id, type: "imageChoice", prompt, choices };
  }

  function option(value, image, label) {
    return { value, image, label };
  }

  function letter(id, prompt, placeholder) {
    return { id, type: "letter", prompt, placeholder };
  }

  function trueFalse(id, prompt) {
    return { id, type: "trueFalse", prompt };
  }

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
    return ["fullName", "nickname", "dateOfBirth", "subject", "level", "testDate", "assignmentToken"].every((key) => profile[key]) ? profile : null;
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
    document.querySelector("[data-part-nav]").innerHTML = parts.map((part) => `
      <button class="part-tab" type="button" data-part-button="${part.id}">${escapeHtml(part.label)}</button>
    `).join("");
    document.querySelector("[data-test-panel]").innerHTML = parts.map(renderPart).join("");
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
      <section class="part" id="${part.id}" data-part>
        <div class="part-heading">
          <div>
            <p class="eyebrow">${escapeHtml(part.label)} - ${part.questions.length} questions</p>
            <h2>${escapeHtml(part.title)}</h2>
          </div>
          <p class="hint">${escapeHtml(part.hint)}</p>
        </div>
        ${part.story ? `<article class="story-panel">${escapeHtml(part.story)}</article>` : ""}
        <div class="question-list ${part.id === "part2" ? "picture-grid" : ""} ${part.id === "part3" ? "odd-grid" : ""}">
          ${part.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `;
  }

  function renderQuestion(question) {
    if (question.type === "choice") {
      return `
        <fieldset class="question-card">
          <legend>${escapeHtml(question.prompt)}</legend>
          <div class="choice-row">
            ${question.choices.map((choiceItem) => choiceInput(question, choiceItem)).join("")}
          </div>
        </fieldset>
      `;
    }
    if (question.type === "imageText") {
      return `
        <label class="question-card picture-card">
          <span class="question-number">${escapeHtml(question.prompt)}</span>
          <img src="${escapeHtml(question.image)}" alt="${escapeHtml(question.alt)}">
          <input data-answer="${question.id}" autocomplete="off" aria-label="${escapeHtml(question.prompt)} ${escapeHtml(question.alt)}">
        </label>
      `;
    }
    if (question.type === "imageChoice") {
      return `
        <fieldset class="question-card odd-card">
          <legend>${escapeHtml(question.prompt)}</legend>
          <div class="image-choice-row">
            ${question.choices.map((choiceItem) => imageChoiceInput(question, choiceItem)).join("")}
          </div>
        </fieldset>
      `;
    }
    if (question.type === "letter") {
      return `
        <label class="question-card text-card">
          <span>${escapeHtml(question.prompt)}</span>
          <input data-answer="${question.id}" autocomplete="off" aria-label="${escapeHtml(question.prompt)}" placeholder="${escapeHtml(question.placeholder)}">
        </label>
      `;
    }
    return `
      <fieldset class="question-card">
        <legend>${escapeHtml(question.prompt)}</legend>
        <div class="choice-row true-false-row">
          ${choiceInput(question, { value: "true", label: "True" })}
          ${choiceInput(question, { value: "false", label: "False" })}
        </div>
      </fieldset>
    `;
  }

  function choiceInput(question, choiceItem) {
    return `
      <label class="choice-pill">
        <input type="radio" name="${question.id}" value="${escapeHtml(choiceItem.value)}" data-answer="${question.id}">
        <span>${escapeHtml(choiceItem.label)}</span>
      </label>
    `;
  }

  function imageChoiceInput(question, choiceItem) {
    return `
      <label class="image-choice">
        <input type="radio" name="${question.id}" value="${escapeHtml(choiceItem.value)}" data-answer="${question.id}">
        <img src="${escapeHtml(choiceItem.image)}" alt="${escapeHtml(choiceItem.label)}">
        <span>${escapeHtml(choiceItem.label)}</span>
      </label>
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
    state.answers[input.dataset.answer] = cleanText(input.value);
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
    const key = {
      "el1-q1": "coat",
      "el1-q2": "sad",
      "el1-q3": "page",
      "el1-q4": "fish",
      "el1-q5": "bay",
      "el1-q6": "truck",
      "el1-q7": "crab",
      "el1-q8": "flag",
      "el1-q9": "glue",
      "el1-q10": "oven",
      "el1-q11": "clock",
      "el1-q12": "crown",
      "el1-q13": "broom",
      "el1-q14": "frog",
      "el1-q15": "spoon",
      "el1-q16": "cloud",
      "el1-q17": "coin",
      "el1-q18": "boat",
      "el1-q19": "dog",
      "el1-q20": "bee",
      "el1-q21": "er",
      "el1-q22": "dr",
      "el1-q23": "ow",
      "el1-q24": "ie",
      "el1-q25": "oo",
      "el1-q26": "false",
      "el1-q27": "false",
      "el1-q28": "true",
      "el1-q29": "false",
      "el1-q30": "true",
    };
    const sections = {};
    parts.filter((part) => part.questions.length).forEach((part) => {
      sections[part.id] = part.questions.map((question) => {
        const response = state.answers[question.id] || "";
        const correctAnswer = key[question.id];
        return {
          part: part.label,
          prompt: question.prompt,
          response: response || "No answer",
          correctAnswer,
          correct: normalizeAnswer(response) === normalizeAnswer(correctAnswer),
        };
      });
    });
    const all = Object.values(sections).flat();
    return {
      total: all.filter((answer) => answer.correct).length,
      possible: all.length,
      sections,
    };
  }

  function isDemoAssignment() {
    return window.location.hostname === "127.0.0.1" && assignmentToken === "demo";
  }

  function normalizeAnswer(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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
    document.querySelectorAll("[data-part]").forEach((part) => {
      part.classList.toggle("is-active", part.id === state.currentPart);
    });
    document.querySelectorAll("[data-part-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.partButton === state.currentPart);
    });
  }

  function renderInputs() {
    document.querySelectorAll("[data-answer]").forEach((input) => {
      const value = state.answers[input.dataset.answer] || "";
      if (input.type === "radio") input.checked = input.value === value;
      else input.value = value;
      input.disabled = state.submitted || state.submissionPending;
    });
  }

  function renderProgress() {
    const answered = allQuestions().filter((question) => Boolean(state.answers[question.id])).length;
    document.querySelector("[data-progress-count]").textContent = answered;
  }

  function renderReview() {
    const grid = document.querySelector("[data-review-grid]");
    if (!grid) return;
    grid.innerHTML = parts.filter((part) => part.questions.length).map((part) => {
      const count = part.questions.filter((question) => Boolean(state.answers[question.id])).length;
      return `
        <article class="review-card">
          <strong>${escapeHtml(part.label)}</strong>
          <span>${count}/${part.questions.length} answered</span>
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
        <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)}</span>
      </div>
    `).join("");
    return `
      <div class="score-banner">
        <span>Total score</span>
        <strong>${score.total}/${score.possible}</strong>
      </div>
      <div class="correction-list">${corrections}</div>
    `;
  }

  function allQuestions() {
    return parts.flatMap((part) => part.questions);
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
