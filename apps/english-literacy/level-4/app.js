(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "english-literacy-4";
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
    "Dolphins are very intelligent and they seem to be well loved by humans. This aquatic mammal has been able to fascinate us in a variety of ways. They are curious, form strong bonds within their pod, and they have been known to help humans in a variety of circumstances including rescues and with fishing.",
    "There are 36 different species of dolphins that have been recognized. 32 of them are marine dolphins which are those that we are the most aware of and 4 of them are river dolphins. It can be very interesting to look at each of these species uniquely versus dolphins as a whole.",
    "They are very entertaining due to the leaps that they make out of the water. Some of them leap up to 30 feet in the air as they do so. They have to come to the surface at different intervals to get air. This can be from 20 seconds to 30 minutes between when they get air. The body of the dolphin is grayish blue and the skin is very sensitive to human touch and to other elements that could be in the water.",
    "The future is at risk for the various species of dolphins though due to habitat destruction, problems finding food, pollutants in the water, and even injuries or death due to getting tangled up in fishing nets or hitting boats in the water. There are conservation efforts in place out there to help protect them so that they can have a very good future. The average lifespan for a dolphin in the wild is 17 years. However, some have been documented to live to the age of 50!",
  ].join("\n\n");

  const answerKey = {
    "el4-q1": ["tail"],
    "el4-q2": ["write"],
    "el4-q3": ["whole"],
    "el4-q4": ["cast"],
    "el4-q5": ["past"],
    "el4-q6": ["wrap"],
    "el4-q7": ["pleasant"],
    "el4-q8": ["present"],
    "el4-q9": ["spread"],
    "el4-q10": ["scent"],
    "el4-q11": ["opinion"],
    "el4-q12": ["fact"],
    "el4-q13": ["fact"],
    "el4-q14": ["fact"],
    "el4-q15": ["opinion"],
    "el4-q16": ["did"],
    "el4-q17": ["came back / was sleeping", "came back was sleeping"],
    "el4-q18": ["spent"],
    "el4-q19": ["was painting / dropped by", "was painting dropped by"],
    "el4-q20": ["bought / was", "bought was"],
    "el4-q21": ["true"],
    "el4-q22": ["false"],
    "el4-q23": ["true"],
    "el4-q24": ["true"],
    "el4-q25": ["false"],
  };

  const aiRubric = {
    "el4-q26": "Correct if the answer says 32 species are marine dolphins.",
    "el4-q27": "Correct if the answer says the dolphin's body is grayish blue.",
    "el4-q28": "Correct if the answer says dolphins can leap up to 30 feet in the air.",
    "el4-q29": "Correct if the answer says the average lifespan in the wild is 17 years.",
    "el4-q30": "Correct if the answer says dolphins are at risk due to habitat destruction, problems finding food, pollutants, fishing nets, boats, injuries, or death.",
  };

  const parts = [
    {
      id: "part1",
      label: "Part I",
      title: "Choose the homophone that completes each sentence.",
      hint: "Choose one answer for each sentence.",
      questions: [
        choice("el4-q1", "1. When Sami pulled the bird's (tail / tale), it flapped its wings.", ["tail", "tale"]),
        choice("el4-q2", "2. Please (right / write) down the following information.", ["right", "write"]),
        choice("el4-q3", "3. The (whole / hole) family will be attending the reunion.", ["whole", "hole"]),
        choice("el4-q4", "4. We must try our best to (caste / cast) away all our prejudices.", ["caste", "cast"]),
        choice("el4-q5", "5. The time is half (passed / past) ten.", ["passed", "past"]),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Choose the best word from the box.",
      hint: "Type the word that best completes each sentence.",
      wordBank: ["pleasant", "scent", "present", "spread", "trouble", "wrap"],
      questions: [
        textAnswer("el4-q6", "6. She can ___ the gift nicely.", "Word from the box"),
        textAnswer("el4-q7", "7. The little girl has a ___ attitude.", "Word from the box"),
        textAnswer("el4-q8", "8. He will give me a ___ on my birthday.", "Word from the box"),
        textAnswer("el4-q9", "9. I love to ___ butter on my bread.", "Word from the box"),
        textAnswer("el4-q10", "10. This perfume has a good ___.", "Word from the box"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Identify fact or opinion.",
      hint: "Choose fact or opinion.",
      questions: [
        choice("el4-q11", "11. Spring is the most beautiful season of all.", ["fact", "opinion"]),
        choice("el4-q12", "12. Your birthday comes only one day a year.", ["fact", "opinion"]),
        choice("el4-q13", "13. April is a month with 30 days.", ["fact", "opinion"]),
        choice("el4-q14", "14. Some families eat turkey on Thanksgiving.", ["fact", "opinion"]),
        choice("el4-q15", "15. Everyone should make Valentine's Day cards.", ["fact", "opinion"]),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Complete each sentence with past simple or past continuous.",
      hint: "Use / between two answers when a sentence has two blanks.",
      questions: [
        textAnswer("el4-q16", "16. We ___ the research together last time. (do)", "Verb form"),
        textAnswer("el4-q17", "17. When he ___ from work, his wife ___. (come back / sleep)", "answer / answer"),
        textAnswer("el4-q18", "18. Andrew ___ his last weekend with his parents on the farm. (spend)", "Verb form"),
        textAnswer("el4-q19", "19. Tom ___ the fence in the garden when his friend ___. (paint / drop by)", "answer / answer"),
        textAnswer("el4-q20", "20. My mother ___ a lot of sweets when she ___ in the supermarket. (buy / be)", "answer / answer"),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Read the passage and answer the questions.",
      hint: "Choose true or false, then answer the short questions.",
      storyTitle: "Dolphins",
      story: storyText,
      storyImage: "assets/dolphin.svg",
      questions: [
        choice("el4-q21", "21. Dolphins are aquatic mammals.", ["true", "false"]),
        choice("el4-q22", "22. There are 30 different species of dolphins that have been recognized.", ["true", "false"]),
        choice("el4-q23", "23. Dolphins are intelligent and curious.", ["true", "false"]),
        choice("el4-q24", "24. Four species of dolphins live in the river.", ["true", "false"]),
        choice("el4-q25", "25. The skin of the dolphin is not sensitive to human touch.", ["true", "false"]),
        shortAnswer("el4-q26", "26. How many species of dolphins are marine dolphins?"),
        shortAnswer("el4-q27", "27. What is the color of the dolphin's body?"),
        shortAnswer("el4-q28", "28. How high can a dolphin leap in the air?"),
        shortAnswer("el4-q29", "29. What is the average life span for a dolphin in the wild?"),
        shortAnswer("el4-q30", "30. Why are the dolphins at risk?"),
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
        ${part.wordBank ? renderWordBank(part.wordBank) : ""}
        ${part.story ? renderStory(part) : ""}
        <div class="question-list">
          ${part.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `;
  }

  function renderWordBank(words) {
    return `
      <div class="word-bank">
        ${words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}
      </div>
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
      throw new Error("AI grading is not available. Ask staff to deploy the grading function before accepting Level 4 submissions.");
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
      "el4-q26": ["32", "thirty two", "marine"],
      "el4-q27": ["grayish", "greyish", "blue"],
      "el4-q28": ["30", "thirty", "feet"],
      "el4-q29": ["17", "seventeen", "years"],
      "el4-q30": ["habitat", "food", "pollutant", "water", "net", "boat", "injury", "death"],
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
