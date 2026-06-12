(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "english-literacy-2";
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

  const storyText = [
    "Rima was a beggar girl. One day a lady gave her some saplings and seeds of flower plants instead of alms and said, 'Plant these saplings and seeds. You will gain a hundred times more from them.'",
    "Rima did not understand anything but decided to do as the lady had said. She went to her small hut and dug the ground by its side. Then she planted the saplings and sowed the seeds. She watered them well and a few weeks later, flowers bloomed around her hut. One day a few women came to buy the flowers, Rima had grown. So from that day Rima plucked the flowers and sold them door to door. Sometimes, she sold them in the market and on the roads. She was earning her living well and had stopped begging. Soon some people became regular buyers of her flowers. She saved enough money to open a small flower shop in the market and people went to see Rima's flower collection.",
    "Rima thanked the lady who had led her to get green gold.",
  ].join("\n\n");

  const aiRubric = {
    "el2-q21": "Correct if the answer says the lady gave Rima saplings and seeds of flower plants.",
    "el2-q22": "Correct if the answer says Rima planted the saplings/seeds and/or sowed/watered them.",
    "el2-q23": "Correct if the answer says she saved or earned money from selling flowers.",
    "el2-q24": "Correct if the answer says the plants or flowers helped her earn money or improve her life.",
  };

  const parts = [
    {
      id: "partA",
      label: "Part A",
      title: "Circle the words that best complete each sentence.",
      hint: "Choose one answer for each sentence.",
      questions: [
        choice("el2-q1", "1. I (eight / ate) a lot for breakfast today.", ["eight", "ate"]),
        choice("el2-q2", "2. Mr. Smith is an (I / eye) doctor.", ["I", "eye"]),
        choice("el2-q3", "3. Vic is spending his (week / weak) in the province.", ["week", "weak"]),
        choice("el2-q4", "4. I can't (wait / weight) to see you.", ["wait", "weight"]),
        choice("el2-q5", "5. My mom bought (too / two) shirts for me.", ["too", "two"]),
      ],
    },
    {
      id: "part2",
      label: "Part 2",
      title: "Write the plural form by adding -s or -es.",
      hint: "Type the plural form for each picture.",
      questions: [
        imageText("el2-q6", "6. Truck", "assets/q6-trucks.png", "Trucks"),
        imageText("el2-q7", "7. Box", "assets/q7-boxes.png", "Boxes"),
        imageText("el2-q8", "8. Tomato", "assets/q8-tomatoes.png", "Tomatoes"),
        imageText("el2-q9", "9. Key", "assets/q9-keys.png", "Keys"),
      ],
    },
    {
      id: "part3",
      label: "Part 3",
      title: "Divide the word into syllables.",
      hint: "Use a slash between syllables, for example: rab/bit.",
      questions: [
        textAnswer("el2-q10", "10. Effect", "Use / between syllables"),
        textAnswer("el2-q11", "11. Faster", "Use / between syllables"),
        textAnswer("el2-q12", "12. Happens", "Use / between syllables"),
        textAnswer("el2-q13", "13. Beautiful", "Use / between syllables"),
        textAnswer("el2-q14", "14. Light", "Use / between syllables"),
        textAnswer("el2-q15", "15. Elephant", "Use / between syllables"),
      ],
    },
    {
      id: "part4",
      label: "Part 4",
      title: "Underline the correct pronoun.",
      hint: "Choose the correct pronoun.",
      questions: [
        choice("el2-q16", "16. The boys are over there. Can you see (they / them)?", ["they", "them"]),
        choice("el2-q17", "17. Listen to (him / he)!", ["him", "he"]),
        choice("el2-q18", "18. Look at (she / her). She's very pretty.", ["she", "her"]),
        choice("el2-q19", "19. Can you tell (we / us) your name?", ["we", "us"]),
        choice("el2-q20", "20. Please help (I / me).", ["I", "me"]),
      ],
    },
    {
      id: "part5",
      label: "Part 5",
      title: "Read the story and answer the questions.",
      hint: "Write a short answer. These answers are graded by AI when you submit.",
      storyTitle: "Green Gold",
      story: storyText,
      questions: [
        shortAnswer("el2-q21", "21. What did the lady give to Rima?"),
        shortAnswer("el2-q22", "22. What did she do with the seeds?"),
        shortAnswer("el2-q23", "23. How did Rima put up a small flower shop?"),
        shortAnswer("el2-q24", "24. Why did she call it green gold?"),
      ],
    },
    {
      id: "part6",
      label: "Part 6",
      title: "Number the sentences 1-6 to put them in order.",
      hint: "Type the correct order number for each sentence.",
      questions: [
        numberAnswer("el2-q25", "25. She saved enough money to open a small flower shop in the market."),
        numberAnswer("el2-q26", "26. She thanked the lady who gave her the green gold."),
        numberAnswer("el2-q27", "27. She watered the plants."),
        numberAnswer("el2-q28", "28. Rima went to her small hut and dug the ground then she planted seeds."),
        numberAnswer("el2-q29", "29. A lady gave her seeds and told her to plant it."),
        numberAnswer("el2-q30", "30. Flowers bloomed and people bought flowers."),
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

  function textAnswer(id, prompt, placeholder) {
    return { id, type: "textAnswer", prompt, placeholder };
  }

  function shortAnswer(id, prompt) {
    return { id, type: "shortAnswer", prompt };
  }

  function numberAnswer(id, prompt) {
    return { id, type: "numberAnswer", prompt };
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
        <div class="question-list ${part.id === "part2" ? "picture-grid" : ""} ${part.id === "part6" ? "order-list" : ""}">
          ${part.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `;
  }

  function renderStory(part) {
    return `
      <article class="story-panel">
        ${part.storyTitle ? `<h3>${escapeHtml(part.storyTitle)}</h3>` : ""}
        ${part.story.split("\n\n").map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
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
    if (question.type === "imageText") {
      return `
        <label class="question-card picture-card">
          <span class="question-number">${escapeHtml(question.prompt)}</span>
          <img src="${escapeHtml(question.image)}" alt="${escapeHtml(question.alt)}">
          <input data-answer="${question.id}" autocomplete="off" aria-label="${escapeHtml(question.prompt)} ${escapeHtml(question.alt)}">
        </label>
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
    if (question.type === "numberAnswer") {
      return `
        <label class="question-card text-card order-card">
          <span>${escapeHtml(question.prompt)}</span>
          <input data-answer="${question.id}" inputmode="numeric" pattern="[1-6]" maxlength="1" autocomplete="off" aria-label="${escapeHtml(question.prompt)}">
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
      throw new Error("AI grading is not available. Ask staff to deploy the grading function before accepting Level 2 submissions.");
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
    const key = {
      "el2-q1": "ate",
      "el2-q2": "eye",
      "el2-q3": "week",
      "el2-q4": "wait",
      "el2-q5": "two",
      "el2-q6": "trucks",
      "el2-q7": "boxes",
      "el2-q8": "tomatoes",
      "el2-q9": "keys",
      "el2-q10": "ef/fect",
      "el2-q11": "fast/er",
      "el2-q12": "hap/pens",
      "el2-q13": "beau/ti/ful",
      "el2-q14": "light",
      "el2-q15": "el/e/phant",
      "el2-q16": "them",
      "el2-q17": "him",
      "el2-q18": "her",
      "el2-q19": "us",
      "el2-q20": "me",
      "el2-q25": "5",
      "el2-q26": "6",
      "el2-q27": "3",
      "el2-q28": "2",
      "el2-q29": "1",
      "el2-q30": "4",
    };
    const sections = {};
    parts.filter((part) => part.questions.length).forEach((part) => {
      sections[part.id] = part.questions.map((question) => {
        const response = state.answers[question.id] || "";
        const splitGrade = aiRubric[question.id] ? demoSplitGrade(question.id, response) : null;
        const correctAnswer = key[question.id] || aiRubric[question.id];
        const score = splitGrade ? splitGrade.score : (normalizeAnswer(response) === normalizeAnswer(correctAnswer) ? 1 : 0);
        return {
          part: part.label,
          prompt: question.prompt,
          response: response || "No answer",
          correctAnswer,
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
      "el2-q21": ["sapling", "seed", "plant", "flower"],
      "el2-q22": ["plant", "sow", "water", "dug"],
      "el2-q23": ["save", "earn", "money", "sold", "sell", "flower"],
      "el2-q24": ["money", "earn", "life", "flower", "plant", "green gold"],
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

  function allQuestions() {
    return parts.flatMap((part) => part.questions);
  }

  function questionById(id) {
    return allQuestions().find((question) => question.id === id);
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
