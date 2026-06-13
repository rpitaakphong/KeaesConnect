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
      renderReport(normalizeResult(row));
    } catch (err) {
      renderError(`Could not load report: ${err.message}`);
    }
  });

  function renderReport(result) {
    const registry = buildReportRegistry();
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
    if (!details || typeof details !== "object" || !("contentScore" in details)) return "";
    return `
      <div class="feedback">
        <strong>AI writing feedback</strong>
        <p>Content: ${formatScore(details.contentScore)}/0.5 · Writing: ${formatScore(details.writingScore)}/0.5</p>
        ${details.feedback ? `<p>${escapeHtml(details.feedback)}</p>` : ""}
      </div>
    `;
  }

  function buildReportRegistry() {
    return {
      "starter-progress-test": starterRegistry(),
      "starter-progress-listening": starterRegistry(),
      "english-literacy-1": englishLevel1Registry(),
      "english-literacy-2": englishLevel2Registry(),
      "english-literacy-3": readingRegistry("el3", 21, 30, "Cola History", "../english-literacy/level-3/assets/cola-bottle.svg", colaStory()),
      "english-literacy-4": readingRegistry("el4", 21, 30, "Dolphins", "../english-literacy/level-4/assets/dolphin.svg", dolphinStory()),
      "english-literacy-5": readingRegistry("el5", 26, 30, "World's Largest Seal", "../english-literacy/level-5/assets/elephant-seal.svg", sealStory()),
    };
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
})();
