(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || "math-olympiad-1";
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

  const parts = [
    {
      id: "part1",
      label: "Part I",
      title: "Numbers, addition, subtraction, and shapes",
      hint: "Write or choose the answers shown by each picture.",
      questions: [
        q("mo1-q1", 1, "What are the missing numbers?", "numberPath"),
        q("mo1-q2", 1, "Complete the number bond.", "numberBond"),
        q("mo1-q3", 2, "There are 5 oranges. Add 3 more oranges.", "oranges"),
        q("mo1-q4", 2, "Fill in the blanks.", "cakes"),
        q("mo1-q5", 2, "Colour the shapes that match the name on the left.", "shapeSelect"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Position, word problems, measuring, and comparing",
      hint: "Use the diagrams to answer each question.",
      questions: [
        q("mo1-q6", 2, "Fill in the blanks.", "triangles"),
        q("mo1-q7", 2, "Siti has 14 beads. She buys 2 more beads. How many beads does she have now?", "beads"),
        q("mo1-q8", 2, "Compare the lengths of the pencils.", "pencils"),
        q("mo1-q9", 2, "Fill in the blanks.", "moreLess"),
        q("mo1-q10", 3, "The graph shows the books on Meiling's bookshelf.", "pictograph"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Subtraction, groups, sharing, time, and subtraction strategies",
      hint: "Answer each blank exactly.",
      questions: [
        q("mo1-q11", 2, "Subtract.", "baseTen"),
        q("mo1-q12", 2, "Fill in the blanks.", "triangleGroups"),
        q("mo1-q13", 2, "Share 6 pears equally among 2 children.", "pears"),
        q("mo1-q14", 2, "Uncle Tam and family came to visit at what time?", "clock"),
        q("mo1-q15", 3, "Subtract.", "subtractionPairs"),
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

  const answerKeys = {
    "mo1-q1": key("5, 7, 9", [part("a", ["5"], 0.34), part("b", ["7"], 0.33), part("c", ["9"], 0.33)]),
    "mo1-q2": key("3, 1", [part("top", ["3"], 0.5), part("bottom", ["1"], 0.5)]),
    "mo1-q3": key("8, 8", [part("equation", ["8"], 1), part("total", ["8"], 1)]),
    "mo1-q4": key("3, 3", [part("equation", ["3"], 1), part("left", ["3"], 1)]),
    "mo1-q5": key("upright square and tilted square", [setPart("selected", ["upright-square", "tilted-square"], 2)]),
    "mo1-q6": key("E, D", [part("a", ["E"], 1), part("b", ["D"], 1)]),
    "mo1-q7": key("14 + 2 = 16; 16 beads", [part("first", ["14"], 0.4), part("operator", ["+"], 0.4), part("second", ["2"], 0.4), part("result", ["16"], 0.4), part("final", ["16"], 0.4)]),
    "mo1-q8": key("B, A", [part("a", ["B"], 1), part("b", ["A"], 1)]),
    "mo1-q9": key("6, 6", [part("a", ["6"], 1), part("b", ["6"], 1)]),
    "mo1-q10": key("7; English Literature and Bedtime story; 3; 17", [
      part("a", ["7"], 0.75),
      part("b1", ["English Literature", "English"], 0.38),
      part("b2", ["Bedtime story", "Bedtime"], 0.37),
      part("c", ["3"], 0.75),
      part("d", ["17"], 0.75),
    ]),
    "mo1-q11": key("4, 14, 24", [part("a", ["4"], 0.67), part("b", ["14"], 0.67), part("c", ["24"], 0.66)]),
    "mo1-q12": key("2, 8", [part("groups", ["2"], 1), part("total", ["8"], 1)]),
    "mo1-q13": key("3", [part("each", ["3"], 2)]),
    "mo1-q14": key("10:30", [part("time", ["10:30", "10.30", "10 30"], 2, "time")]),
    "mo1-q15": key("14, 14, 46, 46", [part("a1", ["14"], 0.75), part("a2", ["14"], 0.75), part("b1", ["46"], 0.75), part("b2", ["46"], 0.75)]),
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!loadProfile()) return;
    loadAnswers();
    buildShell();
    bindEvents();
    renderAll();
  });

  function q(id, marks, prompt, type) {
    return { id, marks, prompt, type };
  }

  function key(display, partsList) {
    return { display, parts: partsList };
  }

  function part(id, accepted, points, normalizer = "text") {
    return { id, accepted, points, normalizer };
  }

  function setPart(id, accepted, points) {
    return { id, accepted, points, normalizer: "set" };
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
    return ["fullName", "nickname", "dateOfBirth", "subject", "level", "testDate", "assignmentToken"].every((field) => profile[field]) ? profile : null;
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
    document.querySelector("[data-part-nav]").innerHTML = parts.map((partItem) => `
      <button class="part-tab" type="button" data-part-button="${partItem.id}">${escapeHtml(partItem.label)}</button>
    `).join("");
    document.querySelector("[data-test-panel]").innerHTML = parts.map(renderPart).join("");
  }

  function renderPart(partItem) {
    if (partItem.id === "review") {
      return `
        <section class="part" id="${partItem.id}" data-part>
          <div class="part-heading">
            <div>
              <p class="eyebrow">${escapeHtml(partItem.label)}</p>
              <h2>${escapeHtml(partItem.title)}</h2>
            </div>
            <p class="hint">${escapeHtml(partItem.hint)}</p>
          </div>
          <div class="student-summary" data-student-summary></div>
          <div class="review-grid" data-review-grid></div>
          <div class="result-card" hidden data-result-card></div>
        </section>
      `;
    }
    return `
      <section class="part" id="${partItem.id}" data-part>
        <div class="part-heading">
          <div>
            <p class="eyebrow">${escapeHtml(partItem.label)} - ${partItem.questions.length} questions</p>
            <h2>${escapeHtml(partItem.title)}</h2>
          </div>
          <p class="hint">${escapeHtml(partItem.hint)}</p>
        </div>
        <div class="math-question-list">
          ${partItem.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `;
  }

  function renderQuestion(question) {
    return `
      <article class="question-card math-question" data-question-card="${question.id}">
        <div class="math-question-head">
          <div>
            <p class="eyebrow">Question ${questionNumber(question.id)}</p>
            <h3>${escapeHtml(question.prompt)}</h3>
          </div>
          <span class="mark-pill">${question.marks} ${question.marks === 1 ? "mark" : "marks"}</span>
        </div>
        ${renderQuestionBody(question)}
      </article>
    `;
  }

  function renderQuestionBody(question) {
    const renderers = {
      numberPath: renderNumberPath,
      numberBond: renderNumberBond,
      oranges: renderOranges,
      cakes: renderCakes,
      shapeSelect: renderShapeSelect,
      triangles: renderTriangles,
      beads: renderBeads,
      pencils: renderPencils,
      moreLess: renderMoreLess,
      pictograph: renderPictograph,
      baseTen: renderBaseTen,
      triangleGroups: renderTriangleGroups,
      pears: renderPears,
      clock: renderClockQuestion,
      subtractionPairs: renderSubtractionPairs,
    };
    return renderers[question.type](question);
  }

  function renderNumberPath(question) {
    return `
      <div class="number-path" aria-label="Number path 4 blank 6 blank 8 blank">
        ${numberBox("4")}
        ${connector()}
        ${boxInput(question.id, "a", "Missing number after 4")}
        ${connector()}
        ${numberBox("6")}
        ${connector()}
        ${boxInput(question.id, "b", "Missing number after 6")}
        ${connector()}
        ${numberBox("8")}
        ${connector()}
        ${boxInput(question.id, "c", "Missing number after 8")}
      </div>
    `;
  }

  function renderNumberBond(question) {
    return `
      <div class="math-visual-row">
        ${notebookScene()}
        <div class="number-bond" aria-label="Number bond showing 4 split into two missing parts">
          <div class="bond-box fixed">4</div>
          <div class="bond-lines" aria-hidden="true"></div>
          ${boxInput(question.id, "top", "Top number bond answer", "bond-answer top")}
          ${boxInput(question.id, "bottom", "Bottom number bond answer", "bond-answer bottom")}
        </div>
      </div>
    `;
  }

  function renderOranges(question) {
    return `
      <div class="math-visual-row">
        <div class="word-work">
          <p>There are 5 oranges.</p>
          <p>Add 3 more oranges.</p>
          <p class="inline-equation">5 + 3 = ${lineInput(question.id, "equation", "5 plus 3 equals")}</p>
          <p class="inline-equation">There are ${lineInput(question.id, "total", "oranges altogether", "answer in words")} oranges altogether.</p>
        </div>
        ${orangePlate()}
      </div>
    `;
  }

  function renderCakes(question) {
    return `
      <div class="math-visual-row">
        <div class="word-work">
          <p>There are 5 cakes.</p>
          <p>2 cakes are burnt.</p>
          <p class="inline-equation">5 - 2 = ${lineInput(question.id, "equation", "5 minus 2 equals")}</p>
          <p class="inline-equation">There are ${lineInput(question.id, "left", "cakes left", "answer in words")} cakes left.</p>
        </div>
        ${cakeScene()}
      </div>
    `;
  }

  function renderShapeSelect(question) {
    return `
      <div class="shape-select">
        <div class="shape-label">Square</div>
        <div class="shape-options">
          ${shapeOption(question.id, "triangle", triangleSvg(), "Triangle")}
          ${shapeOption(question.id, "upright-square", squareSvg(), "Square")}
          ${shapeOption(question.id, "rectangle", rectangleSvg(), "Rectangle")}
          ${shapeOption(question.id, "tilted-square", tiltedSquareSvg(), "Tilted square")}
          ${shapeOption(question.id, "circle", circleSvg(), "Circle")}
          ${shapeOption(question.id, "upside-down-triangle", upsideDownTriangleSvg(), "Upside-down triangle")}
        </div>
      </div>
    `;
  }

  function renderTriangles(question) {
    return `
      <div class="triangle-row" aria-label="Triangles labelled A B C D E F">
        ${["A", "B", "C", "D", "E", "F"].map((letter) => `<div class="letter-triangle"><span>${letter}</span></div>`).join("")}
      </div>
      <div class="math-lines">
        <label>(a) Which triangle is 5th from the left? ${lineInput(question.id, "a", "5th from the left")}</label>
        <label>(b) Which triangle is 3rd from the right? ${lineInput(question.id, "b", "3rd from the right")}</label>
      </div>
    `;
  }

  function renderBeads(question) {
    return `
      <div class="math-visual-row is-stacked">
        ${beadScene()}
        <div class="equation-box-row">
          ${boxInput(question.id, "first", "First addend")}
          ${boxInput(question.id, "operator", "Operator", "operator-box")}
          ${boxInput(question.id, "second", "Second addend")}
          <span class="equals-sign">=</span>
          ${boxInput(question.id, "result", "Equation result")}
        </div>
        <p class="inline-equation">Siti has ${lineInput(question.id, "final", "beads now")} beads now.</p>
      </div>
    `;
  }

  function renderPencils(question) {
    return `
      ${pencilGrid()}
      <div class="math-lines">
        <label>(a) Pencil ${lineInput(question.id, "a", "longest pencil")} is the longest.</label>
        <label>(b) Pencil C is as long as Pencil ${lineInput(question.id, "b", "same length as pencil C")}.</label>
      </div>
    `;
  }

  function renderMoreLess(question) {
    return `
      <div class="math-lines">
        <label>(a) 1 more than 5 is ${lineInput(question.id, "a", "1 more than 5")}.</label>
        <label>(b) 1 less than 7 is ${lineInput(question.id, "b", "1 less than 7")}.</label>
      </div>
    `;
  }

  function renderPictograph(question) {
    return `
      ${bookGraph()}
      <p class="legend-row">Each ${bookIcon()} stands for 1 book.</p>
      <div class="math-lines pictograph-questions">
        <label>(a) There are ${lineInput(question.id, "a", "Chinese Literature books")} Chinese Literature books.</label>
        <label>(b) The number of ${lineInput(question.id, "b1", "first same book category")} books and ${lineInput(question.id, "b2", "second same book category")} books are the same.</label>
        <label>(c) There are ${lineInput(question.id, "c", "fewer Malay Literature books")} fewer Malay Literature books than Chinese Literature books.</label>
        <label>(d) There are ${lineInput(question.id, "d", "books altogether")} books altogether.</label>
      </div>
    `;
  }

  function renderBaseTen(question) {
    return `
      ${baseTenScene()}
      <div class="math-lines compact-lines">
        <label>6 - 2 = ${lineInput(question.id, "a", "6 minus 2")}</label>
        <label>16 - 2 = ${lineInput(question.id, "b", "16 minus 2")}</label>
        <label>26 - 2 = ${lineInput(question.id, "c", "26 minus 2")}</label>
      </div>
    `;
  }

  function renderTriangleGroups(question) {
    return `
      <div class="math-visual-row">
        <div class="math-lines">
          <label>There are ${lineInput(question.id, "groups", "groups of 4 triangles")} groups of 4 triangles.</label>
          <label>There are ${lineInput(question.id, "total", "triangles altogether")} triangles altogether.</label>
        </div>
        ${triangleFlags()}
      </div>
    `;
  }

  function renderPears(question) {
    return `
      <div class="pear-row">${Array.from({ length: 6 }, pearSvg).join("")}</div>
      <div class="math-lines">
        <p>How many pears does each child get?</p>
        <label>Each child gets ${lineInput(question.id, "each", "pears each child gets")} pears.</label>
      </div>
    `;
  }

  function renderClockQuestion(question) {
    return `
      <div class="math-visual-row">
        ${familyScene()}
        <div class="clock-work">
          ${clockSvg()}
          <label>Uncle Tam and family came to visit at ${lineInput(question.id, "time", "visit time")}.</label>
        </div>
      </div>
    `;
  }

  function renderSubtractionPairs(question) {
    return `
      <div class="math-lines subtraction-lines">
        <label>(a) 49 - 30 - 5 = ${lineInput(question.id, "a1", "49 minus 30 minus 5")}</label>
        <label class="indented">49 - 35 = ${lineInput(question.id, "a2", "49 minus 35")}</label>
        <label>(b) 69 - 20 - 3 = ${lineInput(question.id, "b1", "69 minus 20 minus 3")}</label>
        <label class="indented">69 - 23 = ${lineInput(question.id, "b2", "69 minus 23")}</label>
      </div>
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
    const questionId = input.dataset.answer;
    const partId = input.dataset.answerPart;
    state.answers[questionId] = normalizeQuestionAnswer(state.answers[questionId]);
    if (input.type === "checkbox") {
      const selected = new Set(state.answers[questionId].selected || []);
      if (input.checked) selected.add(input.value);
      else selected.delete(input.value);
      state.answers[questionId].selected = Array.from(selected);
    } else {
      state.answers[questionId][partId] = cleanText(input.value);
    }
    if (!hasAnswerValue(state.answers[questionId])) delete state.answers[questionId];
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
    const sections = {};
    parts.filter((partItem) => partItem.questions.length).forEach((partItem) => {
      sections[partItem.id] = partItem.questions.map((question) => {
        const answer = normalizeQuestionAnswer(state.answers[question.id]);
        const scored = scoreQuestion(question.id, answer);
        return {
          part: partItem.label,
          prompt: question.prompt,
          response: displayResponse(question.id, answer),
          correctAnswer: answerKeys[question.id].display,
          correct: scored.correct,
          score: scored.awarded,
          possible: scored.possible,
          gradingDetails: scored.details,
        };
      });
    });
    const all = Object.values(sections).flat();
    return {
      total: roundScore(all.reduce((sum, item) => sum + item.score, 0)),
      possible: roundScore(all.reduce((sum, item) => sum + item.possible, 0)),
      sections,
    };
  }

  function scoreQuestion(questionId, answer) {
    const keyData = answerKeys[questionId];
    const partScores = keyData.parts.map((partKey) => {
      const raw = answer[partKey.id] ?? "";
      const correct = partKey.normalizer === "set"
        ? sameSet(raw, partKey.accepted)
        : partKey.accepted.some((accepted) => normalizeByType(raw, partKey.normalizer) === normalizeByType(accepted, partKey.normalizer));
      return {
        id: partKey.id,
        score: correct ? partKey.points : 0,
        possible: partKey.points,
        correct,
      };
    });
    const awarded = roundScore(partScores.reduce((sum, item) => sum + item.score, 0));
    const possible = roundScore(partScores.reduce((sum, item) => sum + item.possible, 0));
    return {
      awarded,
      possible,
      correct: awarded >= possible,
      details: { parts: partScores },
    };
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
    document.querySelectorAll("[data-part]").forEach((partElement) => {
      partElement.classList.toggle("is-active", partElement.id === state.currentPart);
    });
    document.querySelectorAll("[data-part-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.partButton === state.currentPart);
    });
  }

  function renderInputs() {
    document.querySelectorAll("[data-answer]").forEach((input) => {
      const answer = normalizeQuestionAnswer(state.answers[input.dataset.answer]);
      if (input.type === "checkbox") {
        input.checked = (answer.selected || []).includes(input.value);
      } else {
        input.value = answer[input.dataset.answerPart] || "";
      }
      input.disabled = state.submitted || state.submissionPending;
    });
  }

  function renderProgress() {
    const answered = allQuestions().filter((question) => hasAnswerValue(state.answers[question.id])).length;
    document.querySelector("[data-progress-count]").textContent = answered;
  }

  function renderReview() {
    const grid = document.querySelector("[data-review-grid]");
    if (!grid) return;
    grid.innerHTML = parts.filter((partItem) => partItem.questions.length).map((partItem) => {
      const count = partItem.questions.filter((question) => hasAnswerValue(state.answers[question.id])).length;
      return `
        <article class="review-card">
          <strong>${escapeHtml(partItem.label)}</strong>
          <span>${count}/${partItem.questions.length} answered</span>
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
        <span>Student: ${escapeHtml(answer.response)} · Correct: ${escapeHtml(answer.correctAnswer)} · Score: ${formatScore(answer.score ?? 0)}/${formatScore(answer.possible ?? 1)}</span>
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

  function boxInput(questionId, partId, label, className = "", placeholder = "") {
    const placeholderAttribute = inputPlaceholderAttribute(questionId, partId, placeholder);
    return `<input class="math-box-input ${className}" data-answer="${questionId}" data-answer-part="${partId}" autocomplete="off" inputmode="text" aria-label="${escapeHtml(label)}"${placeholderAttribute}>`;
  }

  function lineInput(questionId, partId, label, placeholder = "") {
    const placeholderAttribute = inputPlaceholderAttribute(questionId, partId, placeholder);
    return `<input class="math-line-input" data-answer="${questionId}" data-answer-part="${partId}" autocomplete="off" inputmode="text" aria-label="${escapeHtml(label)}"${placeholderAttribute}>`;
  }

  function inputPlaceholderAttribute(questionId, partId, explicitPlaceholder = "") {
    const placeholder = explicitPlaceholder || answerPlaceholder(questionId, partId);
    return placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : "";
  }

  function answerPlaceholder(questionId, partId) {
    const answerPart = answerKeys[questionId]?.parts?.find((item) => item.id === partId);
    const accepted = answerPart?.accepted || [];
    if (!answerPart || !accepted.length) return "";
    if (answerPart.normalizer === "time") return "answer in time";
    if (answerPart.normalizer === "set") return "";
    if (accepted.every((value) => /^[+\-*/÷x×=]$/.test(String(value).trim()))) return "answer in symbol";
    if (accepted.every((value) => /^-?\d+(?:[.:]\d+)?$/.test(String(value).trim()))) return "answer in number";
    if (accepted.every((value) => /^[A-Z]$/i.test(String(value).trim()))) return "answer in letter";
    return "answer in words";
  }

  function numberBox(value) {
    return `<span class="number-box">${escapeHtml(value)}</span>`;
  }

  function connector() {
    return `<span class="number-connector" aria-hidden="true"></span>`;
  }

  function shapeOption(questionId, value, svg, label) {
    return `
      <label class="shape-option" aria-label="${escapeHtml(label)}">
        <input type="checkbox" data-answer="${questionId}" value="${escapeHtml(value)}">
        <span>${svg}</span>
      </label>
    `;
  }

  function notebookScene() {
    return `
      <svg class="math-svg notebook-scene" viewBox="0 0 260 190" role="img" aria-label="Three shaded notebooks and one unshaded notebook">
        ${notebook(38, 34, true)}${notebook(104, 34, true)}${notebook(170, 34, true)}${notebook(40, 100, false)}
      </svg>
    `;
  }

  function notebook(x, y, shaded) {
    const fill = shaded ? "#a9bccb" : "#ffffff";
    return `
      <g transform="translate(${x} ${y}) rotate(-14 26 34)">
        <rect x="4" y="4" width="52" height="64" rx="5" fill="${fill}" stroke="#213b4d" stroke-width="3"/>
        <path d="M12 6v61" stroke="#213b4d" stroke-width="2"/>
        <path d="M12 12h-6M12 24h-6M12 36h-6M12 48h-6M12 60h-6" stroke="#213b4d" stroke-width="2"/>
      </g>
    `;
  }

  function orangePlate() {
    return `
      <svg class="math-svg object-scene" viewBox="0 0 260 160" role="img" aria-label="Five oranges on a plate">
        <ellipse cx="130" cy="112" rx="104" ry="30" fill="#f9fbfb" stroke="#213b4d" stroke-width="3"/>
        ${orange(85, 76)}${orange(118, 62)}${orange(151, 74)}${orange(106, 98)}${orange(139, 96)}
      </svg>
    `;
  }

  function orange(cx, cy) {
    return `<g><circle cx="${cx}" cy="${cy}" r="27" fill="#f59e0b" stroke="#213b4d" stroke-width="3"/><path d="M${cx - 6} ${cy - 28}c10-14 18-7 18 3" fill="none" stroke="#498b32" stroke-width="3"/><circle cx="${cx - 6}" cy="${cy - 3}" r="2" fill="#fbd38d"/></g>`;
  }

  function cakeScene() {
    return `
      <svg class="math-svg object-scene" viewBox="0 0 260 170" role="img" aria-label="Five cakes, two burnt">
        ${cake(56, 44, false)}${cake(126, 44, false)}${cake(204, 44, true)}
        ${cake(88, 110, false)}${cake(190, 110, true)}
      </svg>
    `;
  }

  function cake(x, y, burnt) {
    const top = burnt ? "#38424b" : "#fff7df";
    const base = burnt ? "#8b5a2b" : "#f9c27b";
    return `
      <g transform="translate(${x} ${y})">
        <ellipse cx="0" cy="0" rx="31" ry="21" fill="${top}" stroke="#213b4d" stroke-width="3"/>
        <path d="M-30 0v34c9 12 51 12 60 0V0" fill="${base}" stroke="#213b4d" stroke-width="3"/>
        <path d="M-22 8v24M-10 12v24M4 10v25M18 7v24" stroke="#ffffff" stroke-width="3" opacity=".6"/>
        <circle cx="-8" cy="-7" r="3" fill="#ef4444"/>
      </g>
    `;
  }

  function triangleSvg() {
    return `<svg viewBox="0 0 80 70" aria-hidden="true"><path d="M40 8 70 62H10Z" fill="#fff" stroke="#213b4d" stroke-width="4"/></svg>`;
  }

  function upsideDownTriangleSvg() {
    return `<svg viewBox="0 0 80 70" aria-hidden="true"><path d="M10 8h60L40 62Z" fill="#fff" stroke="#213b4d" stroke-width="4"/></svg>`;
  }

  function squareSvg() {
    return `<svg viewBox="0 0 80 70" aria-hidden="true"><rect x="19" y="14" width="42" height="42" fill="#fff" stroke="#213b4d" stroke-width="4"/></svg>`;
  }

  function tiltedSquareSvg() {
    return `<svg viewBox="0 0 80 70" aria-hidden="true"><rect x="21" y="12" width="42" height="42" transform="rotate(-9 42 33)" fill="#fff" stroke="#213b4d" stroke-width="4"/></svg>`;
  }

  function rectangleSvg() {
    return `<svg viewBox="0 0 80 70" aria-hidden="true"><rect x="25" y="5" width="32" height="60" fill="#fff" stroke="#213b4d" stroke-width="4"/></svg>`;
  }

  function circleSvg() {
    return `<svg viewBox="0 0 80 70" aria-hidden="true"><circle cx="40" cy="35" r="25" fill="#fff" stroke="#213b4d" stroke-width="4"/></svg>`;
  }

  function beadScene() {
    return `
      <svg class="math-svg bead-scene" viewBox="0 0 380 170" role="img" aria-label="Fourteen beads on strings and two more beads">
        <path d="M25 38c45 18 120 10 170 13 24 1 35 8 47 23" fill="none" stroke="#213b4d" stroke-width="3"/>
        ${[52, 90, 128, 166, 204].map((x) => bead(x, 48)).join("")}
        <path d="M18 88c52 9 128-14 213 8" fill="none" stroke="#213b4d" stroke-width="3"/>
        ${[46, 84, 122, 160, 198].map((x) => bead(x, 88)).join("")}
        <path d="M28 132c47 8 104 4 148 7" fill="none" stroke="#213b4d" stroke-width="3"/>
        ${[58, 96, 134, 172].map((x) => bead(x, 132)).join("")}
        ${bead(282, 88)}${bead(322, 88)}
      </svg>
    `;
  }

  function bead(cx, cy) {
    return `<circle cx="${cx}" cy="${cy}" r="15" fill="#fff" stroke="#213b4d" stroke-width="3"/>`;
  }

  function pencilGrid() {
    const gridLines = Array.from({ length: 11 }, (_, i) => `<line x1="${40 + i * 55}" y1="20" x2="${40 + i * 55}" y2="220"/>`).join("");
    return `
      <svg class="math-svg pencil-grid" viewBox="0 0 650 245" role="img" aria-label="Three pencils labelled A, B, and C on a measuring grid">
        <rect x="40" y="20" width="550" height="200" fill="#f8faf9" stroke="#213b4d" stroke-width="2"/>
        ${gridLines}
        <line x1="40" y1="87" x2="590" y2="87"/><line x1="40" y1="154" x2="590" y2="154"/>
        ${pencil(105, 58, 260, "A")}
        ${pencil(155, 125, 370, "B")}
        ${pencil(52, 190, 260, "C")}
      </svg>
    `;
  }

  function pencil(x, y, length, label) {
    return `
      <g transform="translate(${x} ${y})">
        <rect x="0" y="-12" width="${length - 70}" height="24" fill="#ffffff" stroke="#213b4d" stroke-width="3"/>
        <path d="M${length - 70} -12L${length} 0L${length - 70} 12Z" fill="#f7d7a5" stroke="#213b4d" stroke-width="3"/>
        <rect x="-10" y="-12" width="10" height="24" fill="#111827"/>
        <path d="M5 12c20 16 64 14 86 0" fill="none" stroke="#213b4d" stroke-width="2"/>
        <text x="${length + 18}" y="9" font-size="28" font-weight="700" fill="#213b4d">${label}</text>
      </g>
    `;
  }

  function bookGraph() {
    const rows = [
      ["Chinese Literature", 7],
      ["English Literature", 3],
      ["Malay Literature", 4],
      ["Bedtime story", 3],
    ];
    return `
      <div class="book-graph" role="img" aria-label="Pictograph of books on Meiling's bookshelf">
        ${rows.map(([label, count]) => `
          <div class="book-row">
            <strong>${escapeHtml(label)}</strong>
            <span>${Array.from({ length: count }, bookIcon).join("")}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function bookIcon() {
    return `<svg class="book-icon" viewBox="0 0 48 38" aria-hidden="true"><path d="M9 8 28 3l12 13-19 6Z" fill="#fff" stroke="#213b4d" stroke-width="2"/><path d="M9 8v16l13 9 18-7V16l-19 6Z" fill="#eef7f5" stroke="#213b4d" stroke-width="2"/><path d="M15 13l15-4M14 20l16-4" stroke="#213b4d" stroke-width="1.5"/><text x="17" y="17" font-size="7" fill="#213b4d" transform="rotate(-12 17 17)">Book</text></svg>`;
  }

  function baseTenScene() {
    return `
      <div class="base-ten-wrap">
        <svg class="math-svg base-ten" viewBox="0 0 560 220" role="img" aria-label="Base ten blocks showing subtract 2 from 6, 16, and 26">
          <rect x="8" y="8" width="544" height="204" fill="#fff" stroke="#213b4d" stroke-width="3"/>
          ${blockGroup(388, 28, 6, 2)}
          ${blockGroup(248, 96, 16, 2)}
          ${blockGroup(70, 144, 26, 2)}
        </svg>
      </div>
    `;
  }

  function blockGroup(x, y, count, crossed) {
    return Array.from({ length: count }, (_, index) => {
      const col = index % 10;
      const row = Math.floor(index / 10);
      const bx = x + col * 22;
      const by = y + row * 22;
      const isCrossed = index >= count - crossed;
      return `<g><rect x="${bx}" y="${by}" width="16" height="16" fill="#fff" stroke="#213b4d" stroke-width="2"/>${isCrossed ? `<path d="M${bx + 1} ${by + 15}L${bx + 15} ${by + 1}" stroke="#213b4d" stroke-width="2"/>` : ""}</g>`;
    }).join("");
  }

  function triangleFlags() {
    return `
      <svg class="math-svg triangle-flags" viewBox="0 0 260 150" role="img" aria-label="Two groups of four triangles">
        <path d="M28 30c60 22 150 22 205 0" fill="none" stroke="#213b4d" stroke-width="3"/>
        ${[58, 96, 134, 172].map((x) => flagTriangle(x, 52)).join("")}
        <path d="M28 96c60 22 150 22 205 0" fill="none" stroke="#213b4d" stroke-width="3"/>
        ${[58, 96, 134, 172].map((x) => flagTriangle(x, 118)).join("")}
      </svg>
    `;
  }

  function flagTriangle(x, y) {
    return `<path d="M${x} ${y - 28}l18 36h-36Z" fill="#213b4d"/>`;
  }

  function pearSvg() {
    return `<svg class="pear-icon" viewBox="0 0 70 90" aria-hidden="true"><path d="M36 8c-2 12-12 13-15 29-4 20-15 29-7 42 9 14 35 14 44 0 8-13-4-22-7-42-3-16-13-17-15-29Z" fill="#d9f2a3" stroke="#213b4d" stroke-width="3"/><path d="M34 12c1-8 5-11 10-12" stroke="#213b4d" stroke-width="3" fill="none"/><circle cx="26" cy="63" r="2" fill="#8a6b42"/><circle cx="42" cy="58" r="2" fill="#8a6b42"/></svg>`;
  }

  function familyScene() {
    return `
      <svg class="math-svg family-scene" viewBox="0 0 320 220" role="img" aria-label="Family visiting at the door">
        <rect x="14" y="22" width="292" height="176" rx="14" fill="#f8faf9" stroke="#d8e8e8" stroke-width="2"/>
        <path d="M24 172h236" stroke="#d8e8e8" stroke-width="3"/>
        <rect x="222" y="44" width="62" height="128" fill="#fff" stroke="#213b4d" stroke-width="4"/>
        <path d="M222 44l52-18v128l-52 18Z" fill="#d7eef6" stroke="#213b4d" stroke-width="4"/>
        <circle cx="264" cy="101" r="3" fill="#213b4d"/>
        <path d="M235 172h50" stroke="#213b4d" stroke-width="4"/>
        ${person(54, 125, "#f7c6d6")}
        ${person(104, 125, "#cfe6fb")}
        ${person(154, 126, "#f9dd8d")}
        ${person(204, 126, "#d9cdf6")}
        ${person(82, 160, "#ffe29a", 0.78)}
        ${person(132, 160, "#aee8df", 0.78)}
      </svg>
    `;
  }

  function person(x, y, colour, scale = 1) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})">
        <circle cx="0" cy="-42" r="16" fill="#fff4d6" stroke="#213b4d" stroke-width="3"/>
        <path d="M-14 -50c8-15 25-12 29 1" fill="none" stroke="#213b4d" stroke-width="4"/>
        <path d="M-22 18c3-36 41-36 44 0Z" fill="${colour}" stroke="#213b4d" stroke-width="3"/>
        <path d="M-17 -4l-14 15M17 -4l14 15" stroke="#213b4d" stroke-width="3" stroke-linecap="round"/>
        <path d="M-8 18v22M8 18v22" stroke="#213b4d" stroke-width="3" stroke-linecap="round"/>
      </g>
    `;
  }

  function clockSvg() {
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x = 70 + Math.sin(angle) * 48;
      const y = 70 - Math.cos(angle) * 48;
      return `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="11" font-weight="700">${i === 0 ? 12 : i}</text>`;
    }).join("");
    return `
      <svg class="math-svg clock-svg" viewBox="0 0 140 140" role="img" aria-label="Clock showing 10:30">
        <circle cx="70" cy="70" r="62" fill="#fff" stroke="#213b4d" stroke-width="4"/>
        ${ticks}
        <line x1="70" y1="70" x2="70" y2="114" stroke="#213b4d" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="70" x2="42" y2="38" stroke="#213b4d" stroke-width="4" stroke-linecap="round"/>
        <circle cx="70" cy="70" r="5" fill="#213b4d"/>
      </svg>
    `;
  }

  function normalizeQuestionAnswer(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? { ...value } : {};
  }

  function hasAnswerValue(value) {
    const answer = normalizeQuestionAnswer(value);
    return Object.values(answer).some((item) => Array.isArray(item) ? item.length > 0 : cleanText(item));
  }

  function displayResponse(questionId, answer) {
    if (!hasAnswerValue(answer)) return "No answer";
    const keyData = answerKeys[questionId];
    return keyData.parts.map((partKey) => {
      const value = answer[partKey.id];
      const display = Array.isArray(value) ? value.join(", ") : cleanText(value);
      return `${partKey.id}: ${display || "No answer"}`;
    }).join("; ");
  }

  function sameSet(raw, expected) {
    const values = Array.isArray(raw) ? raw : [];
    const normalizedValues = values.map((value) => normalizeByType(value, "text")).sort();
    const normalizedExpected = expected.map((value) => normalizeByType(value, "text")).sort();
    return normalizedValues.length === normalizedExpected.length
      && normalizedValues.every((value, index) => value === normalizedExpected[index]);
  }

  function normalizeByType(value, type) {
    if (type === "time") {
      return String(value || "").trim().replace(/[.\s]+/g, ":").replace(/:+/g, ":");
    }
    return String(value || "").toLowerCase().replace(/[^a-z0-9+]+/g, " ").trim();
  }

  function roundScore(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
  }

  function isDemoAssignment() {
    return ["127.0.0.1", "localhost"].includes(window.location.hostname) && assignmentToken === "demo";
  }

  function allQuestions() {
    return parts.flatMap((partItem) => partItem.questions);
  }

  function questionNumber(questionId) {
    return questionId.split("-q")[1] || "";
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
