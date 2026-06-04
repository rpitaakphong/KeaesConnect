const state = {
  currentPart: "part1",
  audioStarted: false,
  audioEnded: false,
  audioStartPending: false,
  studentReady: false,
  studentProfile: null,
  selectedObject: null,
  connections: {
    radio: "bookcase",
  },
  textAnswers: {},
  choices: {},
  colours: {
    exampleDuck: "#f59e0b",
  },
  activeColour: "#ef4444",
  submitted: false,
  savedResultId: null,
};

const RESULT_STORAGE_KEY = "keaes-test-results-v1";
const PROFILE_STORAGE_KEY = `keaes-test-profile-v1:${new URLSearchParams(window.location.search).get("testId") || "starter-progress-listening"}`;
const WINDOW_NAME_PROFILE_KEY = "__keaesTestProfilesV1";
const testMetadata = {
  id: new URLSearchParams(window.location.search).get("testId") || "starter-progress-listening",
  title: "Starter Progress Listening",
  subject: "English",
  level: "Cambridge Starters",
};

const answerKey = {
  part1: [
    {
      id: "p1q1",
      object: "clock",
      target: "between-pictures",
      prompt: "Put the clock between the two pictures.",
      transcript: "00:01:19",
    },
    {
      id: "p1q2",
      object: "book",
      target: "under-table",
      prompt: "Put the book under the small table.",
      transcript: "00:01:29",
    },
    {
      id: "p1q3",
      object: "phone",
      target: "rug",
      prompt: "Put the phone on the mat.",
      transcript: "00:01:45",
    },
    {
      id: "p1q4",
      object: "camera",
      target: "cupboard",
      prompt: "Put the camera in the cupboard.",
      transcript: "00:02:12",
    },
    {
      id: "p1q5",
      object: "shell",
      target: "robot",
      prompt: "Put the shell on the table next to the robot.",
      transcript: "00:02:28",
    },
  ],
  part2: [
    {
      id: "p2q1",
      prompt: "What is Lucy's friend's name?",
      accepted: ["Alex"],
      display: "Alex",
      transcript: "00:05:19",
    },
    {
      id: "p2q2",
      prompt: "Which class are the two children in at school?",
      accepted: ["8", "eight", "class 8", "class eight"],
      display: "8 / eight",
      transcript: "00:05:50",
    },
    {
      id: "p2q3",
      prompt: "How many dogs are there at Lucy's house?",
      accepted: ["3", "three"],
      display: "3 / three",
      transcript: "00:06:15",
    },
    {
      id: "p2q4",
      prompt: "What's the name of Lucy's favourite dog?",
      accepted: ["Socks"],
      display: "Socks",
      transcript: "00:06:42",
    },
    {
      id: "p2q5",
      prompt: "How many fish has Lucy's friend got?",
      accepted: ["12", "twelve"],
      display: "12 / twelve",
      transcript: "00:07:32",
    },
  ],
  part3: [
    { id: "p3q1", prompt: "Which is May?", correct: "a", display: "A", transcript: "00:10:34" },
    { id: "p3q2", prompt: "Which is Nick's favourite ice-cream?", correct: "b", display: "B", transcript: "00:11:03" },
    { id: "p3q3", prompt: "What's Ben doing?", correct: "b", display: "B", transcript: "00:11:34" },
    { id: "p3q4", prompt: "Where's Kim's doll?", correct: "c", display: "C", transcript: "00:11:56" },
    { id: "p3q5", prompt: "What's Dad doing?", correct: "a", display: "A", transcript: "00:12:22" },
  ],
  part4: [
    {
      id: "p4q1",
      region: "man-bird",
      colour: "#f472b6",
      prompt: "Bird on the man's head",
      display: "pink",
      transcript: "00:15:35",
    },
    {
      id: "p4q2",
      region: "tree-bird",
      colour: "#facc15",
      prompt: "Bird in the tree",
      display: "yellow",
      transcript: "00:16:05",
    },
    {
      id: "p4q3",
      region: "flying-bird",
      colour: "#22c55e",
      prompt: "Bird next to the plane",
      display: "green",
      transcript: "00:16:29",
    },
    {
      id: "p4q4",
      region: "standing-bird",
      colour: "#8b5a2b",
      prompt: "Bird in front of the door",
      display: "brown",
      transcript: "00:17:05",
    },
    {
      id: "p4q5",
      region: "flower-bird",
      colour: "#ef4444",
      prompt: "Bird between the flowers",
      display: "red",
      transcript: "00:17:54",
    },
  ],
};

const objects = {
  phone: { label: "Phone", x: 205, y: 245 },
  radio: { label: "Radio", x: 685, y: 245 },
  shell: { label: "Shell", x: 1115, y: 245 },
  book: { label: "Book", x: 1590, y: 235 },
  clock: { label: "Clock", x: 275, y: 2335 },
  camera: { label: "Camera", x: 910, y: 2340 },
  lamp: { label: "Lamp", x: 1605, y: 2315 },
};

const targets = {
  woman: { label: "woman in chair", x: 410, y: 1240 },
  "between-pictures": { label: "between the two pictures", x: 230, y: 820 },
  bookcase: { label: "bookcase", x: 860, y: 1240 },
  robot: { label: "table next to the robot", x: 1285, y: 1565 },
  "under-table": { label: "under the small table", x: 1185, y: 1765 },
  armchair: { label: "armchair", x: 300, y: 1765 },
  rug: { label: "mat", x: 690, y: 1825 },
  cupboard: { label: "cupboard", x: 1455, y: 1405 },
  door: { label: "door", x: 1835, y: 1185 },
};

const choiceQuestions = [
  {
    id: "p3q1",
    title: "1. Which is May?",
    options: ["a", "b", "c"],
  },
  {
    id: "p3q2",
    title: "2. Which is Nick's favourite ice-cream?",
    options: ["a", "b", "c"],
  },
  {
    id: "p3q3",
    title: "3. What's Ben doing?",
    options: ["a", "b", "c"],
  },
  {
    id: "p3q4",
    title: "4. Where's Kim's doll?",
    options: ["a", "b", "c"],
  },
  {
    id: "p3q5",
    title: "5. What's Dad doing?",
    options: ["a", "b", "c"],
  },
];

const colourRegions = {
  "tree-bird": "bird in the tree",
  "roof-bird": "bird on the roof",
  "flying-bird": "flying bird",
  "standing-bird": "bird near the house",
  "man-bird": "bird on the man's head",
  plane: "plane",
  "man-hat": "man's hat",
  "flower-bird": "bird between the flowers",
  "left-flower": "left flower",
  "right-flower": "right flower",
};

const assessedCounts = {
  part1: 5,
  part2: 5,
  part3: 5,
  part4: 5,
};

document.addEventListener("DOMContentLoaded", () => {
  if (!loadStudentProfile()) return;
  buildPart3();
  bindNavigation();
  bindAudio();
  bindPart1();
  bindPart2();
  bindPart4();
  bindSubmit();
  renderAll();
});

function loadStudentProfile() {
  const profile = readStudentProfile();
  if (!profile) {
    const landingUrl = new URL("index.html", window.location.href);
    landingUrl.searchParams.set("testId", testMetadata.id);
    window.location.replace(landingUrl.href);
    return false;
  }
  state.studentProfile = profile;
  state.studentReady = true;
  return true;
}

function readStudentProfile() {
  try {
    const stored = window.sessionStorage?.getItem(PROFILE_STORAGE_KEY);
    const profile = normalizeStudentProfile(JSON.parse(stored || "null"));
    if (profile) return profile;
  } catch {
    // Fall through to tab-local storage for restricted browser contexts.
  }
  return readWindowNameProfile();
}

function readWindowNameProfile() {
  try {
    const parsed = JSON.parse(window.name || "{}");
    return normalizeStudentProfile(parsed?.[WINDOW_NAME_PROFILE_KEY]?.[PROFILE_STORAGE_KEY]);
  } catch {
    return null;
  }
}

function normalizeStudentProfile(value) {
  if (!value || typeof value !== "object") return null;
  const profile = {
    fullName: cleanText(value.fullName),
    nickname: cleanText(value.nickname),
    dateOfBirth: cleanText(value.dateOfBirth),
    subject: cleanText(value.subject),
    level: cleanText(value.level),
    testDate: cleanText(value.testDate),
  };
  return Object.values(profile).every(Boolean) ? profile : null;
}

function bindNavigation() {
  document.querySelectorAll("[data-part-button]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentPart = button.dataset.partButton;
      renderAll();
    });
  });
}

function bindAudio() {
  const audio = document.querySelector("[data-audio-player]");
  const timeReadout = document.querySelector("[data-audio-time]");
  const startButton = document.querySelector("[data-start-audio]");
  const status = document.querySelector("[data-audio-status]");
  if (!audio || !timeReadout || !startButton || !status) return;
  const audioSource = audio.dataset.audioSrc;

  const updateReadout = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 1290;
    timeReadout.textContent = `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
  };

  const setStatus = (message, modifier) => {
    status.textContent = message;
    status.classList.toggle("is-warning", modifier === "warning");
    status.classList.toggle("is-complete", modifier === "complete");
  };

  const lockStartedUi = () => {
    startButton.textContent = "Listening exam in progress";
    startButton.disabled = true;
    setStatus("Playback is running and will continue until finish.");
  };

  const markComplete = () => {
    state.audioEnded = true;
    startButton.textContent = "Listening complete";
    startButton.disabled = true;
    setStatus("Listening complete. Replay is disabled for this exam session.", "complete");
    updateReadout();
    renderAll();
  };

  const startExamAudio = () => {
    if (!state.studentReady || state.audioStarted || state.audioEnded || state.audioStartPending) return;
    state.audioStartPending = true;
    audio.currentTime = 0;
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt
        .then(() => {
          state.audioStarted = true;
          state.audioStartPending = false;
          lockStartedUi();
        })
        .catch(() => {
          state.audioStartPending = false;
          startButton.disabled = false;
          setStatus("Audio was blocked. Tap start again to begin the exam.", "warning");
        });
    } else {
      state.audioStarted = true;
      state.audioStartPending = false;
      lockStartedUi();
    }
    updateReadout();
  };

  audio.addEventListener("loadedmetadata", updateReadout);
  audio.addEventListener("timeupdate", updateReadout);
  audio.addEventListener("durationchange", updateReadout);
  audio.addEventListener("ended", markComplete);
  audio.addEventListener("pause", () => {
    if (!state.audioStarted || state.audioEnded || state.submitted) return;
    audio.play().catch(() => {
      setStatus("Playback was interrupted. Keep this page active so the exam can continue.", "warning");
    });
  });
  startButton.addEventListener("click", startExamAudio);

  if (audioSource) {
    timeReadout.textContent = "Loading audio...";
    fetch(audioSource)
      .then((response) => {
        if (!response.ok) throw new Error("Audio request failed");
        return response.blob();
      })
      .then((blob) => {
        audio.src = URL.createObjectURL(blob);
        audio.load();
      })
      .catch(() => {
        audio.src = audioSource;
        audio.load();
      });
  }

  window.__starterAudioReady = true;
  updateReadout();
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function buildPart3() {
  const list = document.querySelector("[data-choice-list]");
  choiceQuestions.forEach((question) => {
    const article = document.createElement("article");
    article.className = "choice-question";
    article.innerHTML = `
      <h3>${question.title}</h3>
      <div class="choice-options">
        ${question.options
          .map((option) => {
            const label = option.toUpperCase();
            return `
              <label class="choice-card" data-choice-card="${question.id}-${option}">
                <img src="assets/part3-${question.id.replace("p3", "")}-${option}.png" alt="${question.title} option ${label}">
                <span><input type="radio" name="${question.id}" value="${option}" data-choice-answer="${question.id}"> ${label}</span>
              </label>
            `;
          })
          .join("")}
      </div>
    `;
    list.append(article);
  });

  document.querySelectorAll("[data-choice-answer]").forEach((input) => {
    input.addEventListener("change", () => {
      if (state.submitted) return;
      state.choices[input.dataset.choiceAnswer] = input.value;
      renderAll();
    });
  });
}

function bindPart1() {
  document.querySelectorAll("[data-object-point]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.submitted) return;
      state.selectedObject = button.dataset.objectPoint;
      renderPart1();
    });
  });

  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.submitted) return;
      if (!state.selectedObject) return;
      if (state.selectedObject === "radio") return;
      state.connections[state.selectedObject] = button.dataset.target;
      state.selectedObject = null;
      renderAll();
    });
  });
}

function bindPart2() {
  document.querySelectorAll("[data-text-answer]").forEach((input) => {
    input.addEventListener("input", () => {
      if (state.submitted) return;
      state.textAnswers[input.dataset.textAnswer] = input.value;
      renderAll();
    });
  });
}

function bindPart4() {
  document.querySelectorAll("[data-colour]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.submitted) return;
      state.activeColour = button.dataset.colour;
      renderPart4();
    });
  });

  document.querySelectorAll("[data-region]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.submitted) return;
      state.colours[button.dataset.region] = state.activeColour;
      renderAll();
    });
  });
}

function bindSubmit() {
  document.querySelectorAll("[data-submit]").forEach((button) => {
    button.addEventListener("click", confirmSubmit);
  });

  const dialog = document.querySelector("[data-submit-dialog]");
  if (!dialog) return;
  dialog.addEventListener("close", () => {
    if (dialog.returnValue === "confirm") finalizeSubmission();
  });
}

function confirmSubmit() {
  if (state.submitted) return;
  const dialog = document.querySelector("[data-submit-dialog]");
  if (dialog?.showModal) {
    dialog.returnValue = "";
    dialog.showModal();
    return;
  }
  if (window.confirm("Submit test now? Your answers will be marked and you cannot continue the test.")) {
    finalizeSubmission();
  }
}

function finalizeSubmission() {
  if (state.submitted) return;
  state.submitted = true;
  state.audioEnded = true;
  state.audioStartPending = false;
  state.selectedObject = null;
  stopAudioForSubmission();
  state.currentPart = "review";
  saveMockResult();
  renderAll();
}

function stopAudioForSubmission() {
  const audio = document.querySelector("[data-audio-player]");
  const startButton = document.querySelector("[data-start-audio]");
  const status = document.querySelector("[data-audio-status]");
  if (audio) audio.pause();
  if (startButton) {
    startButton.textContent = "Test submitted";
    startButton.disabled = true;
  }
  if (status) {
    status.textContent = "Test submitted. Playback has stopped.";
    status.classList.remove("is-warning");
    status.classList.add("is-complete");
  }
}

function renderAll() {
  renderStudentProfile();
  renderNavigation();
  renderPart1();
  renderPart2();
  renderPart3();
  renderPart4();
  renderReview();
  renderProgress();
}

function renderStudentProfile() {
  const startButton = document.querySelector("[data-start-audio]");
  const summary = document.querySelector("[data-student-summary]");
  if (startButton) startButton.disabled = !state.studentReady || state.audioStarted || state.audioEnded || state.audioStartPending || state.submitted;
  if (summary) {
    summary.hidden = !state.studentProfile;
    if (state.studentProfile) {
      summary.innerHTML = `
        <h3>${escapeHtml(state.studentProfile.fullName)} (${escapeHtml(state.studentProfile.nickname)})</h3>
        <p>${escapeHtml(state.studentProfile.subject)} · ${escapeHtml(state.studentProfile.level)} · Test date ${escapeHtml(state.studentProfile.testDate)}</p>
      `;
    }
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

function renderPart1() {
  document.querySelectorAll("[data-object-point]").forEach((button) => {
    const objectId = button.dataset.objectPoint;
    button.classList.toggle("is-selected", state.selectedObject === objectId);
    button.classList.toggle("is-linked", Boolean(state.connections[objectId]));
    button.disabled = state.submitted;
  });
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.disabled = state.submitted;
  });

  const lineLayer = document.querySelector("[data-line-layer]");
  lineLayer.innerHTML = "";
  Object.entries(state.connections).forEach(([objectId, targetId]) => {
    if (objectId === "radio") return;
    const object = objects[objectId];
    const target = targets[targetId];
    if (!object || !target) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", object.x);
    line.setAttribute("y1", object.y);
    line.setAttribute("x2", target.x);
    line.setAttribute("y2", target.y);
    lineLayer.append(line);
  });

  const list = document.querySelector("[data-connection-list]");
  list.innerHTML = "";
  Object.entries(objects).forEach(([objectId, object]) => {
    if (objectId === "radio") {
      list.append(connectionItem(`${object.label} -> ${targets.bookcase.label} (example)`));
      return;
    }
    const targetId = state.connections[objectId];
    list.append(connectionItem(`${object.label} -> ${targetId ? targets[targetId].label : "not set"}`));
  });
}

function connectionItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

function renderPart2() {
  document.querySelectorAll("[data-text-answer]").forEach((input) => {
    const stored = state.textAnswers[input.dataset.textAnswer] || "";
    if (input.value !== stored) input.value = stored;
    input.disabled = state.submitted;
  });
}

function renderPart3() {
  document.querySelectorAll("[data-choice-answer]").forEach((input) => {
    input.checked = state.choices[input.dataset.choiceAnswer] === input.value;
    input.disabled = state.submitted;
  });
  document.querySelectorAll("[data-choice-card]").forEach((card) => {
    const input = card.querySelector("input");
    card.classList.toggle("is-selected", input.checked);
  });
}

function renderPart4() {
  document.querySelectorAll("[data-colour]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.colour === state.activeColour);
    button.disabled = state.submitted;
  });
  document.querySelectorAll("[data-region]").forEach((button) => {
    button.disabled = state.submitted;
    const colour = state.colours[button.dataset.region];
    if (colour) {
      button.style.setProperty("--fill", colour);
      button.dataset.filled = "true";
    } else {
      button.style.removeProperty("--fill");
      delete button.dataset.filled;
    }
  });
}

function renderReview() {
  const reviewGrid = document.querySelector("[data-review-grid]");
  const partStatus = getPartStatus();
  const submitButtons = document.querySelectorAll("[data-submit]");
  reviewGrid.innerHTML = Object.entries(partStatus)
    .map(([part, status]) => {
      const label = part.replace("part", "Part ");
      return `
        <article class="review-card">
          <h3>${label}</h3>
          <p>${status.completed}/${status.total} answers completed</p>
        </article>
      `;
    })
    .join("");
  submitButtons.forEach((button) => {
    button.disabled = state.submitted;
    button.textContent = state.submitted ? "Submitted" : "Submit test";
  });

  const result = document.querySelector("[data-result-card]");
  result.hidden = !state.submitted;
  if (state.submitted) {
    result.innerHTML = renderScoreSummary(scoreSubmission());
  }
}

function renderProgress() {
  const completed = Object.values(getPartStatus()).reduce((sum, status) => sum + status.completed, 0);
  document.querySelector("[data-progress-count]").textContent = completed;
}

function getPartStatus() {
  const part1Completed = answerKey.part1.filter((item) => Boolean(state.connections[item.object])).length;
  const part2Completed = answerKey.part2.filter(({ id }) => {
    return (state.textAnswers[id] || "").trim().length > 0;
  }).length;
  const part3Completed = answerKey.part3.filter((item) => state.choices[item.id]).length;
  const part4Completed = answerKey.part4.filter((item) => state.colours[item.region]).length;

  return {
    part1: { completed: part1Completed, total: assessedCounts.part1 },
    part2: { completed: part2Completed, total: assessedCounts.part2 },
    part3: { completed: part3Completed, total: assessedCounts.part3 },
    part4: { completed: part4Completed, total: assessedCounts.part4 },
  };
}

function scoreSubmission() {
  const sections = {
    part1: answerKey.part1.map((item) => {
      const response = state.connections[item.object] || "";
      return buildResult({
        part: "Part 1",
        prompt: item.prompt,
        response: response ? targets[response]?.label || response : "No answer",
        correctAnswer: `${objects[item.object].label} -> ${targets[item.target].label}`,
        correct: response === item.target,
        transcript: item.transcript,
      });
    }),
    part2: answerKey.part2.map((item) => {
      const response = state.textAnswers[item.id] || "";
      return buildResult({
        part: "Part 2",
        prompt: item.prompt,
        response: response.trim() || "No answer",
        correctAnswer: item.display,
        correct: item.accepted.some((answer) => normalizeTextAnswer(answer) === normalizeTextAnswer(response)),
        transcript: item.transcript,
      });
    }),
    part3: answerKey.part3.map((item) => {
      const response = state.choices[item.id] || "";
      return buildResult({
        part: "Part 3",
        prompt: item.prompt,
        response: response ? response.toUpperCase() : "No answer",
        correctAnswer: item.display,
        correct: response === item.correct,
        transcript: item.transcript,
      });
    }),
    part4: answerKey.part4.map((item) => {
      const response = state.colours[item.region] || "";
      return buildResult({
        part: "Part 4",
        prompt: item.prompt,
        response: response ? colourName(response) : "No answer",
        correctAnswer: item.display,
        correct: normalizeColour(response) === normalizeColour(item.colour),
        transcript: item.transcript,
      });
    }),
  };

  const all = Object.values(sections).flat();
  return {
    total: all.filter((item) => item.correct).length,
    possible: all.length,
    sections,
  };
}

function saveMockResult() {
  if (!state.studentProfile || state.savedResultId) return;
  const score = scoreSubmission();
  const result = {
    id: `result-${Date.now()}`,
    testId: testMetadata.id,
    testTitle: testMetadata.title,
    student: state.studentProfile,
    score: {
      total: score.total,
      possible: score.possible,
      percent: Math.round((score.total / score.possible) * 100),
    },
    partScores: Object.entries(score.sections).map(([part, items]) => ({
      part: part.replace("part", "Part "),
      total: items.filter((item) => item.correct).length,
      possible: items.length,
    })),
    answers: Object.values(score.sections).flat().map((item) => ({
      part: item.part,
      prompt: item.prompt,
      response: item.response,
      correctAnswer: item.correctAnswer,
      correct: item.correct,
      transcript: item.transcript,
    })),
    submittedAt: new Date().toISOString(),
  };
  const results = readResults();
  results.unshift(result);
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(results.slice(0, 250)));
  state.savedResultId = result.id;
}

function readResults() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RESULT_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildResult({ part, prompt, response, correctAnswer, correct, transcript }) {
  return { part, prompt, response, correctAnswer, correct, transcript };
}

function normalizeTextAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeColour(value) {
  return String(value || "").toLowerCase();
}

function colourName(hex) {
  const names = {
    "#ef4444": "red",
    "#f97316": "orange",
    "#facc15": "yellow",
    "#22c55e": "green",
    "#38bdf8": "blue",
    "#a855f7": "purple",
    "#f472b6": "pink",
    "#8b5a2b": "brown",
  };
  return names[normalizeColour(hex)] || hex || "No answer";
}

function renderScoreSummary(score) {
  const partScores = Object.entries(score.sections)
    .map(([part, items]) => {
      const label = part.replace("part", "Part ");
      const correct = items.filter((item) => item.correct).length;
      return `
        <article class="part-score">
          <span>${label}</span>
          <strong>${correct}/${items.length}</strong>
        </article>
      `;
    })
    .join("");

  const corrections = Object.values(score.sections)
    .flat()
    .map((item, index) => {
      return `
        <article class="correction-item ${item.correct ? "is-correct" : ""}">
          <h4>${index + 1}. ${item.part}: ${item.prompt}</h4>
          <p>Your answer: <strong>${item.response}</strong></p>
          <p>Correct answer: <strong>${item.correctAnswer}</strong></p>
          <p class="transcript-ref">Transcript reference: ${item.transcript}</p>
        </article>
      `;
    })
    .join("");

  return `
    <div class="score-banner">
      <div>
        <h3>Score summary</h3>
        <p>Examples are excluded from scoring.</p>
      </div>
      <strong>${score.total}/${score.possible}</strong>
    </div>
    <div class="part-score-grid">${partScores}</div>
    <section class="correction-list" aria-label="Answer corrections">
      ${corrections}
    </section>
  `;
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
