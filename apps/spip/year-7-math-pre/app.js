(function () {
  "use strict";

  const data = window.SpipYear7MathPretestData;
  const params = new URLSearchParams(window.location.search);
  const assignmentToken = params.get("assignment") || "";
  const testId = params.get("testId") || data?.testId || "spip-year-7-math-pre";
  const profileStorageKey = `keaes-test-profile-v1:${assignmentToken || testId}`;
  const answerStorageKey = `keaes-test-answers-v1:${assignmentToken || testId}`;
  const windowNameKey = "__keaesTestProfilesV1";
  const scaleDial = {
    centerX: 50,
    centerY: 84.5,
    radiusX: 47,
    radiusY: 74,
  };

  const state = {
    currentPart: data?.parts?.[0]?.id || "paper1a",
    profile: null,
    answers: {},
    submitted: false,
    submissionPending: false,
    submittedScore: null,
    savedResultId: null,
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!data) {
      document.querySelector("[data-test-panel]").innerHTML = "<p>SPIP Math test data could not be loaded.</p>";
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
            <p class="eyebrow">${escapeHtml(part.label)} · ${part.questions.length} questions</p>
            <h2>${escapeHtml(part.title)}</h2>
          </div>
          <p class="hint">${escapeHtml(part.hint || "")}</p>
        </div>
        <div class="spip-question-list">
          ${part.questions.map((question) => renderQuestion(question)).join("")}
        </div>
      </section>
    `;
  }

  function renderQuestion(question) {
    return `
      <article class="question-card spip-question ${question.reviewRequired ? "is-review" : ""}" data-question-card="${escapeHtml(question.id)}">
        <div class="question-head">
          <div>
            <p class="eyebrow">Question ${question.number}</p>
            <h3>${escapeHtml(question.prompt)}</h3>
          </div>
          <span class="mark-pill">${question.reviewRequired ? "review" : `${formatScore(question.points)} ${question.points === 1 ? "mark" : "marks"}`}</span>
        </div>
        ${renderQuestionInput(question)}
      </article>
    `;
  }

  function renderQuestionInput(question) {
    switch (question.responseType) {
      case "pairMatch":
        return `${renderImages(question.visual)}${renderPartFields(question, question.pairs)}`;
      case "pairConnect":
        return renderPairConnector(question);
      case "dragTranslation":
        return renderTranslationTool(question);
      case "largestPairs":
        return renderLargestPairs(question);
      case "inline":
        return renderInline(question);
      case "scaleReview":
        return renderScaleReview(question);
      case "tableRunner":
        return `${renderRunnerTable(question)}${renderPartFields(question, question.parts)}`;
      case "stampChoices":
        return renderStampChoices(question);
      case "fractionBoxes":
        return renderFractionBoxes(question);
      case "likelihood":
        return `${renderLikelihood(question)}${renderHiddenReviewInput(question, "matches")}`;
      case "checkboxes":
        return renderCheckboxes(question);
      case "imageParts":
        return `${renderImages(question.visual)}${renderPartFields(question, question.parts)}`;
      case "multiplicationGrid":
        return renderMultiplicationGrid(question);
      case "sequenceBoxes":
        return renderSequenceBoxes(question);
      case "columnAddition":
        return renderColumnAddition(question);
      case "operationBoxes":
        return renderOperationBoxes(question);
      case "textArea":
        return renderTextArea(question);
      case "orderBoxes":
        return renderOrderBoxes(question);
      case "threeBoxes":
        return renderThreeBoxes(question);
      case "reflectionGrid":
        return `${renderReflectionGrid(question)}${renderHiddenReviewInput(question, "cells")}`;
      default:
        return renderPartFields(question, question.parts || []);
    }
  }

  function renderImages(visual) {
    if (!visual) return "";
    const visuals = Array.isArray(visual) ? visual : [visual];
    return `<div class="math-visual-row">${visuals.map((item) => `
      <figure class="math-image-visual" style="--image-max:${Number(item.maxWidth || 520)}px">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || "")}" loading="lazy">
      </figure>
    `).join("")}</div>`;
  }

  function renderScaleReview(question) {
    const visuals = Array.isArray(question.visual) ? question.visual : [];
    const digital = visuals[0];
    const scale = visuals[1];
    const value = parseScaleValue(getPartAnswer(question.id, "answer"));
    const arrow = Number.isFinite(value) ? scaleArrow(value) : null;
    return `
      <div class="scale-click-layout">
        ${digital ? renderImages(digital) : ""}
        <figure class="scale-click-visual" data-scale-tool="${escapeHtml(question.id)}" style="--image-max:${Number(scale?.maxWidth || 520)}px">
          <img src="${escapeHtml(scale?.src || "")}" alt="${escapeHtml(scale?.alt || "Kilogram scale")}" loading="lazy">
          <svg class="scale-arrow-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            ${arrow ? `
              <line x1="50" y1="86" x2="${arrow.x}" y2="${arrow.y}" class="scale-arrow"></line>
            ` : ""}
          </svg>
          <span class="scale-click-value">${Number.isFinite(value) ? `${formatScore(value)} kg` : "Click the scale"}</span>
        </figure>
      </div>
      ${renderHiddenReviewInput(question, "answer")}
    `;
  }

  function parseScaleValue(value) {
    const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : NaN;
  }

  function scaleArrow(value) {
    const clamped = clamp(value, 0, 20);
    const angle = (180 - (clamped / 20) * 180) * Math.PI / 180;
    return {
      x: scaleDial.centerX + scaleDial.radiusX * Math.cos(angle),
      y: scaleDial.centerY - scaleDial.radiusY * Math.sin(angle),
    };
  }

  function renderStampChoices(question) {
    const visuals = Array.isArray(question.visual) ? question.visual : [];
    const stamp = visuals[0];
    const patterns = visuals[1];
    const selected = getPartAnswer(question.id, "selected").split(",").filter(Boolean);
    const choicePositions = [12.5, 37.5, 62.5, 87.5];
    return `
      ${stamp ? renderImages(stamp) : ""}
      <figure class="stamp-choice-visual" style="--image-max:${Number(patterns?.maxWidth || 760)}px">
        <img src="${escapeHtml(patterns?.src || "")}" alt="${escapeHtml(patterns?.alt || "Pattern choices")}" loading="lazy">
        <div class="stamp-choice-row" aria-label="Select the valid pattern choices">
          ${(question.choices || []).map((choice, index) => {
            const value = choice.toLowerCase();
            const checked = selected.includes(value);
            return `
              <label class="stamp-choice-option ${checked ? "is-selected" : ""}" style="--choice-left:${choicePositions[index] || 12.5}%">
                <input type="checkbox" data-answer="${escapeHtml(question.id)}" data-part="selected" value="${escapeHtml(value)}" ${checked ? "checked" : ""}>
                <span class="stamp-choice-box" aria-hidden="true"></span>
                <span class="stamp-choice-label">${escapeHtml(choice)}</span>
              </label>
            `;
          }).join("")}
        </div>
      </figure>
    `;
  }

  function renderPartFields(question, parts) {
    return `<div class="answer-fields">${parts.map((part) => `
      <label class="spip-text-answer">
        <span>${escapeHtml(part.label)}</span>
        <input data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(part.id)}" autocomplete="off" value="${escapeHtml(getPartAnswer(question.id, part.id))}" placeholder="${escapeHtml(part.placeholder || "type your answer")}">
      </label>
    `).join("")}</div>`;
  }

  function renderPairConnector(question) {
    const answer = ensureAnswer(question.id);
    const selectedNode = answer._selectedNode || "";
    const pairLines = (question.pairs || [])
      .map((part) => {
        const pair = parsePairValue(answer[part.id]);
        if (pair.length !== 2) return "";
        const start = question.nodes.find((node) => node.value === pair[0]);
        const end = question.nodes.find((node) => node.value === pair[1]);
        if (!start || !end) return "";
        return `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" class="pair-line"></line>`;
      })
      .join("");
    return `
      <div class="pair-connect" data-pair-connect="${escapeHtml(question.id)}">
        <svg viewBox="0 0 100 90" role="img" aria-label="Click decimals to connect pairs that make 1">
          ${pairLines}
          ${(question.nodes || []).map((node) => `
            <circle cx="${node.x}" cy="${node.y}" r="0.1" aria-hidden="true"></circle>
          `).join("")}
        </svg>
        <div class="pair-node-layer">
          ${(question.nodes || []).map((node) => `
            <button type="button" class="pair-node ${selectedNode === node.value ? "is-selected" : ""}" data-pair-node="${escapeHtml(node.value)}" style="left:${node.x}%;top:${node.y}%">${escapeHtml(node.value)}</button>
          `).join("")}
        </div>
        <div class="pair-summary">
          ${(question.pairs || []).map((part) => `<span>${escapeHtml(answer[part.id] || "Click two decimals")}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function renderLargestPairs(question) {
    return `
      <div class="largest-table" role="group" aria-label="Largest number choices">
        ${question.rows.map((row) => {
          const choices = row.label.split(" or ");
          return `
            <div class="largest-row" aria-label="${escapeHtml(row.label)}">
              ${choices.map((choice) => {
                const checked = getPartAnswer(question.id, row.id) === choice;
                return `
                <label class="largest-choice ${checked ? "is-selected" : ""}">
                  <input type="radio" name="${escapeHtml(question.id)}-${escapeHtml(row.id)}" data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(row.id)}" value="${escapeHtml(choice)}" ${checked ? "checked" : ""}>
                  <span class="choice-ring" aria-hidden="true"></span>
                  <span class="choice-text">${escapeHtml(choice)}</span>
                </label>
                `;
              }).join("")}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderInline(question) {
    if (question.layout === "twobox") return renderPartFields(question, question.parts);
    if (question.layout === "equations") {
      return `<div class="inline-equations">${question.equations.map((line) => `<p>${renderTemplate(line, question)}</p>`).join("")}</div>`;
    }
    const equation = question.equation || "{answer}";
    return `<div class="inline-equations"><p>${renderTemplate(equation, question)}</p></div>`;
  }

  function renderTemplate(template, question) {
    return String(template).replace(/\{([a-zA-Z0-9_-]+)\}/g, (_match, id) => renderSmallInput(question.id, id));
  }

  function renderSmallInput(questionId, partId, extraClass = "") {
    return `<input class="inline-box ${escapeHtml(extraClass)}" data-answer="${escapeHtml(questionId)}" data-part="${escapeHtml(partId)}" autocomplete="off" value="${escapeHtml(getPartAnswer(questionId, partId))}">`;
  }

  function renderTranslationTool(question) {
    const dx = Number(getPartAnswer(question.id, "dx") || 0);
    const dy = Number(getPartAnswer(question.id, "dy") || 0);
    return `
      <div class="interactive-grid" data-translation-tool="${escapeHtml(question.id)}">
        <div class="grid-stage translation-stage" data-grid-stage>
          <svg viewBox="-0.9 -0.9 14.8 14.8" role="img" aria-label="Coordinate grid with draggable triangle A">
            ${gridLines(13)}
            <line x1="6" y1="0" x2="6" y2="13" class="axis"></line>
            <line x1="0" y1="6" x2="13" y2="6" class="axis"></line>
            ${axisLabels()}
            <polygon points="8,8 7,11 9,11" class="given-shape"></polygon>
            <text x="8.18" y="8.05" class="shape-label">A</text>
            <polygon points="8,8 7,11 9,11" class="student-shape" data-translation-handle="${escapeHtml(question.id)}" transform="translate(${dx} ${-dy})"></polygon>
            <text x="${8.18 + dx}" y="${8.05 - dy}" class="shape-label student-label" data-translation-label="${escapeHtml(question.id)}">A</text>
          </svg>
        </div>
        <input type="hidden" data-answer="${escapeHtml(question.id)}" data-part="dx" value="${escapeHtml(String(dx))}">
        <input type="hidden" data-answer="${escapeHtml(question.id)}" data-part="dy" value="${escapeHtml(String(dy))}">
      </div>
    `;
  }

  function axisLabels() {
    const labels = [];
    for (let value = -6; value <= 6; value += 1) {
      const x = value + 6;
      labels.push(`<text x="${x}" y="6.45" class="axis-number x-number">${value}</text>`);
      if (value !== 0) labels.push(`<text x="5.55" y="${6 - value + 0.16}" class="axis-number y-number">${value}</text>`);
    }
    labels.push('<text x="13.45" y="6.22" class="axis-label">x</text>');
    labels.push('<text x="6.15" y="-0.35" class="axis-label">y</text>');
    return labels.join("");
  }

  function gridLines(count) {
    return Array.from({ length: count + 1 }, (_item, index) => {
      return `<line x1="${index}" y1="0" x2="${index}" y2="${count}" class="grid-line"></line><line x1="0" y1="${index}" x2="${count}" y2="${index}" class="grid-line"></line>`;
    }).join("");
  }

  function renderRunnerTable(question) {
    return `
      <table class="data-table">
        <thead><tr><th>Runner</th><th>Time in seconds</th></tr></thead>
        <tbody>${question.rows.map(([name, time]) => `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(time)}</td></tr>`).join("")}</tbody>
      </table>
    `;
  }

  function renderFractionBoxes(question) {
    return `
      <div class="fraction-layout">
        <p>${renderSmallInput(question.id, "a")} <span class="frac"><span>7</span><span>10</span></span> = <span class="frac"><span>17</span><span>10</span></span></p>
        <p>2 <span class="frac"><span>1</span><span>4</span></span> = <span class="frac">${renderSmallInput(question.id, "b")}<span>4</span></span></p>
        <p>${renderSmallInput(question.id, "c")} <span class="frac"><span>2</span><span>5</span></span> = <span class="frac"><span>17</span><span>5</span></span></p>
        <p>3 <span class="frac"><span>1</span><span>2</span></span> = <span class="frac">${renderSmallInput(question.id, "d")}<span>2</span></span></p>
      </div>
    `;
  }

  function renderLikelihood(question) {
    const answer = ensureAnswer(question.id);
    const selectedSource = answer._likelihoodSource || "";
    const matches = parseLikelihoodMatches(answer.matches);
    const sources = [
      { id: "multiple4", label: "The number is a multiple of 4", x: 22, y: 24, lineY: 35, example: true },
      { id: "digits4", label: "The number has 4 digits.", x: 50, y: 24, lineY: 35 },
      { id: "odd", label: "The number is odd.", x: 78, y: 24, lineY: 35 },
    ];
    const targets = [
      { id: "impossible", label: "impossible", x: 10, y: 76, lineY: 67 },
      { id: "unlikely", label: "unlikely", x: 30, y: 76, lineY: 67 },
      { id: "even", label: "even chance", x: 50, y: 76, lineY: 67 },
      { id: "likely", label: "likely", x: 70, y: 76, lineY: 67 },
      { id: "certain", label: "certain", x: 90, y: 76, lineY: 67 },
    ];
    const lines = [
      { source: sources[0], target: targets[1], example: true },
      ...Object.entries(matches).map(([sourceId, targetId]) => ({
        source: sources.find((source) => source.id === sourceId),
        target: targets.find((target) => target.id === targetId),
      })).filter((line) => line.source && line.target),
    ];
    return `
      <div class="likelihood-layout" data-likelihood-tool="${escapeHtml(question.id)}">
        <p>Draw a line to match the outcome to its likelihood. The first one has been done for you.</p>
        <div class="likelihood-board">
          <svg class="likelihood-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            ${lines.map((line) => `<line x1="${line.source.x}" y1="${line.source.lineY}" x2="${line.target.x}" y2="${line.target.lineY}" class="likelihood-match-line ${line.example ? "is-example" : ""}"></line>`).join("")}
          </svg>
          ${sources.map((source) => `
            <button type="button" class="likelihood-source ${source.example ? "is-example" : ""} ${selectedSource === source.id ? "is-selected" : ""}" style="left:${source.x}%;top:${source.y}%" ${source.example ? "disabled" : ""} data-likelihood-source="${escapeHtml(source.id)}">${escapeHtml(source.label)}</button>
          `).join("")}
          ${targets.map((target) => `
            <button type="button" class="likelihood-target" style="left:${target.x}%;top:${target.y}%" data-likelihood-target="${escapeHtml(target.id)}">${escapeHtml(target.label)}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function parseLikelihoodMatches(value) {
    return String(value || "").split(",").reduce((matches, pair) => {
      const [source, target] = pair.split(":").map((item) => cleanText(item));
      if (source && target) matches[source] = target;
      return matches;
    }, {});
  }

  function stringifyLikelihoodMatches(matches) {
    return Object.entries(matches).map(([source, target]) => `${source}:${target}`).join(",");
  }

  function renderCheckboxes(question) {
    const selected = getPartAnswer(question.id, "selected").split(",").filter(Boolean);
    return `
      ${question.table ? renderSportTable(question.table) : ""}
      <div class="check-grid">
        ${question.choices.map((choice) => `
          <label>
            <input type="checkbox" data-answer="${escapeHtml(question.id)}" data-part="selected" value="${escapeHtml(choice.toLowerCase())}" ${selected.includes(choice.toLowerCase()) ? "checked" : ""}>
            <span>${escapeHtml(choice)}</span>
          </label>
        `).join("")}
      </div>
    `;
  }

  function renderSportTable(table) {
    return `
      <table class="data-table sports-table">
        <thead><tr><th></th>${table.columns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr></thead>
        <tbody>${table.rows.map((row) => `<tr>${row.map((cell, index) => index ? `<td>${escapeHtml(cell)}</td>` : `<th>${escapeHtml(cell)}</th>`).join("")}</tr>`).join("")}</tbody>
      </table>
    `;
  }

  function renderMultiplicationGrid(question) {
    return `
      <table class="math-grid-table">
        <tr><th>x</th><th>0.3</th><th>0.1</th><th>0.6</th><th>${renderSmallInput(question.id, "b")}</th></tr>
        <tr><th>7</th><td>2.1</td><td>0.7</td><td>4.2</td><td></td></tr>
        <tr><th>4</th><td>${renderSmallInput(question.id, "a")}</td><td>0.4</td><td>${renderSmallInput(question.id, "c")}</td><td>1.6</td></tr>
        <tr><th></th><td></td><td>${renderSmallInput(question.id, "d")}</td><td></td><td></td></tr>
      </table>
    `;
  }

  function renderSequenceBoxes(question) {
    return `
      <div class="sequence-layout">
        ${question.values.map((value) => `<span>${renderTemplate(value, question)}</span>`).join("<i></i>")}
      </div>
    `;
  }

  function renderColumnAddition(question) {
    return `
      <div class="column-addition">
        <p>3 . ${renderSmallInput(question.id, "top")} 8</p>
        <p>+ ${renderSmallInput(question.id, "bottomLeft")} . 0 ${renderSmallInput(question.id, "bottomRight")}</p>
        <hr>
        <p>5 . 6 3</p>
      </div>
    `;
  }

  function renderOperationBoxes(question) {
    return `
      <div class="operation-layout">
        <p><strong>(a)</strong> <span>745.03</span> <b>x 10</b> ${renderSmallInput(question.id, "a", "wide")}</p>
        <p><strong>(b)</strong> ${renderSmallInput(question.id, "b", "wide")} <b>x 100</b> <span>60 319</span></p>
      </div>
    `;
  }

  function renderTextArea(question) {
    return `
      <label class="spip-writing-answer">
        <span>${escapeHtml(question.parts?.[0]?.label || "Answer")}</span>
        <textarea data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(question.parts?.[0]?.id || "answer")}" rows="4" autocomplete="off" placeholder="${escapeHtml(question.parts?.[0]?.placeholder || "Enter your answer.")}">${escapeHtml(getPartAnswer(question.id, question.parts?.[0]?.id || "answer"))}</textarea>
      </label>
    `;
  }

  function renderOrderBoxes(question) {
    return `
      <div class="order-layout">
        <div class="order-values">${question.values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>
        <div class="order-inputs">${question.parts.map((part) => `<label>${escapeHtml(part.label)} ${renderSmallInput(question.id, part.id)}</label>`).join("")}</div>
      </div>
    `;
  }

  function renderThreeBoxes(question) {
    return `<div class="three-boxes">${question.parts.map((part) => renderSmallInput(question.id, part.id)).join("")}</div>`;
  }

  function renderReflectionGrid(question) {
    const selected = getPartAnswer(question.id, "cells").split(",").filter(Boolean);
    const cells = [];
    for (let row = 0; row < 12; row += 1) {
      for (let col = 0; col < 15; col += 1) {
        const id = `${col}-${row}`;
        const fixed = originalReflectionCells().includes(id);
        cells.push(`<button type="button" class="${fixed ? "is-fixed" : selected.includes(id) ? "is-selected" : ""}" data-reflect-cell="${escapeHtml(id)}" aria-label="Grid cell ${id}"></button>`);
      }
    }
    return `
      <div class="reflection-tool" data-reflection-tool="${escapeHtml(question.id)}">
        <div class="reflection-grid-wrap">
          <div class="reflection-grid">${cells.join("")}</div>
          <span class="reflection-line-label">mirror line</span>
          <svg class="reflection-mirror" viewBox="0 0 15 12" aria-hidden="true" focusable="false">
            <line x1="1" y1="12" x2="13" y2="0"></line>
          </svg>
        </div>
        <p>Click cells to place the reflected shape. This item is teacher reviewed.</p>
      </div>
    `;
  }

  function originalReflectionCells() {
    return ["8-5", "9-5", "10-5", "10-6", "11-6", "11-7"];
  }

  function renderHiddenReviewInput(question, partId) {
    return `<input type="hidden" data-answer="${escapeHtml(question.id)}" data-part="${escapeHtml(partId)}" value="${escapeHtml(getPartAnswer(question.id, partId))}">`;
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
    panel.addEventListener("click", handlePanelClick);
    panel.addEventListener("pointerdown", handleTranslationPointerDown);
    document.querySelector("[data-submit-test]").addEventListener("click", submitTest);
  }

  function handlePanelClick(event) {
    const likelihoodSource = event.target.closest("[data-likelihood-source]");
    if (likelihoodSource) {
      const questionId = likelihoodSource.closest("[data-likelihood-tool]")?.dataset.likelihoodTool;
      if (!questionId) return;
      ensureAnswer(questionId)._likelihoodSource = likelihoodSource.dataset.likelihoodSource;
      saveAnswers();
      buildShell();
      renderAll();
      return;
    }
    const likelihoodTarget = event.target.closest("[data-likelihood-target]");
    if (likelihoodTarget) {
      const questionId = likelihoodTarget.closest("[data-likelihood-tool]")?.dataset.likelihoodTool;
      if (!questionId) return;
      const answer = ensureAnswer(questionId);
      if (!answer._likelihoodSource) return;
      const matches = parseLikelihoodMatches(answer.matches);
      Object.entries(matches).forEach(([source, target]) => {
        if (target === likelihoodTarget.dataset.likelihoodTarget) delete matches[source];
      });
      matches[answer._likelihoodSource] = likelihoodTarget.dataset.likelihoodTarget;
      answer.matches = stringifyLikelihoodMatches(matches);
      answer._likelihoodSource = "";
      saveAnswers();
      buildShell();
      renderAll();
      return;
    }
    const scaleTool = event.target.closest("[data-scale-tool]");
    if (scaleTool) {
      const questionId = scaleTool.dataset.scaleTool;
      const rect = scaleTool.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const normalizedX = (x - scaleDial.centerX) / scaleDial.radiusX;
      const normalizedY = (scaleDial.centerY - y) / scaleDial.radiusY;
      const angle = Math.atan2(normalizedY, normalizedX) * 180 / Math.PI;
      const value = clamp((180 - clamp(angle, 0, 180)) / 180 * 20, 0, 20);
      ensureAnswer(questionId).answer = `${Math.round(value * 10) / 10} kg`;
      saveAnswers();
      buildShell();
      renderAll();
      return;
    }
    const cell = event.target.closest("[data-reflect-cell]");
    if (cell) {
      const questionId = event.target.closest("[data-reflection-tool]")?.dataset.reflectionTool;
      if (!questionId || cell.classList.contains("is-fixed")) return;
      const answer = ensureAnswer(questionId);
      const selected = new Set(String(answer.cells || "").split(",").filter(Boolean));
      if (selected.has(cell.dataset.reflectCell)) selected.delete(cell.dataset.reflectCell);
      else selected.add(cell.dataset.reflectCell);
      answer.cells = Array.from(selected).sort().join(",");
      saveAnswers();
      buildShell();
      renderAll();
      return;
    }
    const pairNode = event.target.closest("[data-pair-node]");
    if (pairNode) {
      const questionId = event.target.closest("[data-pair-connect]")?.dataset.pairConnect;
      const question = allQuestions().find((item) => item.id === questionId);
      if (!question) return;
      const answer = ensureAnswer(questionId);
      const value = pairNode.dataset.pairNode;
      if (!answer._selectedNode) {
        answer._selectedNode = value;
        pairNode.closest("[data-pair-connect]")?.querySelectorAll("[data-pair-node]").forEach((node) => {
          node.classList.toggle("is-selected", node.dataset.pairNode === value);
        });
        saveAnswers();
        return;
      } else if (answer._selectedNode === value) {
        answer._selectedNode = "";
        pairNode.classList.remove("is-selected");
        saveAnswers();
        return;
      } else {
        assignConnectedPair(question, answer._selectedNode, value);
        answer._selectedNode = "";
      }
      saveAnswers();
      buildShell();
      renderAll();
    }
  }

  function handleTranslationPointerDown(event) {
    const shape = event.target.closest("[data-translation-handle]");
    if (!shape) return;
    event.preventDefault();
    const questionId = shape.dataset.translationHandle;
    const svg = shape.ownerSVGElement;
    const answer = ensureAnswer(questionId);
    const startPoint = svgPoint(svg, event);
    const startDx = Number(answer.dx || 0);
    const startDy = Number(answer.dy || 0);
    const label = svg.querySelector(`[data-translation-label="${CSS.escape(questionId)}"]`);

    const move = (moveEvent) => {
      const point = svgPoint(svg, moveEvent);
      const dx = clamp(Math.round(startDx + point.x - startPoint.x), -8, 4);
      const dy = clamp(Math.round(startDy - (point.y - startPoint.y)), -2, 8);
      shape.setAttribute("transform", `translate(${dx} ${-dy})`);
      if (label) {
        label.setAttribute("x", String(8.18 + dx));
        label.setAttribute("y", String(8.05 - dy));
      }
      answer.dx = String(dx);
      answer.dy = String(dy);
      answer.notes = `Moved ${Math.abs(dx)} ${Number(dx) < 0 ? "left" : "right"} and ${Math.abs(dy)} ${Number(dy) < 0 ? "down" : "up"}`;
    };
    const up = () => {
      saveAnswers();
      renderProgress();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function svgPoint(svg, event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function assignConnectedPair(question, first, second) {
    const answer = ensureAnswer(question.id);
    const values = [first, second].sort();
    const pairId = correctPairId(values) || nextPairSlot(question, values);
    if (!pairId) return;
    (question.pairs || []).forEach((part) => {
      const pair = parsePairValue(answer[part.id]).sort();
      if (pair.includes(first) || pair.includes(second)) answer[part.id] = "";
    });
    answer[pairId] = `${first} + ${second}`;
  }

  function nextPairSlot(question, values) {
    const exact = (question.pairs || []).find((part) => parsePairValue(ensureAnswer(question.id)[part.id]).sort().join(",") === values.join(","));
    if (exact) return exact.id;
    const open = (question.pairs || []).find((part) => !cleanText(ensureAnswer(question.id)[part.id]));
    return open?.id || question.pairs?.[0]?.id || "";
  }

  function correctPairId(values) {
    const key = values.join(",");
    const map = {
      "0.38,0.62": "p1",
      "0.25,0.75": "p2",
      "0.19,0.81": "p3",
      "0.44,0.56": "p4",
    };
    return map[key] || "";
  }

  function parsePairValue(value) {
    return cleanText(value).split(/\s*(?:\+|,)\s*/).filter(Boolean);
  }

  function handleAnswer(event) {
    const input = event.target.closest("[data-answer]");
    if (!input) return;
    const questionId = input.dataset.answer;
    const partId = input.dataset.part || "answer";
    if (input.type === "radio" && !input.checked) return;
    if (input.type === "checkbox") {
      const checked = Array.from(document.querySelectorAll(`[data-answer="${CSS.escape(questionId)}"][data-part="${CSS.escape(partId)}"]:checked`)).map((item) => item.value).sort();
      ensureAnswer(questionId)[partId] = checked.join(",");
    } else {
      ensureAnswer(questionId)[partId] = input.value;
    }
    saveAnswers();
    renderProgress();
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
      if (input.type === "checkbox") return;
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
      <p>Auto-scored questions are included. Review-marked questions are collected for teacher checking.</p>
      ${state.savedResultId ? `<p>Result ID: ${escapeHtml(state.savedResultId)}</p>` : ""}
    `;
  }

  function scoreLocal() {
    return allQuestions().reduce((score, question) => {
      const possible = question.points || 1;
      if (question.reviewRequired) return { score: score.score, possible: score.possible + possible };
      if (question.customScore === "modeMean") {
        return { score: score.score + scoreModeMean(question), possible: score.possible + possible };
      }
      const questionScore = getQuestionParts(question).reduce((sum, part) => {
        const response = normalizeAnswer(getPartAnswer(question.id, part.id));
        const accepted = (part.accepted || []).map(normalizeAnswer);
        return sum + (response && accepted.includes(response) ? Number(part.points || 0) : 0);
      }, 0);
      return { score: score.score + questionScore, possible: score.possible + possible };
    }, { score: 0, possible: 0 });
  }

  function scoreModeMean(question) {
    const values = question.parts.map((part) => Number(getPartAnswer(question.id, part.id))).filter((value) => Number.isFinite(value));
    if (values.length !== 3) return 0;
    const sorted = [...values].sort((a, b) => a - b).join(",");
    if (sorted === "6,6,9") return 2;
    const counts = new Map(values.map((value) => [value, values.filter((item) => item === value).length]));
    const hasMode6 = counts.get(6) >= 2;
    const hasMean7 = values.reduce((sum, value) => sum + value, 0) === 21;
    return hasMode6 || hasMean7 ? 1 : 0;
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
    return question.parts || question.rows || question.pairs || [];
  }

  function isQuestionAnswered(question) {
    const answer = state.answers[question.id];
    if (!answer || typeof answer !== "object") return Boolean(cleanText(answer));
    return Object.values(answer).some((value) => cleanText(value));
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

  function normalizeAnswer(value) {
    return cleanText(value).toLowerCase().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",");
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
