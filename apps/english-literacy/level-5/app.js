(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "english-literacy-5";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const answerStorageKey = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";

  const state = {
    currentPart: "part1",
    profile: null,
    answers: {},
    submitted: false,
    submissionPending: false,
    submitError: "",
    submittedScore: null,
    savedResultId: null,
  };

  const storyText = [
    "In the freezing ocean waters of Antarctica, the planet's largest seals make their home in a frozen world. These giants are southern elephant seals, and they can grow as long as the length of a car and weigh as much as two cars combined. The name \"elephant seal\" comes from both the males' enormous size and from their giant trunk-like nose, called a proboscis. Females do not have a proboscis and they are much smaller.",
    "A thick layer of blubber keeps southern elephant seals warm in their icy habitat. The seals are clumsy on land, but in water they're graceful swimmers and incredible divers. They can easily dive 1,000 to 4,000 feet to hunt for squid, octopus, and various kinds of fish. Elephant seals are able to stay underwater for 20 minutes or more. The longest underwater session researchers observed is an amazing two hours! When they return to the surface to breathe, it's only for a few minutes. Then they dive again.",
    "While elephant seals spend most of their time swimming, they also gather on beaches in groups called colonies. One reason they come to land is to give birth and breed. Males arrive before females. They battle for dominance, deciding who will have large harems of females. Raising their enormous bodies, the males inflate their snouts and bellow. Usually these confrontations end quickly. However, sometimes only a physical battle can settle the matter. These fights can be bloody, but permanent injury is rare.",
    "Females arriving on land give birth to a single pup they've been carrying since the previous year. Newborns weigh about 90 pounds. The mother nurses her pup for a little over three weeks. After this, she breeds with a dominant male and then returns to the sea to feed. Her pup now weighs well over 200 pounds and is on its own. If it survives, it too will enter the sea within a couple of months.",
    "A second reason elephant seals come to land is to molt. When they molt, they shed old skin and fur and new skin and fur grows. A smaller species, the northern elephant seal, lives in the Pacific Ocean, dispersed from Baja, California to Alaska. Both northern and southern elephant seals were once hunted nearly to extinction. However, under legal protections both have made incredible comebacks.",
  ].join("\n\n");

  const answerKey = {
    "el5-q1": ["experiment"],
    "el5-q2": ["spaghetti"],
    "el5-q3": ["believe"],
    "el5-q4": ["business"],
    "el5-q5": ["article"],
    "el5-q6": ["thoughtful"],
    "el5-q7": ["complicated"],
    "el5-q8": ["briefly"],
    "el5-q9": ["talented"],
    "el5-q10": ["gracefully"],
    "el5-q11": ["p", "passive"],
    "el5-q12": ["a", "active"],
    "el5-q13": ["a", "active"],
    "el5-q14": ["p", "passive"],
    "el5-q15": ["a", "active"],
    "el5-q16": ["beauty"],
    "el5-q17": ["remove"],
    "el5-q18": ["different"],
    "el5-q19": ["fake"],
    "el5-q20": ["strange"],
    "el5-q21": ["better"],
    "el5-q22": ["coldest"],
    "el5-q23": ["more fabulous"],
    "el5-q24": ["most interesting"],
    "el5-q25": ["kindest"],
  };

  const aiRubric = {
    "el5-q26": "Correct if the answer says elephant seals are clumsy or have difficulty moving on land, but move easily, gracefully, or swim well in water.",
    "el5-q27": "Correct if the answer says males arrive first to battle or fight for dominance and decide which males will have large harems of females.",
    "el5-q28": "Correct if the answer gives two reasons elephant seals come on land: to give birth/breed and to molt.",
    "el5-q29": "Correct if the answer says elephant seals obtain food by diving or hunting underwater, and eat squid, octopus, and fish.",
    "el5-q30": "Correct if the answer says elephant seals are not currently in danger of extinction because legal protections or laws helped their populations recover.",
  };

  const parts = [
    {
      id: "part1",
      label: "Part I",
      title: "Choose the word that is spelled correctly.",
      hint: "Choose one correctly spelled word for each item.",
      questions: [
        choice("el5-q1", "1.", ["experiment", "experement", "iksperement", "expirement"]),
        choice("el5-q2", "2.", ["sphaggetti", "spaghetti", "sphagheti", "spagethie"]),
        choice("el5-q3", "3.", ["beleve", "bileive", "believe", "belive"]),
        choice("el5-q4", "4.", ["business", "buseness", "businesse", "bussiness"]),
        choice("el5-q5", "5.", ["article", "artecle", "arteckle", "artickel"]),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Choose the appropriate word.",
      hint: "Choose the word that completes each sentence.",
      questions: [
        choice("el5-q6", "6. My best friend is very (thoughtfully / thoughtful).", ["thoughtfully", "thoughtful"]),
        choice("el5-q7", "7. This problem is very (complication / complicated).", ["complication", "complicated"]),
        choice("el5-q8", "8. The reporter said the news (briefly / brief).", ["briefly", "brief"]),
        choice("el5-q9", "9. Julie is a (talentful / talented) girl.", ["talentful", "talented"]),
        choice("el5-q10", "10. Ballet dancers move (graceful / gracefully).", ["graceful", "gracefully"]),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Identify active or passive voice.",
      hint: "Choose active or passive.",
      questions: [
        choice("el5-q11", "11. My wallet was lost in the bus station.", [{ value: "a", label: "active" }, { value: "p", label: "passive" }]),
        choice("el5-q12", "12. Sara writes a biography of a famous actress.", [{ value: "a", label: "active" }, { value: "p", label: "passive" }]),
        choice("el5-q13", "13. The mechanic fixed the broken engine.", [{ value: "a", label: "active" }, { value: "p", label: "passive" }]),
        choice("el5-q14", "14. This shop is owned by my father.", [{ value: "a", label: "active" }, { value: "p", label: "passive" }]),
        choice("el5-q15", "15. The baby spilled the milk on the floor.", [{ value: "a", label: "active" }, { value: "p", label: "passive" }]),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Choose the word that does not belong.",
      hint: "Choose the odd word in each group.",
      questions: [
        choice("el5-q16", "16.", ["beauty", "character", "attitude", "manner"]),
        choice("el5-q17", "17.", ["produce", "remove", "create", "invent"]),
        choice("el5-q18", "18.", ["fresh", "new", "different", "current"]),
        choice("el5-q19", "19.", ["true", "real", "fake", "genuine"]),
        choice("el5-q20", "20.", ["strange", "ordinary", "normal", "common"]),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Write the correct form of the adjective.",
      hint: "Type the comparative or superlative form.",
      questions: [
        textAnswer("el5-q21", "21. Spending your free time reading is far ___ than spending it watching TV. (good)", "Adjective form"),
        textAnswer("el5-q22", "22. February is the ___ month in Chicago. (cold)", "Adjective form"),
        textAnswer("el5-q23", "23. My friend is ___ than yours. (fabulous)", "Adjective form"),
        textAnswer("el5-q24", "24. Gulliver's Travels is the ___ book that I've ever read. (interesting)", "Adjective form"),
        textAnswer("el5-q25", "25. You are the ___ person I know. (kind)", "Adjective form"),
      ],
    },
    {
      id: "part6",
      label: "Part VI",
      title: "Read the passage and answer the questions.",
      hint: "Write short answers. These answers are graded by AI when you submit.",
      storyTitle: "World's Largest Seal",
      story: storyText,
      storyImage: "assets/elephant-seal.svg",
      questions: [
        shortAnswer("el5-q26", "26. Describe how an elephant seal's movements are different on land than in the water."),
        shortAnswer("el5-q27", "27. Why do male elephant seals arrive on land before females during the breeding season?"),
        shortAnswer("el5-q28", "28. Describe two reasons why elephant seals come on land."),
        shortAnswer("el5-q29", "29. How does an elephant seal obtain its food? What foods are part of its diet?"),
        shortAnswer("el5-q30", "30. Are elephant seals in danger of becoming extinct today? Why or why not?"),
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
    return {
      id,
      type: "choice",
      prompt,
      choices: choices.map((choiceItem) => (
        typeof choiceItem === "string" ? { value: choiceItem, label: choiceItem } : choiceItem
      )),
    };
  }

  function textAnswer(id, prompt, placeholder) {
    return { id, type: "textAnswer", prompt, placeholder };
  }

  function shortAnswer(id, prompt) {
    return { id, type: "shortAnswer", prompt };
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
        ${part.story ? renderStory(part) : ""}
        <div class="question-list">
          ${part.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `;
  }

  function renderStory(part) {
    return `
      <article class="story-panel">
        ${part.storyTitle ? `<h3>${escapeHtml(part.storyTitle)}</h3>` : ""}
        <div class="${part.storyImage ? "story-with-image" : ""}">
          <div>${part.story.split("\n\n").map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          ${part.storyImage ? `<img src="${escapeHtml(part.storyImage)}" alt="">` : ""}
        </div>
      </article>
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
    if (question.type === "shortAnswer") {
      return `
        <label class="question-card text-card short-answer-card">
          <span>${escapeHtml(question.prompt)}</span>
          <textarea data-answer="${question.id}" rows="3" autocomplete="off" aria-label="${escapeHtml(question.prompt)}"></textarea>
        </label>
      `;
    }
    return `
      <label class="question-card text-card">
        <span>${escapeHtml(question.prompt)}</span>
        <input data-answer="${question.id}" autocomplete="off" aria-label="${escapeHtml(question.prompt)}" placeholder="${escapeHtml(question.placeholder)}">
      </label>
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
    const aiGrades = await gradeShortAnswers();
    const result = await window.KeaesApi.submitAttempt({
      assignmentToken: state.profile.assignmentToken,
      student: state.profile,
      answers: { ...state.answers, aiGrades },
    });
    state.savedResultId = result.attemptId;
    return {
      total: result.total,
      possible: result.possible,
      sections: result.sections || {},
    };
  }

  async function gradeShortAnswers() {
    if (!window.KeaesApi?.gradeEnglishLiteracyShortAnswers) {
      throw new Error("AI grading is not available. Ask staff to deploy the grading function before accepting Level 5 submissions.");
    }
    const shortAnswers = Object.keys(aiRubric).map((questionId) => ({
      questionId,
      prompt: questionById(questionId)?.prompt || questionId,
      answer: state.answers[questionId] || "",
      rubric: aiRubric[questionId],
    }));
    const grades = await window.KeaesApi.gradeEnglishLiteracyShortAnswers({
      testId,
      assignmentToken: state.profile.assignmentToken,
      answers: shortAnswers,
    });
    const missingGrade = Object.keys(aiRubric).find((questionId) => !grades?.[questionId] || typeof grades[questionId].score !== "number");
    if (missingGrade) {
      throw new Error("AI grading did not return a complete score. Please try submitting again.");
    }
    return grades;
  }

  function scoreDemoSubmission() {
    const sections = {};
    parts.filter((part) => part.questions.length).forEach((part) => {
      sections[part.id] = part.questions.map((question) => {
        const response = state.answers[question.id] || "";
        const accepted = answerKey[question.id] || [];
        const splitGrade = aiRubric[question.id] ? demoSplitGrade(question.id, response) : null;
        const score = splitGrade ? splitGrade.score : (accepted.some((answer) => normalizeAnswer(response) === normalizeAnswer(answer)) ? 1 : 0);
        return {
          part: part.label,
          prompt: question.prompt,
          response: response || "No answer",
          correctAnswer: accepted[0] || aiRubric[question.id] || "",
          correct: score >= 1,
          score,
          possible: 1,
          gradingDetails: splitGrade || {},
        };
      });
    });
    const all = Object.values(sections).flat();
    return {
      total: all.reduce((sum, answer) => sum + Number(answer.score || 0), 0),
      possible: all.length,
      sections,
    };
  }

  function demoSplitGrade(questionId, response) {
    if (!response) {
      return {
        questionId,
        contentCorrect: false,
        writingCorrect: false,
        contentScore: 0,
        writingScore: 0,
        score: 0,
        feedback: "No answer.",
      };
    }
    const contentCorrect = hasLikelyContent(questionId, response);
    const writingCorrect = hasClearWriting(response);
    const contentScore = contentCorrect ? 0.5 : 0;
    const writingScore = writingCorrect ? 0.5 : 0;
    return {
      questionId,
      contentCorrect,
      writingCorrect,
      contentScore,
      writingScore,
      score: contentScore + writingScore,
      feedback: "Local preview split score.",
    };
  }

  function hasLikelyContent(questionId, response) {
    const normalized = normalizeAnswer(response);
    const rules = {
      "el5-q26": ["clumsy", "land", "water", "graceful", "swim"],
      "el5-q27": ["dominance", "fight", "battle", "harem", "female"],
      "el5-q28": ["birth", "breed", "molt", "skin", "fur"],
      "el5-q29": ["dive", "hunt", "squid", "octopus", "fish"],
      "el5-q30": ["not", "law", "legal", "protect", "comeback", "population"],
    };
    return (rules[questionId] || []).some((word) => normalized.includes(normalizeAnswer(word)));
  }

  function hasClearWriting(response) {
    return normalizeAnswer(response).split(/\s+/).filter(Boolean).length >= 2;
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
      button.textContent = state.submitted ? "Submitted" : state.submissionPending ? "Grading..." : "Submit test";
    });
  }

  function renderScoreSummary(score) {
    if (!score) return "";
    const sections = Object.values(score.sections || {});
    const corrections = sections.flat().map((answer) => `
      <div class="correction-row ${answer.correct ? "" : "is-wrong"}">
        <strong>${escapeHtml(answer.part)}: ${escapeHtml(answer.prompt)}</strong>
        <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)} · Score: ${formatScore(answer.score ?? (answer.correct ? 1 : 0))}/${formatScore(answer.possible ?? 1)}</span>
        ${renderGradingDetails(answer.gradingDetails)}
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

  function allQuestions() {
    return parts.flatMap((part) => part.questions);
  }

  function questionById(id) {
    return allQuestions().find((question) => question.id === id);
  }

  function renderGradingDetails(details) {
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
