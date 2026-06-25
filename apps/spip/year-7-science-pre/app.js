(function () {
  "use strict";

  const data = window.SpipYear7SciencePretestData;
  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || data?.testId || "spip-year-7-science-pre";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const answerStorageKey = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";

  const state = {
    currentPart: data?.parts?.[0]?.id || "part1",
    profile: null,
    answers: {},
    submitted: false,
    submissionPending: false,
    submittedScore: null,
    savedResultId: null,
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!data) {
      document.querySelector("[data-test-panel]").innerHTML = "<p>SPIP Science test data could not be loaded.</p>";
      return;
    }
    if (!loadProfile()) return;
    loadAnswers();
    buildShell();
    bindEvents();
    renderAll();
  });

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
    document.querySelector("[data-test-meta]").textContent = `${profile.fullName} (${profile.nickname}) · ${profile.level} · Test date ${profile.testDate}`;
    document.querySelector("[data-question-count]").textContent = String(allQuestions().length);
    return true;
  }

  function readProfile() {
    try {
      const stored = window.sessionStorage?.getItem(profileStorageKey);
      const profile = normalizeProfile(JSON.parse(stored || "null"));
      if (profile) return profile;
    } catch {
      // Fall through to tab-local storage.
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
      // Ignore corrupt answer state.
    }
  }

  function saveAnswers() {
    try {
      window.sessionStorage?.setItem(answerStorageKey, JSON.stringify(state.answers));
    } catch {
      // Best effort.
    }
  }

  function buildShell() {
    const navParts = [...data.parts, reviewPart()];
    document.querySelector("[data-part-nav]").innerHTML = navParts.map((part) => `
      <button class="part-tab" type="button" data-part-button="${escapeHtml(part.id)}">${escapeHtml(part.label)}</button>
    `).join("");
    document.querySelector("[data-test-panel]").innerHTML = navParts.map(renderPart).join("");
  }

  function renderPart(part) {
    if (part.id === "review") {
      return `
        <section class="part" id="review" data-part>
          <div class="part-heading">
            <div>
              <p class="eyebrow">Review</p>
              <h2>Check your answers.</h2>
            </div>
            <p class="hint">Submit when you are ready.</p>
          </div>
          <div class="student-summary" data-student-summary></div>
          <div class="review-grid" data-review-grid></div>
          <div class="result-card" hidden data-result-card></div>
        </section>
      `;
    }
    return `
      <section class="part" id="${escapeHtml(part.id)}" data-part>
        <div class="part-heading">
          <div>
            <p class="eyebrow">${escapeHtml(part.label)} · ${part.questions.length} items</p>
            <h2>${escapeHtml(part.title)}</h2>
          </div>
          <p class="hint">${escapeHtml(part.hint || "")}</p>
        </div>
        <div class="spip-question-list">
          ${renderQuestionList(part.questions)}
        </div>
      </section>
    `;
  }

  function renderQuestionList(questions) {
    const rendered = [];
    const groupedQuestionNumbers = new Set([4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16]);
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (groupedQuestionNumbers.has(question.number) && question.subQuestion === "a") {
        const grouped = questions.filter((item) => item.number === question.number);
        rendered.push(renderQuestionGroup(question.number, grouped));
        index += grouped.length - 1;
      } else {
        rendered.push(renderQuestion(question));
      }
    }
    return rendered.join("");
  }

  function renderQuestion(question) {
    const label = question.subQuestion ? `Question ${question.number}(${question.subQuestion})` : `Question ${question.number}`;
    return `
      <article class="question-card spip-question ${question.marking !== "auto_marked" ? "is-review" : ""}" data-question-card="${escapeHtml(question.id)}">
        <div class="question-head">
          <div>
            <p class="eyebrow">${escapeHtml(label)}</p>
            <h3>${escapeHtml(question.prompt)}</h3>
          </div>
          <span class="mark-pill">${question.marking === "auto_marked" ? `${formatScore(question.points)} ${question.points === 1 ? "mark" : "marks"}` : "review"}</span>
        </div>
        ${renderQuestionInput(question)}
      </article>
    `;
  }

  function renderQuestionGroup(number, questions) {
    const intro = questions[0]?.groupIntro;
    const totalPoints = questions.reduce((sum, question) => sum + Number(question.points || 0), 0);
    const sharedVisual = getSharedVisual(questions);
    return `
      <article class="question-card spip-question question-group ${questions.some((question) => question.marking !== "auto_marked") ? "is-review" : ""}" data-question-group="${number}">
        <div class="question-head">
          <div>
            <p class="eyebrow">Question ${number}</p>
            <h3>${escapeHtml(intro?.title || `Question ${number}`)}</h3>
          </div>
          <span class="mark-pill">${formatScore(totalPoints)} marks</span>
        </div>
        ${hasQuestionIntroBody(intro) ? renderQuestionIntro(intro) : ""}
        ${sharedVisual ? renderImages(sharedVisual) : ""}
        <div class="grouped-subquestions">
          ${questions.map((question) => `
            <section class="grouped-subquestion" data-question-card="${escapeHtml(question.id)}">
              <div class="grouped-subquestion-head">
                <strong>${escapeHtml(`${question.number}(${question.subQuestion})`)}</strong>
                <span>${formatScore(question.points)} ${question.points === 1 ? "mark" : "marks"}</span>
              </div>
              <h4>${escapeHtml(question.prompt)}</h4>
              ${renderQuestionInput(question, { suppressVisual: Boolean(sharedVisual) })}
            </section>
          `).join("")}
        </div>
      </article>
    `;
  }

  function renderQuestionIntro(intro) {
    return `
      <div class="question-intro">
        ${(intro.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        ${intro.bullets?.length ? `<ul>${intro.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        ${intro.resultsIntro ? `<p>${escapeHtml(intro.resultsIntro)}</p>` : ""}
        ${intro.table ? `
          <table class="source-data-table">
            <thead><tr>${intro.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
            <tbody>${intro.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        ` : ""}
      </div>
    `;
  }

  function hasQuestionIntroBody(intro) {
    return Boolean(intro?.paragraphs?.length || intro?.bullets?.length || intro?.resultsIntro || intro?.table);
  }

  function getSharedVisual(questions) {
    if (!questions.length || questions.some((question) => !question.visual || Array.isArray(question.visual))) return null;
    const [first] = questions;
    const sameImage = questions.every((question) => question.visual?.src === first.visual.src);
    return sameImage ? first.visual : null;
  }

  function renderQuestionInput(question, options = {}) {
    const images = options.suppressVisual ? "" : renderImages(question.visual);
    switch (question.responseType) {
      case "tickTable":
        return renderTickTable(question);
      case "labelDiagram":
        return renderLabelDiagram(question);
      case "choice":
        return `${images}${renderChoices(question, "answer")}`;
      case "shortText":
        return `${images}${renderPartFields(question, question.parts || [])}`;
      case "longText":
        return `${images}${renderTextArea(question)}`;
      case "completeGraph":
        return renderCompleteGraph(question);
      case "orderingSequence":
        return `${images}${renderOrdering(question)}`;
      case "wordBank":
        return `${images}${renderWordBank(question)}`;
      case "drawArrow":
        return renderArrowTool(question);
      case "mixed":
        return `${images}${renderMixed(question)}`;
      case "matching":
        return `${images}${renderMatching(question)}`;
      case "completeTable":
        return `${images}${renderCompleteTable(question)}`;
      default:
        return renderPartFields(question, question.parts || []);
    }
  }

  function renderImages(visual) {
    if (!visual) return "";
    const visuals = Array.isArray(visual) ? visual : [visual];
    return `<div class="science-visual-row">${visuals.map((item) => `
      <figure class="science-image-visual" style="--image-max:${Number(item.maxWidth || 720)}px">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || "")}" loading="lazy">
      </figure>
    `).join("")}</div>`;
  }

  function renderTickTable(question) {
    return `
      <table class="tick-table">
        <thead>
          <tr><th>material</th>${question.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${question.tickRows.map((row) => `
            <tr>
              <td>${escapeHtml(row.label)}</td>
              ${question.columns.map((column) => `
                <td>
                  <input type="radio" name="${escapeHtml(question.id)}-${escapeHtml(row.id)}" data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(row.id)}" value="${escapeHtml(column.id)}" ${getPartAnswer(question.id, row.id) === column.id ? "checked" : ""} aria-label="${escapeHtml(`${row.label} ${column.label}`)}">
                </td>
              `).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderLabelDiagram(question) {
    return `
      <div class="label-diagram-layout">
        <div class="label-diagram" style="--diagram-max:${Number(question.visual?.maxWidth || 980)}px">
          <img src="${escapeHtml(question.visual.src)}" alt="${escapeHtml(question.visual.alt || "")}" loading="lazy">
          ${question.labelAnchors.map((part, index) => `
            <label class="label-anchor" data-label="${escapeHtml(part.label)}" style="left:${Number(part.x)}%;top:${Number(part.y)}%">
              <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="${escapeHtml(`Label ${index + 1}`)}" aria-label="${escapeHtml(part.label)}">
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderChoices(question, partId) {
    const layoutClass = question.choiceLayout === "one-row" ? " is-one-row" : "";
    return `
      <div class="choice-grid${layoutClass}" role="group" aria-label="${escapeHtml(question.prompt)}">
        ${(question.choices || []).map((choice) => {
          const checked = getPartAnswer(question.id, partId) === choice.value;
          return `
            <label>
              <input type="radio" name="${escapeHtml(question.id)}-${escapeHtml(partId)}" data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(partId)}" value="${escapeHtml(choice.value)}" ${checked ? "checked" : ""}>
              <span>${escapeHtml(choice.label)}</span>
            </label>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderPartFields(question, parts) {
    return `<div class="answer-fields">${parts.map((part) => `
      <label class="spip-text-answer">
        <span>${escapeHtml(part.label)}</span>
        <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="${escapeHtml(part.placeholder || "type your answer")}">
      </label>
      ${part.reviewRecommended ? `<p class="review-note">This answer is keyword-scored and will be checked by a teacher.</p>` : ""}
    `).join("")}</div>`;
  }

  function renderTextArea(question) {
    const part = question.parts?.[0] || { id: "answer", label: "Answer" };
    return `
      <label class="spip-writing-answer">
        <span>${escapeHtml(part.label)}</span>
        <textarea data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" rows="5" autocomplete="off" placeholder="${escapeHtml(part.placeholder || "Enter your answer.")}">${escapeHtml(getPartAnswer(question.id, part.id))}</textarea>
      </label>
      ${part.reviewRecommended ? `<p class="review-note">This answer is keyword-scored and will be checked by a teacher.</p>` : ""}
    `;
  }

  function renderCompleteGraph(question) {
    const yAxis = question.graph.yAxis;
    return `
      <div class="graph-complete-layout">
        <figure class="graph-complete-figure" style="--image-max:${Number(question.visual?.maxWidth || 720)}px">
          <img src="${escapeHtml(question.visual?.src || "")}" alt="${escapeHtml(question.visual?.alt || "")}" loading="lazy">
          ${(question.graph.callouts || []).map(renderGraphCallout).join("")}
        </figure>
        ${question.graph.answerRows?.length ? renderGraphNumberedAnswers(question) : `
          <div class="graph-answer-panel">
          <label class="spip-text-answer">
            <span><b class="graph-answer-number">${escapeHtml(yAxis.calloutNumber || "1")}</b>${escapeHtml(yAxis.label)}</span>
            <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(yAxis.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, yAxis.id))}" placeholder="${escapeHtml(yAxis.placeholder || "axis label")}">
          </label>
          <table class="bar-entry-table">
            <thead>
              <tr><th>name of solid</th><th>bar height in g</th></tr>
            </thead>
            <tbody>
              ${(question.graph.bars || []).map((bar) => `
                <tr>
                  <td><b class="graph-answer-number">${escapeHtml(bar.calloutNumber || "")}</b>${escapeHtml(bar.label)}</td>
                  <td><input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(bar.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, bar.id))}" placeholder="${escapeHtml(bar.placeholder || "answer")}"></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          </div>
        `}
        <p class="review-note">Graph completion is semi-auto scored from the labels and values entered for the chart.</p>
      </div>
    `;
  }

  function renderGraphNumberedAnswers(question) {
    return `
      <div class="graph-answer-panel graph-numbered-panel">
        <h5>Write the answer for each numbered blank on the graph.</h5>
        ${(question.graph.answerRows || []).map((row) => `
          <section class="graph-numbered-row">
            <div class="graph-numbered-title">
              <b class="graph-answer-number">${escapeHtml(row.number)}</b>
              <span>${escapeHtml(row.label)}</span>
            </div>
            <div class="graph-numbered-fields">
              ${(row.fields || []).map((field) => `
                <label class="spip-text-answer">
                  <span>${escapeHtml(field.label)}</span>
                  <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(field.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, field.id))}" placeholder="${escapeHtml(field.placeholder || "answer")}">
                </label>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    `;
  }

  function renderGraphCallout(callout) {
    return `<span class="graph-callout" style="--x:${Number(callout.x)}%;--y:${Number(callout.y)}%">${escapeHtml(callout.number)}</span>`;
  }

  function renderGraphOverlayInput(question, part, overlay, className) {
    if (!overlay) return "";
    return `
      <label class="graph-overlay-input ${escapeHtml(className)}" style="--x:${Number(overlay.x)}%;--y:${Number(overlay.y)}%;--w:${Number(overlay.width || 14)}%">
        <span>${escapeHtml(part.label)}</span>
        <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="${escapeHtml(part.placeholder || "answer")}" aria-label="${escapeHtml(part.label)}">
      </label>
    `;
  }

  function renderGraphOverlayText(label, overlay, className) {
    if (!overlay) return "";
    return `<span class="graph-overlay-text ${escapeHtml(className)}" style="--x:${Number(overlay.x)}%;--y:${Number(overlay.y)}%;--w:${Number(overlay.width || 14)}%">${escapeHtml(label)}</span>`;
  }

  function renderOrdering(question) {
    const choices = orderChoices(question);
    return `
      <div class="order-layout-science">
        <div class="word-bank">${choices.map((choice) => `<span>${escapeHtml(choice)}</span>`).join("")}</div>
        <div class="order-list">
          ${(question.parts || []).map((part) => `
            <label class="order-item">
              <span>${escapeHtml(part.label)}</span>
              <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="${escapeHtml(part.placeholder || "item or letter")}">
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }

  function orderChoices(question) {
    return (question.orderItems || []).map((item) => {
      const match = String(item).match(/^([A-D])\s/);
      return match ? item : item;
    });
  }

  function renderWordBank(question) {
    return `
      <div class="word-bank-layout">
        <div class="word-bank">${(question.wordBank || []).map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</div>
        <div class="answer-fields">
          ${(question.parts || []).map((part) => `
            <label class="spip-text-answer">
              <span>${escapeHtml(part.label)}</span>
              <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="choose a word">
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderArrowTool(question) {
    const answer = ensureAnswer(question.id);
    const start = parsePoint(answer.arrowStart);
    const end = parsePoint(answer.arrowEnd);
    return `
      <div class="arrow-tool" data-arrow-tool="${escapeHtml(question.id)}">
        <div class="arrow-stage">
          <img src="${escapeHtml(question.visual.src)}" alt="${escapeHtml(question.visual.alt || "")}" loading="lazy">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <marker id="arrow-head-${escapeHtml(question.id)}" markerWidth="4" markerHeight="4" refX="3.6" refY="2" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,0 L4,2 L0,4 Z" fill="#0b7fff"></path>
              </marker>
            </defs>
            ${start && end ? `<line class="student-arrow" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" marker-end="url(#arrow-head-${escapeHtml(question.id)})"></line>` : ""}
          </svg>
        </div>
        <p class="arrow-help">Drag on the image to draw the gravity arrow.</p>
        <input type="hidden" data-answer="${escapeHtml(question.id)}" data-part="arrow" value="${escapeHtml(getPartAnswer(question.id, "arrow"))}">
        <p class="review-note">Arrow direction is semi-auto checked and will be reviewed by a teacher.</p>
      </div>
    `;
  }

  function renderMixed(question) {
    const choicePart = (question.parts || []).find((part) => part.id === "choice");
    return `
      <div class="answer-fields">
        ${choicePart && question.choices ? renderChoices(question, choicePart.id) : ""}
        ${(question.parts || []).filter((part) => !(part.id === "choice" && question.choices)).map((part) => {
          if (part.id === "letter") {
            return `
              <label class="spip-text-answer">
                <span>${escapeHtml(part.label)}</span>
                <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="${escapeHtml(part.placeholder || "letter")}">
              </label>
            `;
          }
          return `
            <label class="spip-writing-answer">
              <span>${escapeHtml(part.label)}</span>
              <textarea data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" rows="3" autocomplete="off" placeholder="${escapeHtml(part.placeholder || "Explain your answer.")}">${escapeHtml(getPartAnswer(question.id, part.id))}</textarea>
            </label>
            ${part.reviewRecommended ? `<p class="review-note">This answer is keyword-scored and will be checked by a teacher.</p>` : ""}
          `;
        }).join("")}
      </div>
    `;
  }

  function renderMatching(question) {
    return `
      <div class="match-layout">
        <div class="match-board">
          <div>
            ${(question.sources || []).map((source) => `<div class="match-source">${escapeHtml(source.label)}</div>`).join("")}
          </div>
          <div class="answer-fields">
            ${(question.parts || []).map((part) => `
              <label class="spip-text-answer">
                <span>${escapeHtml(part.label)}</span>
                <select data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}">
                  <option value="">Choose explanation</option>
                  ${(question.targets || []).map((target) => `<option value="${escapeHtml(target.value)}" ${getPartAnswer(question.id, part.id) === target.value ? "selected" : ""}>${escapeHtml(target.label)}</option>`).join("")}
                </select>
              </label>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderCompleteTable(question) {
    if (question.table?.rows?.length) {
      return `
        ${renderInfoCard(question.infoCard)}
        <table class="complete-table actual-table">
          <thead><tr>${question.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
          <tbody>
            ${question.table.rows.map((row) => `
              <tr>
                ${row.map((cell) => renderTableCell(question, cell)).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }
    return `
      <table class="complete-table">
        <thead><tr><th></th>${question.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
        <tbody>
          <tr>
            <th>volume collected in cm3</th>
            ${(question.parts || []).map((part) => `
              <td><input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="cm3"></td>
            `).join("")}
          </tr>
        </tbody>
      </table>
    `;
  }

  function renderInfoCard(infoCard) {
    if (!infoCard) return "";
    return `
      <div class="science-info-card">
        ${(infoCard.title ? [`<strong>${escapeHtml(infoCard.title)}</strong>`] : []).join("")}
        ${(infoCard.items || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    `;
  }

  function renderTableCell(question, cell) {
    if (typeof cell === "string" || typeof cell === "number") {
      return `<td>${escapeHtml(cell)}</td>`;
    }
    const part = (question.parts || []).find((item) => item.id === cell.part);
    return `
      <td>
        <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(cell.part)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, cell.part))}" placeholder="${escapeHtml(cell.placeholder || part?.placeholder || "answer")}" aria-label="${escapeHtml(part?.label || cell.part)}">
      </td>
    `;
  }

  function bindEvents() {
    document.querySelector("[data-part-nav]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-part-button]");
      if (!button) return;
      state.currentPart = button.dataset.partButton;
      renderAll();
    });
    const panel = document.querySelector("[data-test-panel]");
    panel.addEventListener("input", handleAnswer);
    panel.addEventListener("change", handleAnswer);
    panel.addEventListener("pointerdown", handleArrowPointerDown);
    document.querySelector("[data-submit-test]").addEventListener("click", submitTest);
  }

  function handleAnswer(event) {
    const input = event.target.closest("[data-answer]");
    if (!input) return;
    const questionId = input.dataset.answer;
    const partId = input.dataset.part || "answer";
    if (input.type === "radio" && !input.checked) return;
    ensureAnswer(questionId)[partId] = input.value;
    saveAnswers();
    renderProgress();
  }

  function handleArrowPointerDown(event) {
    const stage = event.target.closest(".arrow-stage");
    const tool = event.target.closest("[data-arrow-tool]");
    if (!stage || !tool) return;
    event.preventDefault();
    const questionId = tool.dataset.arrowTool;
    const answer = ensureAnswer(questionId);
    const start = stagePoint(stage, event);
    answer.arrowStart = pointString(start);
    answer.arrowEnd = pointString(start);

    const move = (moveEvent) => {
      const end = stagePoint(stage, moveEvent);
      answer.arrowEnd = pointString(end);
      answer.arrow = isMostlyDown(start, end) ? "down" : "other";
      updateArrowLayer(tool, start, end);
    };
    const up = (upEvent) => {
      const end = stagePoint(stage, upEvent);
      answer.arrowEnd = pointString(end);
      answer.arrow = isMostlyDown(start, end) ? "down" : "other";
      const hidden = tool.querySelector('[data-part="arrow"]');
      if (hidden) hidden.value = answer.arrow;
      saveAnswers();
      renderProgress();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function stagePoint(stage, event) {
    const rect = stage.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  }

  function updateArrowLayer(tool, start, end) {
    const svg = tool.querySelector(".arrow-stage svg");
    let line = tool.querySelector(".student-arrow");
    if (!line) {
      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "student-arrow");
      line.setAttribute("marker-end", `url(#arrow-head-${tool.dataset.arrowTool})`);
      svg?.appendChild(line);
    }
    line.setAttribute("x1", String(start.x));
    line.setAttribute("y1", String(start.y));
    line.setAttribute("x2", String(end.x));
    line.setAttribute("y2", String(end.y));
  }

  async function submitTest() {
    if (state.submitted || state.submissionPending) return;
    collectCurrentAnswers();
    state.submissionPending = true;
    renderResult("Submitting...");
    if (isDemoAssignment() || !window.KeaesApi?.isConfigured()) {
      state.submittedScore = scoreLocal();
      state.submitted = true;
      state.submissionPending = false;
      state.currentPart = "review";
      renderAll();
      return;
    }
    try {
      const result = await window.KeaesApi.submitAttempt({
        assignmentToken: state.profile.assignmentToken,
        student: state.profile,
        answers: { ...state.answers, rwAnswers: flattenAnswers(), aiGrades: {} },
      });
      state.savedResultId = result?.attemptId || null;
      state.submittedScore = {
        score: Number(result?.scoreTotal ?? result?.total ?? 0),
        possible: Number(result?.scorePossible ?? result?.possible ?? data.totalPoints),
      };
      state.submitted = true;
      state.currentPart = "review";
    } catch (err) {
      renderResult(`Could not submit: ${err.message}`);
    } finally {
      state.submissionPending = false;
      renderAll();
    }
  }

  function collectCurrentAnswers() {
    document.querySelectorAll("[data-answer]").forEach((input) => {
      const questionId = input.dataset.answer;
      const partId = input.dataset.part || "answer";
      if (input.type === "radio") {
        if (input.checked) ensureAnswer(questionId)[partId] = input.value;
        return;
      }
      ensureAnswer(questionId)[partId] = input.value;
    });
    saveAnswers();
  }

  function renderAll() {
    document.querySelectorAll("[data-part]").forEach((part) => {
      part.classList.toggle("is-active", part.id === state.currentPart);
    });
    document.querySelectorAll("[data-part-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.partButton === state.currentPart);
    });
    renderProgress();
    renderReview();
    renderResult();
  }

  function renderProgress() {
    const answered = allQuestions().filter((question) => isQuestionAnswered(question)).length;
    document.querySelector("[data-progress-count]").textContent = String(answered);
  }

  function renderReview() {
    const summary = document.querySelector("[data-student-summary]");
    if (!summary) return;
    summary.innerHTML = `
      <strong>${escapeHtml(state.profile.fullName)}</strong>
      <span>${escapeHtml(state.profile.nickname)} · ${escapeHtml(state.profile.subject)} · ${escapeHtml(state.profile.level)} · ${escapeHtml(state.profile.testDate)}</span>
    `;
    const reviewGrid = document.querySelector("[data-review-grid]");
    reviewGrid.innerHTML = data.parts.map((part) => `
      <article class="review-card">
        <strong>${escapeHtml(part.label)}</strong>
        <span>${part.questions.filter((question) => isQuestionAnswered(question)).length}/${part.questions.length} answered</span>
      </article>
    `).join("");
  }

  function renderResult(message = "") {
    const card = document.querySelector("[data-result-card]");
    if (!card) return;
    if (message) {
      card.hidden = false;
      card.innerHTML = `<p>${escapeHtml(message)}</p>`;
      return;
    }
    if (!state.submittedScore) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    card.innerHTML = `
      <p class="eyebrow">Submitted</p>
      <h3>${formatScore(state.submittedScore.score)}/${formatScore(state.submittedScore.possible)}</h3>
      <p>Objective items are auto-scored. Semi-auto explanation and drawing items are keyword-scored and flagged for teacher checking.</p>
      ${state.savedResultId ? `<p>Result ID: ${escapeHtml(state.savedResultId)}</p>` : ""}
    `;
  }

  function scoreLocal() {
    return allQuestions().reduce((score, question) => {
      const possible = question.points || 1;
      const parts = getQuestionParts(question);
      const questionScore = question.scoreThresholds?.length
        ? scoreFromThresholds(parts.filter((part) => scorePart(question.id, part) > 0).length, question.scoreThresholds)
        : parts.reduce((sum, part) => sum + scorePart(question.id, part), 0);
      return { score: score.score + Math.min(questionScore, possible), possible: score.possible + possible };
    }, { score: 0, possible: 0 });
  }

  function scoreFromThresholds(correctCount, thresholds) {
    return (thresholds || [])
      .filter((threshold) => correctCount >= Number(threshold.minCorrect || 0))
      .reduce((best, threshold) => Math.max(best, Number(threshold.points || 0)), 0);
  }

  function scorePart(questionId, part) {
    const response = getPartAnswer(questionId, part.id);
    const possible = Number(part.points || 0);
    if (part.normalizer === "keywords") return keywordMatches(response, part.keywords) ? possible : 0;
    if (part.normalizer === "arrowDown") return response === "down" ? possible : 0;
    const normalized = normalizeAnswer(response);
    const accepted = (part.accepted || []).map(normalizeAnswer);
    return normalized && accepted.includes(normalized) ? possible : 0;
  }

  function keywordMatches(response, keywordSets) {
    const normalized = normalizeAnswer(response);
    if (!normalized) return false;
    return (keywordSets || []).some((set) => set.every((word) => normalized.includes(normalizeAnswer(word))));
  }

  function flattenAnswers() {
    const flattened = {};
    Object.entries(state.answers).forEach(([questionId, answer]) => {
      if (answer && typeof answer === "object") flattened[questionId] = Object.values(answer).join(", ");
      else flattened[questionId] = answer;
    });
    return flattened;
  }

  function getQuestionParts(question) {
    if (question.tickRows) return question.tickRows;
    if (question.labelAnchors) return question.labelAnchors;
    if (question.graph?.answerRows) return question.graph.answerRows.flatMap((row) => row.fields || []);
    if (question.graph) return [question.graph.yAxis, ...(question.graph.bars || [])];
    return question.parts || [];
  }

  function isQuestionAnswered(question) {
    const answer = state.answers[question.id];
    if (!answer || typeof answer !== "object") return Boolean(cleanText(answer));
    const parts = getQuestionParts(question);
    return parts.length ? parts.some((part) => cleanText(answer[part.id])) : Object.values(answer).some((value) => cleanText(value));
  }

  function ensureAnswer(questionId) {
    if (!state.answers[questionId] || typeof state.answers[questionId] !== "object") state.answers[questionId] = {};
    return state.answers[questionId];
  }

  function getPartAnswer(questionId, partId) {
    const answer = state.answers[questionId];
    return answer && typeof answer === "object" ? String(answer[partId] || "") : "";
  }

  function allQuestions() {
    return data.parts.flatMap((part) => part.questions || []);
  }

  function reviewPart() {
    return { id: "review", label: "Review", title: "Check your answers.", questions: [] };
  }

  function isDemoAssignment() {
    return ["127.0.0.1", "localhost"].includes(window.location.hostname) && assignmentToken === "demo";
  }

  function parsePoint(value) {
    const [x, y] = String(value || "").split(",").map(Number);
    return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
  }

  function pointString(point) {
    return `${Math.round(point.x * 10) / 10},${Math.round(point.y * 10) / 10}`;
  }

  function isMostlyDown(start, end) {
    return end.y - start.y > Math.abs(end.x - start.x) && end.y - start.y > 8;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeAnswer(value) {
    return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function cleanText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
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
