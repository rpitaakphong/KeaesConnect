(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "english-literacy-3";
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
    "In May, 1886, Coca Cola was invented by Doctor John Pemberton, a pharmacist from Atlanta, Georgia. John Pemberton concocted the Coca Cola formula in a three-legged brass kettle in his backyard. The name was a suggestion given by John Pemberton's bookkeeper Frank Robinson. Being a bookkeeper, Frank Robinson also had excellent penmanship. It was he who first scripted \"Coca Cola\" into the flowing letters which has become the famous logo of today.",
    "The soft drink was first sold to the public at the soda fountain in Jacob's Pharmacy in Atlanta on May 8, 1886. About nine servings of the soft drink were sold each day. Sales for that first year added up to a total of about $50. The funny thing was that it cost John Pemberton over $70 in expenses, so the first year of sales were a loss. Until 1905, the soft drink, marketed as a tonic, contained extracts of cocaine as well as the caffeine-rich kola nut.",
  ].join("\n\n");

  const answerKey = {
    "el3-q1": ["comfortable"],
    "el3-q2": ["wet"],
    "el3-q3": ["annoy"],
    "el3-q4": ["near"],
    "el3-q5": ["forecast"],
    "el3-q6": ["adjective"],
    "el3-q7": ["adverb"],
    "el3-q8": ["adjective"],
    "el3-q9": ["adjective"],
    "el3-q10": ["adverb"],
    "el3-q11": ["mice"],
    "el3-q12": ["houses"],
    "el3-q13": ["fairies"],
    "el3-q14": ["shelves"],
    "el3-q15": ["sheep"],
    "el3-q16": ["the boys", "boys"],
    "el3-q17": ["ravi"],
    "el3-q18": ["the eiffel tower", "eiffel tower"],
    "el3-q19": ["he"],
    "el3-q20": ["the parrot", "parrot"],
    "el3-q21": ["false"],
    "el3-q22": ["true"],
    "el3-q23": ["false"],
    "el3-q24": ["false"],
    "el3-q25": ["false"],
    "el3-q26": ["john pemberton", "doctor john pemberton", "dr john pemberton", "dr. john pemberton"],
    "el3-q27": ["frank robinson"],
    "el3-q28": [
      "at the soda fountain in jacob s pharmacy in atlanta",
      "at the soda fountain in jacob's pharmacy in atlanta",
      "soda fountain in jacob s pharmacy",
      "soda fountain in jacob's pharmacy",
      "jacob s pharmacy",
      "jacob's pharmacy",
    ],
    "el3-q29": ["may 8 1886", "may 8, 1886", "may eighth 1886"],
    "el3-q30": ["50", "$50", "about 50", "about $50", "50 dollars", "about 50 dollars"],
  };

  const aiRubric = {
    "el3-q26": "Correct if the answer identifies John Pemberton as the inventor.",
    "el3-q27": "Correct if the answer identifies Frank Robinson as the person who made the famous logo.",
    "el3-q28": "Correct if the answer says Coca Cola was first sold at the soda fountain in Jacob's Pharmacy, optionally in Atlanta.",
    "el3-q29": "Correct if the answer says May 8, 1886.",
    "el3-q30": "Correct if the answer says about $50.",
  };

  const parts = [
    {
      id: "part1",
      label: "Part I",
      title: "Choose the word with a similar meaning.",
      hint: "Choose one answer for the underlined word in each sentence.",
      questions: [
        choice("el3-q1", "1. I like this song. It makes me at ease.", ["courageous", "comfortable", "capable"]),
        choice("el3-q2", "2. The ground is moist this morning.", ["wet", "warm", "weird"]),
        choice("el3-q3", "3. The bullies at school irritate me.", ["envy", "agree", "annoy"]),
        choice("el3-q4", "4. The school is close to our house.", ["few", "gone", "near"]),
        choice("el3-q5", "5. We can predict the weather.", ["forget", "forecast", "form"]),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Identify the underlined word.",
      hint: "Choose adjective or adverb.",
      questions: [
        choice("el3-q6", "6. Charlotte made a delicious salad.", ["adjective", "adverb"]),
        choice("el3-q7", "7. Amy speaks softly.", ["adjective", "adverb"]),
        choice("el3-q8", "8. The grumpy lady never smiles.", ["adjective", "adverb"]),
        choice("el3-q9", "9. Jessie narrated a funny story.", ["adjective", "adverb"]),
        choice("el3-q10", "10. Joe left the party happily.", ["adjective", "adverb"]),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Write the plural form of each noun.",
      hint: "Type the plural noun.",
      questions: [
        textAnswer("el3-q11", "11. Mouse", "Plural form"),
        textAnswer("el3-q12", "12. House", "Plural form"),
        textAnswer("el3-q13", "13. Fairy", "Plural form"),
        textAnswer("el3-q14", "14. Shelf", "Plural form"),
        textAnswer("el3-q15", "15. Sheep", "Plural form"),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Choose the subject in each sentence.",
      hint: "Choose the phrase that is the subject.",
      questions: [
        choice("el3-q16", "16. The boys are playing in the park.", ["the boys", "are playing", "the park"]),
        choice("el3-q17", "17. Ravi is drinking juice.", ["Ravi", "is drinking", "juice"]),
        choice("el3-q18", "18. The Eiffel Tower is amazing.", ["the Eiffel Tower", "is", "amazing"]),
        choice("el3-q19", "19. He is a clever but lazy boy.", ["he", "clever", "lazy boy"]),
        choice("el3-q20", "20. The parrot was sitting on the branch of the tree.", ["the parrot", "the branch", "the tree"]),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Read the story and answer the questions.",
      hint: "Choose true or false, then answer the short questions.",
      storyTitle: "Coca Cola",
      story: storyText,
      storyImage: "assets/cola-bottle.png",
      questions: [
        choice("el3-q21", "21. Coca Cola was invented in June, 1886.", ["true", "false"]),
        choice("el3-q22", "22. Dr. John Pemberton is a pharmacist.", ["true", "false"]),
        choice("el3-q23", "23. Dr. Pemberton used a four-legged brass kettle to make the soft drink.", ["true", "false"]),
        choice("el3-q24", "24. Frank Robinson is a librarian.", ["true", "false"]),
        choice("el3-q25", "25. Mr. Robinson has bad penmanship.", ["true", "false"]),
        shortAnswer("el3-q26", "26. Who invented Coca Cola?"),
        shortAnswer("el3-q27", "27. Who made the famous logo of Coca Cola?"),
        shortAnswer("el3-q28", "28. Where was Coca Cola first sold to the public?"),
        shortAnswer("el3-q29", "29. When was Coca Cola first sold to the public?"),
        shortAnswer("el3-q30", "30. How much was the sales for the first year of Coca Cola?"),
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
      throw new Error("AI grading is not available. Ask staff to deploy the grading function before accepting Level 3 submissions.");
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
      "el3-q26": ["john", "pemberton"],
      "el3-q27": ["frank", "robinson"],
      "el3-q28": ["soda", "fountain", "jacob", "pharmacy", "atlanta"],
      "el3-q29": ["may", "8", "1886"],
      "el3-q30": ["50"],
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
