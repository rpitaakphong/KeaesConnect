(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const attemptId = params.get("attemptId") || "";
  const root = () => document.querySelector("[data-report-root]");

  document.addEventListener("DOMContentLoaded", async () => {
    document.querySelector("[data-print-report]")?.addEventListener("click", () => window.print());
    if (!window.KeaesApi?.isConfigured()) {
      renderError("Supabase is not configured. Open Test Admin after configuring Supabase.");
      return;
    }
    await window.KeaesApi.requireStaffSession("../../login.html");
    if (!attemptId) {
      renderError("This report link is missing an attempt id.");
      return;
    }
    try {
      const row = await window.KeaesApi.getResult(attemptId);
      const result = normalizeResult(row);
      const registry = await buildReportRegistry(result.testId);
      renderReport(result, registry);
    } catch (err) {
      renderError(`Could not load report: ${err.message}`);
    }
  });

  function renderReport(result, registry) {
    const testContent = registry[result.testId] || {};
    const answers = result.answers.map((answer, index) => enrichAnswer(result.testId, {
      ...answer,
      questionId: answer.questionId || inferQuestionId(result.testId, index),
      displayNumber: index + 1,
    }, testContent));
    const reviewAnswers = answers.filter(needsReview);
    root().innerHTML = `
      <section class="report-cover">
        <div>
          <p class="eyebrow">Student test report</p>
          <h1>${escapeHtml(result.testTitle)}</h1>
        </div>
        <div class="report-meta">
          ${metaCard("Student", result.student.fullName)}
          ${metaCard("Nickname", result.student.nickname)}
          ${metaCard("Date of birth", result.student.dateOfBirth)}
          ${metaCard("Subject", result.student.subject)}
          ${metaCard("Level", result.student.level)}
          ${metaCard("Submitted", formatDate(result.submittedAt))}
        </div>
        <div class="score-grid">
          ${scoreCard("Total score", `${formatScore(result.score.total)}/${formatScore(result.score.possible)}`)}
          ${scoreCard("Percent", `${result.score.percent}%`)}
          ${scoreCard("Questions", String(result.answers.length))}
        </div>
      </section>

      <section class="report-section">
        <h2>Part Scores</h2>
        <div class="part-score-grid">
          ${result.partScores.map((part) => `
            <div class="part-score">
              <span>${escapeHtml(part.part)}</span>
              <strong>${formatScore(part.total)}/${formatScore(part.possible)}</strong>
            </div>
          `).join("") || "<p>No part scores available.</p>"}
        </div>
      </section>

      <section class="report-section">
        <h2>Question Score Summary</h2>
        ${renderQuestionSummary(answers)}
      </section>

      <section class="report-section">
        <h2>Review of Mistakes</h2>
        ${reviewAnswers.length ? renderMistakeReview(reviewAnswers) : `<p class="empty-note">All questions were answered correctly.</p>`}
      </section>
    `;
    document.title = `${result.student.fullName} - ${result.testTitle} Report`;
  }

  function enrichAnswer(testId, answer, testContent) {
    const question = testContent.questions?.[answer.questionId] || {};
    const partMaterial = testContent.partMaterials?.[answer.part] || {};
    return {
      ...answer,
      question,
      materials: mergeMaterials(partMaterial, question.materials || {}),
    };
  }

  function inferQuestionId(testId, index) {
    const position = index + 1;
    if (testId.startsWith("math-olympiad-")) {
      const level = testId.replace("math-olympiad-", "");
      return `mo${level}-q${position}`;
    }
    if (testId.startsWith("english-literacy-")) {
      const level = testId.replace("english-literacy-", "");
      return `el${level}-q${position}`;
    }
    if (position <= 5) return `p1q${position}`;
    if (position <= 10) return `p2q${position - 5}`;
    if (position <= 15) return `p3q${position - 10}`;
    if (position <= 20) return `p4q${position - 15}`;
    if (position <= 25) return `rw1q${position - 20}`;
    if (position <= 30) return `rw2q${position - 25}`;
    if (position <= 35) return `rw3q${position - 30}`;
    if (position <= 40) return `rw4q${position - 35}`;
    if (position <= 45) return `rw5q${position - 40}`;
    return "";
  }

  function mergeMaterials(partMaterial, questionMaterial) {
    return {
      storyTitle: questionMaterial.storyTitle || partMaterial.storyTitle || "",
      story: questionMaterial.story || partMaterial.story || "",
      images: [...(partMaterial.images || []), ...(questionMaterial.images || [])],
      choices: questionMaterial.choices || [],
      note: questionMaterial.note || partMaterial.note || "",
    };
  }

  function needsReview(answer) {
    const possible = Number(answer.possible ?? 1);
    const score = Number(answer.score ?? (answer.correct ? possible : 0));
    return !answer.correct || score < possible;
  }

  function renderQuestionSummary(answers) {
    if (!answers.length) return `<p class="empty-note">No answer details available.</p>`;
    return `
      <div class="summary-table-wrap">
        <table class="summary-table">
          <thead>
            <tr>
              <th>Q</th>
              <th>Part</th>
              <th>Question</th>
              <th>Student answer</th>
              <th>Correct answer / rubric</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${answers.map(renderSummaryRow).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderSummaryRow(answer) {
    const review = needsReview(answer);
    return `
      <tr class="${review ? "needs-review" : "is-correct"}">
        <td>${answer.displayNumber}</td>
        <td>${escapeHtml(answer.part || "-")}</td>
        <td>${escapeHtml(answer.prompt || "-")}</td>
        <td>${escapeHtml(answer.response || "No answer")}</td>
        <td>${escapeHtml(answer.correctAnswer || "Not available")}</td>
        <td>${formatAnswerScore(answer)}</td>
        <td><span class="status-pill ${review ? "is-wrong" : "is-correct"}">${review ? "Review" : "Correct"}</span></td>
      </tr>
    `;
  }

  function renderMistakeReview(answers) {
    return Object.entries(groupByPart(answers)).map(([part, partAnswers]) => {
      const sharedMaterials = getSharedMaterials(partAnswers);
      return `
        <article class="part-review">
          <div class="part-review-head">
            <p class="eyebrow">${escapeHtml(part)}</p>
            <h3>${partAnswers.length} question${partAnswers.length === 1 ? "" : "s"} to review</h3>
          </div>
          ${sharedMaterials ? renderMaterials(sharedMaterials, true) : ""}
          <div class="review-list">
            ${partAnswers.map((answer) => renderReviewItem(answer, Boolean(sharedMaterials))).join("")}
          </div>
        </article>
      `;
    }).join("");
  }

  function renderReviewItem(answer, hasSharedMaterials) {
    return `
      <article class="review-item">
        <div class="review-head">
          <div>
            <span class="question-number">Question ${answer.displayNumber}</span>
            <h4>${escapeHtml(answer.prompt || "-")}</h4>
          </div>
          <span class="status-pill is-wrong">Needs review</span>
        </div>
        ${hasSharedMaterials ? "" : renderMaterials(answer.materials, true)}
        <div class="answer-grid compact-answer-grid">
          ${answerCard("Student answer", answer.response || "No answer")}
          ${answerCard("Correct answer / rubric", answer.correctAnswer || "Not available")}
          ${answerCard("Score", formatAnswerScore(answer))}
        </div>
        ${renderGradingDetails(answer.gradingDetails)}
      </article>
    `;
  }

  function groupByPart(answers) {
    return answers.reduce((groups, answer) => {
      const key = answer.part || "Questions";
      groups[key] = groups[key] || [];
      groups[key].push(answer);
      return groups;
    }, {});
  }

  function getSharedMaterials(answers) {
    if (!answers.length) return null;
    const first = answers[0].materials;
    if (!hasMaterials(first)) return null;
    const firstSignature = materialSignature(first);
    const allSame = answers.every((answer) => materialSignature(answer.materials) === firstSignature);
    return allSame ? first : null;
  }

  function hasMaterials(materials) {
    return Boolean(materials?.story || materials?.images?.length || materials?.choices?.length || materials?.note);
  }

  function materialSignature(materials) {
    return JSON.stringify({
      storyTitle: materials?.storyTitle || "",
      story: materials?.story || "",
      note: materials?.note || "",
      choices: materials?.choices || [],
      images: (materials?.images || []).map((image) => ({
        src: image.src,
        label: image.label,
        wide: Boolean(image.wide),
      })),
    });
  }

  function renderMaterials(materials, compact = false) {
    if (!materials.story && !materials.images.length && !materials.choices.length && !materials.note) return "";
    return `
      <div class="question-material ${compact ? "is-compact" : ""}">
        ${materials.note ? `<p>${escapeHtml(materials.note)}</p>` : ""}
        ${materials.story ? `
          <div>
            ${materials.storyTitle ? `<strong>${escapeHtml(materials.storyTitle)}</strong>` : ""}
            <p class="story-block">${escapeHtml(materials.story)}</p>
          </div>
        ` : ""}
        ${materials.images.length ? `
          <div class="image-grid">
            ${materials.images.map(renderImage).join("")}
          </div>
        ` : ""}
        ${materials.choices.length ? `
          <div class="choices-list">
            ${materials.choices.map((choice) => `<span class="choice-chip">${escapeHtml(choice)}</span>`).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderImage(image) {
    const wide = image.wide ? "wide-image" : "";
    return `
      <figure class="image-card">
        <img class="${wide}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || image.label || "Question image")}">
        ${image.label ? `<figcaption>${escapeHtml(image.label)}</figcaption>` : ""}
      </figure>
    `;
  }

  function renderGradingDetails(details) {
    if (details?.parts?.length) {
      return `
        <div class="feedback">
          <strong>Subpart scoring</strong>
          <p>${details.parts.map((part) => `${escapeHtml(part.id)}: ${formatScore(part.score)}/${formatScore(part.possible)}`).join(" · ")}</p>
        </div>
      `;
    }
    if (!details || typeof details !== "object" || !("contentScore" in details)) return "";
    return `
      <div class="feedback">
        <strong>AI writing feedback</strong>
        <p>Content: ${formatScore(details.contentScore)}/0.5 · Writing: ${formatScore(details.writingScore)}/0.5</p>
        ${details.feedback ? `<p>${escapeHtml(details.feedback)}</p>` : ""}
      </div>
    `;
  }

  async function buildReportRegistry(testId) {
    const registry = {
      "starter-progress-test": starterRegistry(),
      "starter-progress-listening": starterRegistry(),
      "english-literacy-1": englishLevel1Registry(),
      "english-literacy-2": englishLevel2Registry(),
      "english-literacy-3": readingRegistry("el3", 21, 30, "Cola History", "../english-literacy/level-3/assets/cola-bottle.svg", colaStory()),
      "english-literacy-4": readingRegistry("el4", 21, 30, "Dolphins", "../english-literacy/level-4/assets/dolphin.svg", dolphinStory()),
      "english-literacy-5": readingRegistry("el5", 26, 30, "World's Largest Seal", "../english-literacy/level-5/assets/elephant-seal.svg", sealStory()),
      "math-olympiad-1": mathLevel1Registry(),
    };
    if (testId?.startsWith("math-olympiad-") && !registry[testId]) {
      registry[testId] = await mathOlympiadRegistryFromConfig(testId);
    }
    return registry;
  }

  async function mathOlympiadRegistryFromConfig(testId) {
    const level = testId.replace("math-olympiad-", "");
    try {
      const response = await fetch(`../math-olympiad/level-${level}/config.js?v=math-olympiad-2-5`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      const sandbox = {};
      new Function("window", source)(sandbox);
      return mathOlympiadRegistryFromData(sandbox.MathOlympiadData);
    } catch {
      return mathOlympiadGenericRegistry(`mo${level}`, `Math Olympiad Level ${level}`);
    }
  }

  function mathOlympiadRegistryFromData(data) {
    if (!data?.parts?.length) return { questions: {} };
    const level = String(data.testId || "").replace("math-olympiad-", "");
    const basePath = level ? `../math-olympiad/level-${level}/` : "";
    const questions = {};
    data.parts.flatMap((part) => part.questions || []).forEach((question) => {
      const materialImages = [];
      if (question.visualHtml?.trim().startsWith("<svg")) {
        materialImages.push(img(svgData(question.visualHtml), `Question ${question.number} visual`, true));
      }
      const questionImage = imageFromHtml(question.visualHtml, basePath, `Question ${question.number} visual`);
      if (questionImage) materialImages.push(questionImage);
      (question.fields || [])
        .filter((field) => field.visualHtml?.trim().startsWith("<svg"))
        .forEach((field) => materialImages.push(img(svgData(field.visualHtml), field.label)));
      (question.fields || [])
        .map((field) => imageFromHtml(field.visualHtml, basePath, field.label))
        .filter(Boolean)
        .forEach((fieldImage) => materialImages.push(fieldImage));
      const choiceImages = (question.choices || [])
        .filter((choice) => choice.visualHtml?.trim().startsWith("<svg"))
        .map((choice) => img(svgData(choice.visualHtml), `Choice ${choice.label}`));
      questions[question.id] = {
        materials: {
          note: question.note || "",
          images: [...materialImages, ...choiceImages],
          choices: (question.choices || []).map((choice) => choice.label),
        },
      };
    });
    return { questions };
  }

  function imageFromHtml(html, basePath, fallbackAlt) {
    const source = String(html || "");
    if (!source.trim().startsWith("<img")) return null;
    const src = source.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src) return null;
    const alt = source.match(/\balt=["']([^"']*)["']/i)?.[1] || fallbackAlt;
    const resolvedSrc = src.startsWith("http") || src.startsWith("/") ? src : `${basePath}${src}`;
    return img(resolvedSrc, alt, true);
  }

  function mathOlympiadGenericRegistry(prefix, title) {
    const questions = {};
    for (let number = 1; number <= 15; number += 1) {
      questions[`${prefix}-q${number}`] = {
        materials: {
          note: `${title} question ${number} is rendered as a generated web-native math activity in the student test.`,
          images: [img(svgData(genericMathQuestionSvg(title, number)), `${title} question ${number}`, true)],
        },
      };
    }
    return { questions };
  }

  function genericMathQuestionSvg(title, number) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 160"><rect width="620" height="160" rx="18" fill="#fff"/><rect x="22" y="22" width="576" height="116" rx="16" fill="#eefbf8" stroke="#203948" stroke-width="3"/><text x="52" y="72" font-family="Inter,Arial" font-size="26" font-weight="800" fill="#203948">${escapeXml(title)}</text><text x="52" y="112" font-family="Inter,Arial" font-size="24" font-weight="800" fill="#008f9c">Question ${number}</text><path d="M430 54h96v52h-96zM454 80h48M478 56v48" fill="none" stroke="#203948" stroke-width="4" stroke-linecap="round"/></svg>`;
  }

  function mathLevel1Registry() {
    const questions = {};
    const visuals = {
      1: ["Number path", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 130"><rect width="620" height="130" fill="#fff"/><g fill="#fff" stroke="#203948" stroke-width="4"><rect x="20" y="30" width="70" height="70"/><rect x="125" y="30" width="70" height="70"/><rect x="230" y="30" width="70" height="70"/><rect x="335" y="30" width="70" height="70"/><rect x="440" y="30" width="70" height="70"/><rect x="545" y="30" width="70" height="70"/></g><g stroke="#203948" stroke-width="4"><line x1="90" y1="65" x2="125" y2="65"/><line x1="195" y1="65" x2="230" y2="65"/><line x1="300" y1="65" x2="335" y2="65"/><line x1="405" y1="65" x2="440" y2="65"/><line x1="510" y1="65" x2="545" y2="65"/></g><g font-family="Inter,Arial" font-size="34" font-weight="800" text-anchor="middle" fill="#203948"><text x="55" y="77">4</text><text x="265" y="77">6</text><text x="475" y="77">8</text></g></svg>`],
      2: ["Notebooks and number bond", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220"><rect width="640" height="220" fill="#fff"/><g stroke="#203948" stroke-width="4"><g fill="#a9bccb"><rect x="55" y="38" width="58" height="72" rx="6" transform="rotate(-12 84 74)"/><rect x="135" y="38" width="58" height="72" rx="6" transform="rotate(-12 164 74)"/><rect x="215" y="38" width="58" height="72" rx="6" transform="rotate(-12 244 74)"/></g><rect x="60" y="138" width="58" height="72" rx="6" fill="#fff" transform="rotate(-12 89 174)"/><rect x="400" y="80" width="62" height="62" fill="#fff"/><rect x="540" y="35" width="62" height="62" fill="#fff"/><rect x="540" y="125" width="62" height="62" fill="#fff"/><line x1="462" y1="111" x2="540" y2="66"/><line x1="462" y1="111" x2="540" y2="156"/></g><text x="431" y="122" font-family="Inter,Arial" font-size="34" font-weight="800" text-anchor="middle" fill="#203948">4</text></svg>`],
      3: ["Five oranges", objectRow("orange", 5)],
      4: ["Five cakes with two burnt", objectRow("cake", 5)],
      5: ["Square selection row", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 150"><rect width="720" height="150" fill="#fff"/><rect x="20" y="20" width="680" height="100" fill="#fff" stroke="#203948" stroke-width="4"/><line x1="170" y1="20" x2="170" y2="120" stroke="#203948" stroke-width="4"/><text x="95" y="82" font-family="Inter,Arial" font-size="30" font-weight="800" text-anchor="middle" fill="#203948">Square</text><path d="M230 40l32 58h-64z" fill="none" stroke="#203948" stroke-width="4"/><rect x="292" y="52" width="40" height="40" fill="none" stroke="#203948" stroke-width="4"/><rect x="368" y="34" width="38" height="72" fill="none" stroke="#203948" stroke-width="4"/><rect x="460" y="46" width="48" height="48" transform="rotate(-9 484 70)" fill="none" stroke="#203948" stroke-width="4"/><circle cx="570" cy="70" r="30" fill="none" stroke="#203948" stroke-width="4"/><path d="M630 40h58l-29 58z" fill="none" stroke="#203948" stroke-width="4"/></svg>`],
      6: ["Triangles A-F", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 130"><rect width="640" height="130" fill="#fff"/><g font-family="Inter,Arial" font-size="30" font-weight="800" text-anchor="middle" fill="#203948">${["A","B","C","D","E","F"].map((letter, index) => `<path d="M${70 + index * 100} 22l45 78h-90z" fill="#fff" stroke="#203948" stroke-width="4"/><text x="${70 + index * 100}" y="77">${letter}</text>`).join("")}</g></svg>`],
      7: ["Beads", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 190"><rect width="520" height="190" fill="#fff"/><g fill="none" stroke="#203948" stroke-width="3"><path d="M30 42c80 20 160 8 250 30"/><path d="M28 92c76 8 166-18 260 4"/><path d="M35 142c60 12 130 2 190 8"/></g><g fill="#fff" stroke="#203948" stroke-width="4">${[58,104,150,196,242].map((x)=>`<circle cx="${x}" cy="52" r="17"/>`).join("")}${[55,101,147,193,239].map((x)=>`<circle cx="${x}" cy="95" r="17"/>`).join("")}${[72,118,164,210].map((x)=>`<circle cx="${x}" cy="145" r="17"/>`).join("")}<circle cx="345" cy="95" r="17"/><circle cx="395" cy="95" r="17"/></g></svg>`],
      8: ["Pencil length grid", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 260"><rect width="720" height="260" fill="#fff"/><rect x="45" y="25" width="610" height="210" fill="#f8faf9" stroke="#203948" stroke-width="3"/>${Array.from({length:11},(_,i)=>`<line x1="${45+i*61}" y1="25" x2="${45+i*61}" y2="235" stroke="#203948" stroke-width="1.5"/>`).join("")}<line x1="45" y1="95" x2="655" y2="95" stroke="#203948"/><line x1="45" y1="165" x2="655" y2="165" stroke="#203948"/><g stroke="#203948" stroke-width="4" fill="#fff"><path d="M120 70h250l70 14-70 14H120z"/><path d="M165 140h380l70 14-70 14H165z"/><path d="M55 205h250l70 14-70 14H55z"/></g><g font-family="Inter,Arial" font-size="34" font-weight="800" fill="#203948"><text x="465" y="98">A</text><text x="630" y="168">B</text><text x="395" y="232">C</text></g></svg>`],
      10: ["Book pictograph", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300"><rect width="760" height="300" fill="#fff"/><g stroke="#203948" stroke-width="3" fill="none"><rect x="20" y="20" width="720" height="240"/><line x1="190" y1="20" x2="190" y2="260"/><line x1="20" y1="80" x2="740" y2="80"/><line x1="20" y1="140" x2="740" y2="140"/><line x1="20" y1="200" x2="740" y2="200"/></g><g font-family="Inter,Arial" font-size="23" font-weight="800" fill="#203948"><text x="35" y="55">Chinese Literature</text><text x="35" y="116">English Literature</text><text x="35" y="176">Malay Literature</text><text x="35" y="236">Bedtime story</text></g>${bookSymbols(215,45,7)}${bookSymbols(215,105,3)}${bookSymbols(215,165,4)}${bookSymbols(215,225,3)}</svg>`],
      11: ["Base-ten subtraction", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 240"><rect width="650" height="240" fill="#fff"/><rect x="20" y="20" width="610" height="190" fill="#fff" stroke="#203948" stroke-width="4"/>${smallBlocks(410,45,6,2)}${smallBlocks(270,105,16,2)}${smallBlocks(65,155,26,2)}</svg>`],
      12: ["Two groups of four triangles", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170"><rect width="320" height="170" fill="#fff"/><path d="M30 35c75 30 185 30 255 0M30 105c75 30 185 30 255 0" fill="none" stroke="#203948" stroke-width="4"/><g fill="#203948">${[72,116,160,204].map((x)=>`<path d="M${x} 44l20 38h-40z"/>`).join("")}${[72,116,160,204].map((x)=>`<path d="M${x} 114l20 38h-40z"/>`).join("")}</g></svg>`],
      13: ["Six pears", objectRow("pear", 6)],
      14: ["Family and clock", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 260"><rect width="620" height="260" fill="#fff"/><g stroke="#203948" stroke-width="4"><path d="M190 30h80v180h-80z" fill="#fff"/><path d="M190 30l80-24v180l-80 24z" fill="#eef7f5"/></g><g fill="#fff7df" stroke="#203948" stroke-width="3">${[55,95,135,170,75,120].map((x,i)=>`<circle cx="${x}" cy="${i>3?175:125}" r="18"/>`).join("")}</g><g transform="translate(360 45)"><circle cx="80" cy="80" r="70" fill="#fff" stroke="#203948" stroke-width="4"/><g font-family="Inter,Arial" font-size="12" font-weight="800" text-anchor="middle">${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2; const x=80+Math.sin(a)*54; const y=80-Math.cos(a)*54+4; return `<text x="${x}" y="${y}">${i===0?12:i}</text>`;}).join("")}</g><line x1="80" y1="80" x2="80" y2="130" stroke="#203948" stroke-width="5" stroke-linecap="round"/><line x1="80" y1="80" x2="48" y2="42" stroke="#203948" stroke-width="5" stroke-linecap="round"/></g></svg>`],
    };
    Object.entries(visuals).forEach(([number, [label, svg]]) => {
      questions[`mo1-q${number}`] = imageQuestion(svgData(svg), label, true);
    });
    return { questions };
  }

  function starterRegistry() {
    const questions = {};
    for (let i = 1; i <= 5; i += 1) {
      questions[`p1q${i}`] = { materials: { images: [img("../starter-listening/assets/part1-board.png", "Listening Part 1 board", true)] } };
      questions[`p2q${i}`] = { materials: { images: [img("../starter-listening/assets/part2-illustration.png", "Listening Part 2 illustration", true)] } };
      questions[`p4q${i}`] = { materials: { images: [img("../starter-listening/assets/part4-scene.png", "Listening Part 4 coloring scene", true)] } };
    }
    for (let q = 1; q <= 5; q += 1) {
      questions[`p3q${q}`] = {
        materials: {
          choices: ["A", "B", "C"],
          images: ["a", "b", "c"].map((letter) => img(`../starter-listening/assets/part3-q${q}-${letter}.png`, `Option ${letter.toUpperCase()}`)),
        },
      };
    }
    Object.assign(questions, {
      rw1q1: imageQuestion("../starter-listening/assets/rw-p1-lizard.jpg", "Lizard picture"),
      rw1q2: imageQuestion("../starter-listening/assets/rw-p1-bike.jpg", "Bike picture"),
      rw1q3: imageQuestion("../starter-listening/assets/rw-p1-pineapple.jpg", "Pineapple picture"),
      rw1q4: imageQuestion("../starter-listening/assets/rw-p1-phone.jpg", "Phone picture"),
      rw1q5: imageQuestion("../starter-listening/assets/rw-p1-guitar.jpg", "Guitar picture"),
      rw2q1: imageQuestion("../starter-listening/assets/rw-p2-beach.jpg", "Beach scene", true),
      rw2q2: imageQuestion("../starter-listening/assets/rw-p2-beach.jpg", "Beach scene", true),
      rw2q3: imageQuestion("../starter-listening/assets/rw-p2-beach.jpg", "Beach scene", true),
      rw2q4: imageQuestion("../starter-listening/assets/rw-p2-beach.jpg", "Beach scene", true),
      rw2q5: imageQuestion("../starter-listening/assets/rw-p2-beach.jpg", "Beach scene", true),
      rw3q1: imageQuestion("../starter-listening/assets/rw-p3-jeans.jpg", "Blue trousers"),
      rw3q2: imageQuestion("../starter-listening/assets/rw-p3-shoes.jpg", "Purple shoes"),
      rw3q3: imageQuestion("../starter-listening/assets/rw-p3-jacket.jpg", "Green jacket"),
      rw3q4: imageQuestion("../starter-listening/assets/rw-p3-handbag.jpg", "Handbag"),
      rw3q5: imageQuestion("../starter-listening/assets/rw-p3-trousers.jpg", "Green trousers"),
    });
    for (let i = 1; i <= 5; i += 1) {
      questions[`rw4q${i}`] = {
        materials: {
          choices: ["hippo", "water", "carrots", "hair", "man", "house", "piano"],
          images: ["hippo", "water", "carrots", "hair", "man", "house", "piano"].map((name) => img(`../starter-listening/assets/rw-p4-${name}.jpg`, name)),
        },
      };
      questions[`rw5q${i}`] = {
        materials: {
          images: [
            img("../starter-listening/assets/rw-p5-classroom-1.jpg", "Classroom picture 1", true),
            img("../starter-listening/assets/rw-p5-classroom-2.jpg", "Classroom picture 2", true),
            img("../starter-listening/assets/rw-p5-classroom-3.jpg", "Classroom picture 3", true),
          ],
        },
      };
    }
    return { questions };
  }

  function englishLevel1Registry() {
    const questions = {};
    const imageText = {
      6: ["q6-truck-color.png", "Truck"],
      7: ["q7-crab-color.png", "Crab"],
      8: ["q8-flag-color.png", "Flag"],
      9: ["q9-glue-color.png", "Glue"],
      10: ["q10-oven-color.png", "Oven"],
      11: ["q11-clock-color.png", "Clock"],
      12: ["q12-crown-color.png", "Crown"],
      13: ["q13-broom-color.png", "Broom"],
      14: ["q14-frog-color.png", "Frog"],
      15: ["q15-spoon-color.png", "Spoon"],
    };
    Object.entries(imageText).forEach(([number, [file, label]]) => {
      questions[`el1-q${number}`] = imageQuestion(`../english-literacy/level-1/assets/${file}`, label);
    });
    const imageChoices = {
      16: [["q16-star-color.png", "Star"], ["q16-cloud-color.png", "Cloud"], ["q16-car-color.png", "Car"]],
      17: [["q17-coin-color.png", "Coin"], ["q17-toys-color.png", "Toys"], ["q17-boy-color.png", "Boy"]],
      18: [["q18-glass-color.png", "Glass"], ["q18-grass-color.png", "Grass"], ["q18-boat-color.png", "Boat"]],
      19: [["q19-mouse-color.png", "Mouse"], ["q19-house-color.png", "House"], ["q19-dog-color.png", "Dog"]],
      20: [["q20-honey-color.png", "Honey"], ["q20-bee-color.png", "Bee"], ["q20-money-color.png", "Money"]],
    };
    Object.entries(imageChoices).forEach(([number, items]) => {
      questions[`el1-q${number}`] = {
        materials: {
          images: items.map(([file, label]) => img(`../english-literacy/level-1/assets/${file}`, label)),
        },
      };
    });
    const story = "It's Arbor Day, and Marla and Tio are planting a tree in their backyard. Their parents are watching TV in the living room and they don't know what the children are doing. Marla and Tio learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.";
    for (let i = 26; i <= 30; i += 1) questions[`el1-q${i}`] = { materials: { storyTitle: "Arbor Day", story } };
    return { questions };
  }

  function englishLevel2Registry() {
    const questions = {};
    const images = {
      6: ["q6-trucks.png", "Trucks"],
      7: ["q7-boxes.png", "Boxes"],
      8: ["q8-tomatoes.png", "Tomatoes"],
      9: ["q9-keys.png", "Keys"],
    };
    Object.entries(images).forEach(([number, [file, label]]) => {
      questions[`el2-q${number}`] = imageQuestion(`../english-literacy/level-2/assets/${file}`, label);
    });
    const story = "Rima wanted a beautiful garden. A lady gave her saplings and seeds of flower plants. Rima planted them, watered them, and cared for them. When flowers grew, she sold some flowers and saved money. The plants helped her earn money and improve her life.";
    for (let i = 21; i <= 24; i += 1) questions[`el2-q${i}`] = { materials: { storyTitle: "Rima's Garden", story } };
    return { questions };
  }

  function readingRegistry(prefix, firstQuestion, lastQuestion, storyTitle, imageSrc, story) {
    const questions = {};
    for (let i = firstQuestion; i <= lastQuestion; i += 1) {
      questions[`${prefix}-q${i}`] = {
        materials: {
          storyTitle,
          story,
          images: [img(imageSrc, storyTitle, true)],
        },
      };
    }
    return { questions };
  }

  function colaStory() {
    return [
      "In May, 1886, Coca Cola was invented by Doctor John Pemberton, a pharmacist from Atlanta, Georgia. John Pemberton concocted the Coca Cola formula in a three-legged brass kettle in his backyard. The name was a suggestion given by John Pemberton's bookkeeper Frank Robinson. Being a bookkeeper, Frank Robinson also had excellent penmanship. It was he who first scripted \"Coca Cola\" into the flowing letters which has become the famous logo of today.",
      "The soft drink was first sold to the public at the soda fountain in Jacob's Pharmacy in Atlanta on May 8, 1886. About nine servings of the soft drink were sold each day. Sales for that first year added up to a total of about $50. The funny thing was that it cost John Pemberton over $70 in expenses, so the first year of sales were a loss. Until 1905, the soft drink, marketed as a tonic, contained extracts of cocaine as well as the caffeine-rich kola nut.",
    ].join("\n\n");
  }

  function dolphinStory() {
    return [
      "Dolphins are very intelligent and they seem to be well loved by humans. This aquatic mammal has been able to fascinate us in a variety of ways. They are curious, form strong bonds within their pod, and they have been known to help humans in a variety of circumstances including rescues and with fishing.",
      "There are 36 different species of dolphins that have been recognized. 32 of them are marine dolphins which are those that we are the most aware of and 4 of them are river dolphins. It can be very interesting to look at each of these species uniquely versus dolphins as a whole.",
      "They are very entertaining due to the leaps that they make out of the water. Some of them leap up to 30 feet in the air as they do so. They have to come to the surface at different intervals to get air. This can be from 20 seconds to 30 minutes between when they get air. The body of the dolphin is grayish blue and the skin is very sensitive to human touch and to other elements that could be in the water.",
      "The future is at risk for the various species of dolphins though due to habitat destruction, problems finding food, pollutants in the water, and even injuries or death due to getting tangled up in fishing nets or hitting boats in the water. There are conservation efforts in place out there to help protect them so that they can have a very good future. The average lifespan for a dolphin in the wild is 17 years. However, some have been documented to live to the age of 50!",
    ].join("\n\n");
  }

  function sealStory() {
    return [
      "In the freezing ocean waters of Antarctica, the planet's largest seals make their home in a frozen world. These giants are southern elephant seals, and they can grow as long as the length of a car and weigh as much as two cars combined. The name \"elephant seal\" comes from both the males' enormous size and from their giant trunk-like nose, called a proboscis. Females do not have a proboscis and they are much smaller.",
      "A thick layer of blubber keeps southern elephant seals warm in their icy habitat. The seals are clumsy on land, but in water they're graceful swimmers and incredible divers. They can easily dive 1,000 to 4,000 feet to hunt for squid, octopus, and various kinds of fish. Elephant seals are able to stay underwater for 20 minutes or more. The longest underwater session researchers observed is an amazing two hours! When they return to the surface to breathe, it's only for a few minutes. Then they dive again.",
      "While elephant seals spend most of their time swimming, they also gather on beaches in groups called colonies. One reason they come to land is to give birth and breed. Males arrive before females. They battle for dominance, deciding who will have large harems of females. Raising their enormous bodies, the males inflate their snouts and bellow. Usually these confrontations end quickly. However, sometimes only a physical battle can settle the matter. These fights can be bloody, but permanent injury is rare.",
      "Females arriving on land give birth to a single pup they've been carrying since the previous year. Newborns weigh about 90 pounds. The mother nurses her pup for a little over three weeks. After this, she breeds with a dominant male and then returns to the sea to feed. Her pup now weighs well over 200 pounds and is on its own. If it survives, it too will enter the sea within a couple of months.",
      "A second reason elephant seals come to land is to molt. When they molt, they shed old skin and fur and new skin and fur grows. A smaller species, the northern elephant seal, lives in the Pacific Ocean, dispersed from Baja, California to Alaska. Both northern and southern elephant seals were once hunted nearly to extinction. However, under legal protections both have made incredible comebacks.",
    ].join("\n\n");
  }

  function imageQuestion(src, label, wide = false) {
    return { materials: { images: [img(src, label, wide)] } };
  }

  function img(src, label, wide = false) {
    return { src, label, alt: label, wide };
  }

  function svgData(svg) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function objectRow(kind, count) {
    const symbols = {
      orange: (x) => `<g><circle cx="${x}" cy="70" r="28" fill="#f59e0b" stroke="#203948" stroke-width="4"/><path d="M${x - 7} 42c12-14 20-8 20 3" stroke="#4d8c34" stroke-width="4" fill="none"/></g>`,
      cake: (x, i) => `<g transform="translate(${x} 80)"><ellipse cx="0" cy="-22" rx="30" ry="20" fill="${i > 2 ? "#374151" : "#fff7df"}" stroke="#203948" stroke-width="4"/><path d="M-30-22v36c10 12 50 12 60 0v-36" fill="${i > 2 ? "#8b5a2b" : "#f9c27b"}" stroke="#203948" stroke-width="4"/></g>`,
      pear: (x) => `<path d="M${x} 25c-2 12-13 14-17 34-4 21-15 31-6 45 10 15 36 15 46 0 9-14-3-24-7-45-4-20-15-22-16-34z" fill="#d9f2a3" stroke="#203948" stroke-width="4"/>`,
    };
    const width = Math.max(300, count * 88);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 140"><rect width="${width}" height="140" fill="#fff"/>${Array.from({ length: count }, (_, i) => symbols[kind](55 + i * 82, i)).join("")}</svg>`;
  }

  function bookSymbols(x, y, count) {
    return Array.from({ length: count }, (_, i) => {
      const bx = x + i * 56;
      return `<g transform="translate(${bx} ${y}) rotate(-12)"><path d="M0 0h34l14 16-34 8z" fill="#fff" stroke="#203948" stroke-width="2"/><path d="M0 0v22l14 10 34-16-34 8z" fill="#eef7f5" stroke="#203948" stroke-width="2"/></g>`;
    }).join("");
  }

  function smallBlocks(x, y, count, crossed) {
    return Array.from({ length: count }, (_, index) => {
      const bx = x + (index % 10) * 22;
      const by = y + Math.floor(index / 10) * 22;
      const cross = index >= count - crossed ? `<path d="M${bx + 1} ${by + 17}L${bx + 17} ${by + 1}" stroke="#203948" stroke-width="2"/>` : "";
      return `<g><rect x="${bx}" y="${by}" width="18" height="18" fill="#fff" stroke="#203948" stroke-width="2"/>${cross}</g>`;
    }).join("");
  }

  function normalizeResult(row) {
    return {
      id: row.attempt_id,
      testId: row.test_id,
      testTitle: row.test_title,
      student: {
        fullName: row.full_name,
        nickname: row.nickname,
        dateOfBirth: row.date_of_birth,
        subject: row.subject,
        level: row.level,
        testDate: row.test_date,
      },
      score: {
        total: row.score_total,
        possible: row.score_possible,
        percent: row.score_percent,
      },
      partScores: row.part_scores || [],
      answers: row.answers || [],
      submittedAt: row.submitted_at,
    };
  }

  function metaCard(label, value) {
    return `<div class="meta-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
  }

  function scoreCard(label, value) {
    return `<div class="score-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
  }

  function answerCard(label, value) {
    return `<div class="answer-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
  }

  function formatAnswerScore(answer) {
    const possible = answer.possible ?? 1;
    const score = answer.score ?? (answer.correct ? possible : 0);
    return `${formatScore(score)}/${formatScore(possible)}`;
  }

  function renderError(message) {
    root().innerHTML = `
      <section class="report-loading">
        <p class="eyebrow">Student report</p>
        <h1>Report unavailable</h1>
        <p>${escapeHtml(message)}</p>
      </section>
    `;
  }

  function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  }

  function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeXml(value) {
    return escapeHtml(value);
  }
})();
