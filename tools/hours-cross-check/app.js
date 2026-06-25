(function () {
  "use strict";

  document.documentElement.dataset.keaesApp = "loaded";

  const ALIAS_KEY = "keaes-teacher-name-map-v2";
  const TOLERANCE = 0.01;

  const state = {
    files: { tng: null, csv: null },
    parsed: null,
    review: null,
    results: null,
    activeTab: "synthesis",
    mappings: loadMappings(),
    filters: {
      teachers: { search: "", status: "all", sort: "diffDesc" },
      courses: { search: "", source: "all", sort: "hoursDesc" },
      sessions: { search: "", status: "all" }
    }
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", async () => {
    const employee = await window.KeaesWorkspacePortal?.requirePermission?.("hours_cross_check");
    if (!employee) {
      const session = await window.KeaesApi?.getSession?.().catch(() => null);
      if (session) document.body.classList.remove("is-auth-pending");
      refreshIcons();
      return;
    }
    document.body.classList.remove("is-auth-pending");
    await window.KeaesWorkspacePortal?.refreshChrome?.();
    cacheElements();
    bindEvents();
    renderUploadState();
    refreshIcons();
  });

  function cacheElements() {
    [
      "uploadStep", "reviewStep", "resultsStep", "tngFile", "csvFile", "tngFileMeta", "csvFileMeta",
      "runBtn", "uploadError", "parseProgress", "reviewGrid", "reviewWarnings", "backToUploadBtn",
      "proceedBtn", "resultsTitle", "branchBadge", "statusBadge", "modeBadge", "summaryCards",
      "exportReportBtn", "resetBtn", "demoResetBtn"
    ].forEach((id) => els[id] = document.getElementById(id));
  }

  function bindEvents() {
    document.querySelectorAll("[data-pick]").forEach((button) => {
      button.addEventListener("click", () => document.getElementById(`${button.dataset.pick}File`).click());
    });
    document.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        state.files[button.dataset.remove] = null;
        document.getElementById(`${button.dataset.remove}File`).value = "";
        state.parsed = null;
        state.results = null;
        renderUploadState();
      });
    });
    document.querySelectorAll("[data-dropzone]").forEach((zone) => {
      zone.addEventListener("dragover", (event) => {
        event.preventDefault();
        zone.classList.add("is-dragover");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("is-dragover"));
      zone.addEventListener("drop", (event) => {
        event.preventDefault();
        zone.classList.remove("is-dragover");
        setFile(zone.dataset.dropzone, event.dataTransfer.files[0]);
      });
    });
    els.tngFile.addEventListener("change", (event) => setFile("tng", event.target.files[0]));
    els.csvFile.addEventListener("change", (event) => setFile("csv", event.target.files[0]));
    els.runBtn.addEventListener("click", parseFilesForReview);
    els.backToUploadBtn.addEventListener("click", () => showStep("upload"));
    els.proceedBtn.addEventListener("click", saveTeacherReviewAndRun);
    els.exportReportBtn.addEventListener("click", exportCombinedReport);
    els.resetBtn.addEventListener("click", resetAll);
    els.demoResetBtn.addEventListener("click", resetAll);
    document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => setTab(tab.dataset.tab)));
  }

  function setFile(type, file) {
    clearError();
    if (!file) return;
    const valid = type === "tng"
      ? /\.(csv|xlsx|xls)$/i.test(file.name) || String(file.type).includes("csv") || String(file.type).includes("spreadsheet")
      : /\.csv$/i.test(file.name) || String(file.type).includes("csv");
    if (!valid) {
      showError(type === "tng" ? "Please select a Teach and Go CSV or Excel file." : "Please select a class-list CSV file.");
      return;
    }
    state.files[type] = file;
    state.parsed = null;
    state.review = null;
    state.results = null;
    renderUploadState();
  }

  function renderUploadState() {
    renderFileMeta("tng");
    renderFileMeta("csv");
    els.runBtn.disabled = !(state.files.tng && state.files.csv);
    document.querySelector("[data-remove='tng']").disabled = !state.files.tng;
    document.querySelector("[data-remove='csv']").disabled = !state.files.csv;
    document.querySelector("[data-dropzone='tng']").classList.toggle("has-file", Boolean(state.files.tng));
    document.querySelector("[data-dropzone='csv']").classList.toggle("has-file", Boolean(state.files.csv));
    refreshIcons();
  }

  function renderFileMeta(type) {
    const file = state.files[type];
    const target = type === "tng" ? els.tngFileMeta : els.csvFileMeta;
    if (!file) {
      target.className = "file-meta empty";
      target.textContent = "No file selected";
      return;
    }
    target.className = "file-meta";
    target.innerHTML = `<strong>${escapeHtml(file.name)}</strong><br><span>${escapeHtml(file.type || "local file")} • ${formatBytes(file.size)}</span>`;
  }

  async function parseFilesForReview() {
    clearError();
    els.parseProgress.classList.remove("hidden");
    els.runBtn.disabled = true;
    try {
      const [tngRows, classRows] = await Promise.all([readTeachGoFile(state.files.tng), readCsv(state.files.csv)]);
      const tng = parseTeachGo(tngRows, state.files.tng.name);
      const classList = parseClassList(classRows, state.files.csv.name);
      state.parsed = {
        tng,
        classList,
        branch: mostCommon(classList.sessions.map((s) => s.branch).filter(Boolean)) || "Unknown",
        range: detectDateRange([...tng.sessions, ...classList.sessions])
      };
      state.review = buildTeacherReview(tng.sessions, classList.sessions);
      renderTeacherReview();
      showStep("review");
    } catch (error) {
      console.error(error);
      showError(error.message || "Unable to parse the CSV files.");
    } finally {
      els.parseProgress.classList.add("hidden");
      renderUploadState();
    }
  }

  function readCsv(file) {
    return file.text().then(parseCsvText);
  }

  async function readTeachGoFile(file) {
    if (/\.(xlsx|xls)$/i.test(file.name)) return readTeachGoWorkbook(file);
    return readCsv(file);
  }

  async function readTeachGoWorkbook(file) {
    await ensureSheetJs();
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
    const sheetName = workbook.SheetNames.find((name) => normalizeCompact(name) === "bydate");
    if (!sheetName) throw new Error("The Teach and Go workbook must contain a sheet named \"By Date\".");
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: true, defval: "" });
    return teachGoObjectsFromSheetRows(rows, sheetName);
  }

  function teachGoObjectsFromSheetRows(rows, sheetName) {
    const detected = detectTeachGoHeader(rows);
    if (!detected) throw new Error(`Could not detect Teach and Go columns in the "${sheetName}" sheet.`);
    const objects = [];
    for (let rowIndex = detected.headerRowIndex + 1; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex] || [];
      if (row.every((cell) => !clean(cell))) continue;
      const text = row.map(clean).join(" ").toLowerCase();
      if (/grand\s*total|subtotal|total\s*hours/.test(text) && row.filter((cell) => clean(cell)).length <= 4) continue;
      objects.push({
        Subject: row[detected.columns.subject] ?? "",
        Level: row[detected.columns.level] ?? "",
        Teacher: row[detected.columns.teacher] ?? "",
        Student: row[detected.columns.student] ?? "",
        "Lesson Date": row[detected.columns.lessondate] ?? "",
        "Lesson Time": row[detected.columns.lessontime] ?? "",
        Duration: row[detected.columns.duration] ?? "",
        __sourceRow: rowIndex + 1
      });
    }
    return objects;
  }

  function detectTeachGoHeader(rows) {
    let best = null;
    rows.slice(0, 40).forEach((row, headerRowIndex) => {
      const columns = {};
      row.forEach((cell, index) => {
        const kind = classifyTeachGoHeader(cell);
        if (kind && columns[kind] === undefined) columns[kind] = index;
      });
      const required = ["teacher", "lessondate", "duration"];
      const score = Object.keys(columns).length + required.filter((kind) => columns[kind] !== undefined).length * 3;
      if (required.every((kind) => columns[kind] !== undefined) && (!best || score > best.score)) {
        best = { headerRowIndex, columns, score };
      }
    });
    return best;
  }

  function classifyTeachGoHeader(value) {
    const key = normalizeCompact(value);
    if (/^(subject|course|lesson)$/.test(key)) return "subject";
    if (/^(level|grade)$/.test(key)) return "level";
    if (/^(teacher|tutor|instructor|teachername)$/.test(key)) return "teacher";
    if (/^(student|students|studentname|learner)$/.test(key)) return "student";
    if (/^(lessondate|date|classdate)$/.test(key)) return "lessondate";
    if (/^(lessontime|time|classtime|starttime)$/.test(key)) return "lessontime";
    if (/^(duration|hours|hour|lessonhours)$/.test(key)) return "duration";
    return "";
  }

  function ensureSheetJs() {
    if (window.XLSX) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-xlsx-loader]");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("SheetJS could not be loaded for Excel parsing.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      script.async = true;
      script.dataset.xlsxLoader = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("SheetJS could not be loaded for Excel parsing. Use the Teach and Go CSV export, or connect to the internet and try again."));
      document.head.appendChild(script);
    });
  }

  function parseCsvText(text) {
    const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
    if (!rows.length) return [];
    const headers = rows[0].map(clean);
    return rows.slice(1)
      .filter((row) => row.some((cell) => clean(cell)))
      .map((row) => {
        const object = {};
        headers.forEach((header, index) => object[header] = row[index] ?? "");
        return object;
      });
  }

  // RFC4180-style parser: handles quoted fields, commas, doubled quotes, and CRLF/LF.
  function parseCsvRows(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (char === "\"" && next === "\"") {
          field += "\"";
          i += 1;
        } else if (char === "\"") {
          inQuotes = false;
        } else {
          field += char;
        }
        continue;
      }
      if (char === "\"") {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (char !== "\r") {
        field += char;
      }
    }
    if (field || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function parseTeachGo(rows, fileName) {
    const sessions = [];
    const warnings = [];
    rows.forEach((raw, index) => {
      if (emptyRow(raw)) return;
      const row = normalizeRow(raw);
      const sourceRow = Number(raw.__sourceRow) || index + 2;
      const date = parseDate(row.lessondate);
      const duration = parseHours(row.duration || row.hours);
      const times = parseTimeRange(row.lessontime, duration);
      const teacher = clean(row.teacher);
      const course = clean(row.subject);
      const rowWarnings = [];
      if (!date) rowWarnings.push("Invalid Lesson Date");
      if (!teacher) rowWarnings.push("Missing Teacher");
      if (!course) rowWarnings.push("Missing Subject");
      if (!Number.isFinite(duration)) rowWarnings.push("Invalid Duration");
      if (!times.startTime) rowWarnings.push("Invalid Lesson Time");
      rowWarnings.forEach((message) => warnings.push(warning("Teach and Go", sourceRow, message, raw)));
      sessions.push({
        source: "tng",
        sourceLabel: "Teach and Go",
        sourceRow,
        date,
        startTime: times.startTime,
        endTime: times.endTime,
        durationHours: Number.isFinite(duration) ? round2(duration) : 0,
        teacherDisplayName: teacher,
        teacherKey: personKey(teacher),
        compareTeacherKey: personKey(teacher),
        courseDisplayName: course,
        courseKey: courseKey(course),
        branch: "",
        platform: "",
        classType: "",
        raw,
        warnings: rowWarnings
      });
    });
    return { fileName, sessions, warnings, headers: Object.keys(rows[0] || {}) };
  }

  function parseClassList(rows, fileName) {
    const sessions = [];
    const warnings = [];
    rows.forEach((raw, index) => {
      if (emptyRow(raw)) return;
      const row = normalizeRow(raw);
      const date = parseDate(row.date);
      const duration = parseHours(row.hours);
      const startTime = parseClock(row.starttime);
      const endTime = parseClock(row.endtime) || addHours(startTime, duration);
      const teacher = clean(row.tutor);
      const course = clean(row.subject);
      const rowWarnings = [];
      if (!date) rowWarnings.push("Invalid Date");
      if (!teacher) rowWarnings.push("Missing Tutor");
      if (!course) rowWarnings.push("Missing Subject");
      if (!Number.isFinite(duration)) rowWarnings.push("Invalid Hours");
      if (!startTime) rowWarnings.push("Invalid Start Time");
      rowWarnings.forEach((message) => warnings.push(warning("Class-list", index + 2, message, raw)));
      sessions.push({
        source: "classList",
        sourceLabel: "Class-list",
        sourceRow: index + 2,
        date,
        startTime,
        endTime,
        durationHours: Number.isFinite(duration) ? round2(duration) : 0,
        teacherDisplayName: teacher,
        teacherKey: personKey(teacher),
        compareTeacherKey: personKey(teacher),
        courseDisplayName: course,
        courseKey: courseKey(course),
        classCode: clean(row.classcode),
        branch: clean(row.branch),
        platform: clean(row.platform),
        classType: clean(row.type),
        raw,
        warnings: rowWarnings
      });
    });
    return { fileName, sessions, warnings, headers: Object.keys(rows[0] || {}) };
  }

  function renderTeacherReview() {
    const parsed = state.parsed;
    const review = state.review;
    const cards = [
      ["Reporting month", formatMonth(parsed.range.start)],
      ["Date range", `${formatDate(parsed.range.start)} to ${formatDate(parsed.range.end)}`],
      ["Branch", parsed.branch],
      ["Teach and Go rows", parsed.tng.sessions.length.toLocaleString()],
      ["Class-list rows", parsed.classList.sessions.length.toLocaleString()],
      ["Teacher names to verify", review.items.filter((item) => item.status !== "Exact").length.toLocaleString()],
      ["Teach and Go hours", formatHours(sum(parsed.tng.sessions, "durationHours"))],
      ["Class-list hours", formatHours(sum(parsed.classList.sessions, "durationHours"))],
      ["Current difference", signedHours(sum(parsed.classList.sessions, "durationHours") - sum(parsed.tng.sessions, "durationHours"))]
    ];
    els.reviewGrid.innerHTML = cards.map(([label, value]) => `<article class="mini-card"><span>${label}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
    els.reviewWarnings.innerHTML = `
      <div class="notice warning">Review each uncertain Teach and Go teacher. Choose the matching class-list tutor, or leave as "No match / separate teacher" if they are different people.</div>
      <div class="table-shell">
        <table aria-label="Teacher name verification">
          <thead><tr><th>Teach and Go teacher</th><th>TNG hours</th><th>Suggested class-list tutor</th><th>Class-list hours</th><th>Status</th></tr></thead>
          <tbody>${review.items.map(teacherReviewRow).join("")}</tbody>
        </table>
      </div>
      <div class="notice ok">Saved choices are stored locally in this browser and reused next time.</div>
    `;
    refreshIcons();
  }

  function teacherReviewRow(item) {
    const selected = item.selectedClassKey || "__none__";
    const options = [
      `<option value="__none__" ${selected === "__none__" ? "selected" : ""}>No match / separate teacher</option>`,
      ...item.candidates.map((candidate) => `<option value="${escapeAttr(candidate.key)}" ${candidate.key === selected ? "selected" : ""}>${escapeHtml(candidate.name)} (${formatHours(candidate.hours)}h, ${Math.round(candidate.score * 100)}%)</option>`)
    ].join("");
    const selectedCandidate = item.candidates.find((candidate) => candidate.key === selected);
    const status = item.status;
    const statusClass = status === "Needs review" ? "error" : status === "Saved" ? "ok" : "warn";
    return `
      <tr>
        <td><strong>${escapeHtml(item.tngName)}</strong><br><span class="muted">${item.tngKey}</span></td>
        <td>${formatHours(item.tngHours)}</td>
        <td><select data-teacher-map="${escapeAttr(item.tngKey)}">${options}</select></td>
        <td>${selectedCandidate ? formatHours(selectedCandidate.hours) : "-"}</td>
        <td><span class="status-pill ${statusClass}">${status}</span></td>
      </tr>`;
  }

  function saveTeacherReviewAndRun() {
    try {
      document.querySelectorAll("[data-teacher-map]").forEach((select) => {
        const tngKey = select.dataset.teacherMap;
        if (select.value === "__none__") state.mappings[tngKey] = "__none__";
        else if (select.value) state.mappings[tngKey] = select.value;
        else delete state.mappings[tngKey];
      });
      saveMappings();
      state.results = reconcile();
      showStep("results");
      renderResults();
    } catch (error) {
      console.error(error);
      const message = error?.message || String(error);
      els.reviewWarnings.insertAdjacentHTML("afterbegin", `<div class="notice error" role="alert">Could not run the summary: ${escapeHtml(message)}</div>`);
    }
  }

  function buildTeacherReview(tngSessions, classSessions) {
    const tngTeachers = aggregateTeachers(tngSessions);
    const classTeachers = aggregateTeachers(classSessions);
    const rawItems = [...tngTeachers.values()].map((teacher) => {
      const exact = classTeachers.get(teacher.key);
      const saved = state.mappings[teacher.key];
      const candidates = [...classTeachers.values()]
        .map((candidate) => ({ ...candidate, score: teacherSimilarity(teacher.name, candidate.name) }))
        .filter((candidate) => candidate.score >= 0.6 || candidate.key === saved || candidate.key === teacher.key)
        .sort((a, b) => b.score - a.score || Math.abs(a.hours - teacher.hours) - Math.abs(b.hours - teacher.hours))
        .slice(0, 7);
      if (exact && !candidates.some((candidate) => candidate.key === exact.key)) candidates.unshift({ ...exact, score: 1 });
      if (saved && classTeachers.has(saved) && !candidates.some((candidate) => candidate.key === saved)) candidates.unshift({ ...classTeachers.get(saved), score: 1 });
      const bestCandidate = candidates[0];
      const autoVerified = bestCandidate && bestCandidate.score >= 0.9;
      const selectedClassKey = saved || (autoVerified ? bestCandidate.key : "");
      const status = saved && saved !== "__none__" ? "Saved" : autoVerified ? "Verified 90%+" : "Needs review";
      return {
        tngKey: teacher.key,
        tngName: teacher.name,
        tngHours: teacher.hours,
        selectedClassKey,
        status,
        candidates
      };
    });
    const reservedClassKeys = new Set(rawItems
      .filter((item) => item.status !== "Needs review" && item.selectedClassKey && item.selectedClassKey !== "__none__")
      .map((item) => item.selectedClassKey));
    const items = rawItems.map((item) => ({
      ...item,
      candidates: item.status === "Needs review"
        ? item.candidates.filter((candidate) => !reservedClassKeys.has(candidate.key))
        : item.candidates
    })).sort((a, b) => {
      const statusRank = { "Needs review": 0, "Verified 90%+": 1, "Saved": 2 };
      return (statusRank[a.status] ?? 0) - (statusRank[b.status] ?? 0) || b.tngHours - a.tngHours;
    });
    const unmatchedClassTeachers = [...classTeachers.values()].filter((teacher) => !items.some((item) => item.selectedClassKey && item.selectedClassKey !== "__none__" && item.selectedClassKey === teacher.key));
    return { items, unmatchedClassTeachers };
  }

  function reconcile() {
    const classTeacherNames = aggregateTeachers(state.parsed.classList.sessions);
    const tngSessions = state.parsed.tng.sessions.map((session) => {
      const mappedKey = state.mappings[session.teacherKey] === "__none__" ? `tng:${session.teacherKey}` : (state.mappings[session.teacherKey] || session.teacherKey);
      const mappedName = classTeacherNames.get(mappedKey)?.name || session.teacherDisplayName;
      return { ...session, compareTeacherKey: mappedKey, compareTeacherName: mappedName };
    });
    const classSessions = state.parsed.classList.sessions.map((session) => ({ ...session, compareTeacherKey: session.teacherKey, compareTeacherName: session.teacherDisplayName }));
    const teacherRows = compareTeachers(tngSessions, classSessions);
    const courseRows = summarizeCourses(tngSessions, classSessions);
    const sessionMatches = matchSessions(tngSessions, classSessions);
    const warnings = [
      ...state.parsed.tng.warnings,
      ...state.parsed.classList.warnings,
      ...state.review.unmatchedClassTeachers.map((teacher) => warning("Class-list", "", `Class-list tutor has no verified Teach and Go mapping: ${teacher.name}`, null))
    ];
    return {
      generatedAt: new Date().toISOString(),
      branch: state.parsed.branch,
      range: state.parsed.range,
      title: `${formatMonth(state.parsed.range.start)} Hours Cross-Check`,
      tngSessions,
      classSessions,
      teacherRows,
      courseRows,
      sessionMatches,
      warnings,
      overall: {
        tngHours: round2(sum(tngSessions, "durationHours")),
        classHours: round2(sum(classSessions, "durationHours")),
        tngRows: tngSessions.length,
        classRows: classSessions.length,
        teachers: new Set([...tngSessions.map((s) => s.compareTeacherKey), ...classSessions.map((s) => s.compareTeacherKey)]).size,
        courses: new Set([...tngSessions.map((s) => s.courseKey), ...classSessions.map((s) => s.courseKey)]).size
      }
    };
  }

  function compareTeachers(tngSessions, classSessions) {
    const map = new Map();
    const add = (source, session) => {
      const key = session.compareTeacherKey;
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          key,
          displayName: session.compareTeacherName || session.teacherDisplayName,
          tngHours: 0,
          classHours: 0,
          tngSessions: [],
          classSessions: []
        });
      }
      const row = map.get(key);
      if (source === "tng") {
        row.tngHours += session.durationHours;
        row.tngSessions.push(session);
      } else {
        row.classHours += session.durationHours;
        row.classSessions.push(session);
      }
    };
    tngSessions.forEach((session) => add("tng", session));
    classSessions.forEach((session) => add("class", session));
    return [...map.values()].map((row) => ({
      ...row,
      tngHours: round2(row.tngHours),
      classHours: round2(row.classHours),
      difference: round2(row.classHours - row.tngHours),
      status: Math.abs(row.classHours - row.tngHours) <= TOLERANCE ? "Matched" : "Difference"
    })).sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference) || a.displayName.localeCompare(b.displayName));
  }

  function summarizeCourses(tngSessions, classSessions) {
    const map = new Map();
    const add = (source, session) => {
      const key = `${source}:${session.courseKey}`;
      if (!map.has(key)) {
        map.set(key, { key, source, courseKey: session.courseKey, displayName: session.courseDisplayName || "Unknown course", hours: 0, sessions: [] });
      }
      const row = map.get(key);
      row.hours += session.durationHours;
      row.sessions.push(session);
    };
    tngSessions.forEach((session) => add("Teach and Go", session));
    classSessions.forEach((session) => add("Class-list", session));
    return [...map.values()].map((row) => ({ ...row, hours: round2(row.hours) })).sort((a, b) => b.hours - a.hours || a.displayName.localeCompare(b.displayName));
  }

  function matchSessions(tngSessions, classSessions) {
    const usedClass = new Set();
    const matches = [];
    tngSessions.forEach((tng) => {
      let best = null;
      classSessions.forEach((candidate, index) => {
        if (usedClass.has(index)) return;
        const scored = scoreSession(tng, candidate);
        if (!best || scored.score > best.score) best = { ...scored, classSession: candidate, classIndex: index };
      });
      if (best && best.score >= 65) {
        usedClass.add(best.classIndex);
        matches.push(matchRecord(best.status, tng, best.classSession, best.score, best.reason));
      } else {
        matches.push(matchRecord("Only in Teach and Go", tng, null, 0, "No class-list session matched the primary key."));
      }
    });
    classSessions.forEach((session, index) => {
      if (!usedClass.has(index)) matches.push(matchRecord("Only in Class-list", null, session, 0, "No Teach and Go session matched the primary key."));
    });
    return matches.sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.time || "").localeCompare(b.time || ""));
  }

  function scoreSession(tng, classSession) {
    let score = 0;
    const reasons = [];
    const sameDate = tng.date && tng.date === classSession.date;
    const sameStart = tng.startTime && tng.startTime === classSession.startTime;
    const sameTeacher = tng.compareTeacherKey && tng.compareTeacherKey === classSession.compareTeacherKey;
    const sameDuration = Math.abs(tng.durationHours - classSession.durationHours) <= TOLERANCE;
    const similarCourse = textSimilarity(tng.courseDisplayName, classSession.courseDisplayName) >= 0.55;
    if (sameDate) score += 30; else reasons.push("date differs");
    if (sameStart) score += 25; else reasons.push("start time differs");
    if (sameTeacher) score += 25; else reasons.push("teacher differs");
    if (sameDuration) score += 15; else reasons.push("duration differs");
    if (similarCourse) score += 5;
    let status = "Needs Review";
    if (score >= 95) status = "Matched";
    else if (sameDate && sameStart && sameTeacher && !sameDuration) status = "Duration Mismatch";
    else if (sameDate && sameStart && sameDuration && !sameTeacher) status = "Teacher Mismatch";
    else if (score >= 80) status = "Probable Match";
    return { score, status, reason: reasons.length ? reasons.join("; ") : "Primary key matched." };
  }

  function matchRecord(status, tng, classSession, score, reason) {
    const base = tng || classSession;
    return {
      id: cryptoId(),
      status,
      date: base?.date || "",
      time: base?.startTime || "",
      teacher: tng?.compareTeacherName || classSession?.teacherDisplayName || "",
      tngCourse: tng?.courseDisplayName || "",
      classCourse: classSession?.courseDisplayName || "",
      tngDuration: tng?.durationHours || 0,
      classDuration: classSession?.durationHours || 0,
      difference: round2((classSession?.durationHours || 0) - (tng?.durationHours || 0)),
      confidence: score,
      reason,
      tng,
      classSession
    };
  }

  function renderResults() {
    const results = state.results;
    results.overall.difference = round2(results.overall.classHours - results.overall.tngHours);
    els.resultsTitle.textContent = results.title;
    els.branchBadge.textContent = results.branch;
    els.modeBadge.textContent = "Students ignored";
    const issueCount = results.teacherRows.filter((row) => row.status !== "Matched").length + results.sessionMatches.filter((row) => row.status !== "Matched").length + results.warnings.length;
    els.statusBadge.textContent = issueCount ? "Differences Found" : "All Checks Passed";
    els.statusBadge.className = `badge status ${issueCount ? "error" : "ok"}`;
    renderSummaryCards(issueCount);
    renderActiveTab();
    refreshIcons();
  }

  function renderSummaryCards(issueCount) {
    const r = state.results;
    const cards = [
      ["Teach and Go Hours", formatHours(r.overall.tngHours), "file-spreadsheet"],
      ["Class-list Hours", formatHours(r.overall.classHours), "table"],
      ["Net Difference", signedHours(r.overall.difference), "activity"],
      ["Teachers Reviewed", r.overall.teachers.toLocaleString(), "users"],
      ["Courses Seen", r.overall.courses.toLocaleString(), "book-open"],
      ["Items Requiring Attention", issueCount.toLocaleString(), "alert-triangle"]
    ];
    els.summaryCards.innerHTML = cards.map(([label, value, icon]) => `<article class="summary-card"><span><i data-lucide="${icon}"></i> ${label}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
  }

  function setTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === tabName));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === `tab-${tabName}`));
    renderActiveTab();
  }

  function renderActiveTab() {
    if (!state.results) return;
    if (!document.getElementById(`tab-${state.activeTab}`)) {
      state.activeTab = "overview";
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === "overview"));
      document.getElementById("tab-overview")?.classList.add("is-active");
    }
    if (state.activeTab === "synthesis") renderSynthesis();
    if (state.activeTab === "overview") renderOverview();
    if (state.activeTab === "teachers") renderTeachers();
    if (state.activeTab === "courses") renderCourses();
    if (state.activeTab === "sessions") renderSessions();
    if (state.activeTab === "quality") renderQuality();
    if (state.activeTab === "settings") renderTeacherSettings();
    refreshIcons();
  }

  function renderSynthesis() {
    const r = state.results;
    const synthesis = buildSynthesis(r);
    const panel = document.getElementById("tab-synthesis");
    if (!panel) {
      renderOverview();
      return;
    }
    panel.innerHTML = `
      <div class="synthesis-hero">
        <div>
          <span class="step-chip">Data synthesis</span>
          <h3>${escapeHtml(synthesis.headline)}</h3>
          <p>${escapeHtml(synthesis.narrative)}</p>
        </div>
        <div class="synthesis-score ${synthesis.severity}">
          <span>Net difference</span>
          <strong>${signedHours(r.overall.difference)}</strong>
          <small>${r.overall.difference >= 0 ? "Class-list above Teach and Go" : "Teach and Go above class-list"}</small>
        </div>
      </div>

      <div class="synthesis-grid">
        ${synthesis.kpis.map((item) => `
          <article class="synthesis-card">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
            <p>${escapeHtml(item.note)}</p>
          </article>`).join("")}
      </div>

      <div class="overview-grid" style="margin-top:18px">
        <article class="plain-card">
          <h3>Review priorities</h3>
          <ol class="priority-list">
            ${synthesis.priorities.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></li>`).join("")}
          </ol>
        </article>
        <article class="plain-card">
          <h3>Session exception mix</h3>
          <ul class="status-list">
            ${Object.entries(synthesis.sessionCounts).map(([status, count]) => `<li><span>${escapeHtml(status)}</span><strong>${count}</strong></li>`).join("")}
          </ul>
        </article>
      </div>

      <div class="overview-grid" style="margin-top:18px">
        <article class="plain-card">
          <h3>Top teacher hour differences</h3>
          <ul class="status-list">
            ${synthesis.teacherDrivers.map((row) => `<li><span>${escapeHtml(row.displayName)}</span><strong>${signedHours(row.difference)}</strong></li>`).join("") || "<li><span>No teacher differences</span><strong>0.00</strong></li>"}
          </ul>
        </article>
        <article class="plain-card">
          <h3>Largest daily differences</h3>
          <ul class="status-list">
            ${synthesis.dailyDrivers.map((row) => `<li><span>${formatDate(row.date)}</span><strong>${signedHours(row.difference)}</strong></li>`).join("") || "<li><span>No daily differences</span><strong>0.00</strong></li>"}
          </ul>
        </article>
      </div>

      <div class="overview-grid" style="margin-top:18px">
        <article class="plain-card">
          <h3>Teach and Go course concentration</h3>
          <ul class="status-list">
            ${synthesis.tngCourses.map((row) => `<li><span>${escapeHtml(row.displayName)}</span><strong>${formatHours(row.hours)}</strong></li>`).join("")}
          </ul>
        </article>
        <article class="plain-card">
          <h3>Class-list course concentration</h3>
          <ul class="status-list">
            ${synthesis.classCourses.map((row) => `<li><span>${escapeHtml(row.displayName)}</span><strong>${formatHours(row.hours)}</strong></li>`).join("")}
          </ul>
        </article>
      </div>`;
  }

  function buildSynthesis(results) {
    const diff = results.overall.difference;
    const teacherDrivers = results.teacherRows
      .filter((row) => Math.abs(row.difference) > TOLERANCE)
      .slice()
      .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
      .slice(0, 8);
    const dailyDrivers = compareDailyTotals(results.tngSessions, results.classSessions)
      .filter((row) => Math.abs(row.difference) > TOLERANCE)
      .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
      .slice(0, 8);
    const sessionCounts = countBy(results.sessionMatches.filter((row) => row.status !== "Matched"), (row) => row.status);
    const needsReviewNames = state.review.items.filter((item) => item.status === "Needs review").length;
    const classOnly = results.sessionMatches.filter((row) => row.status === "Only in Class-list").length;
    const tngOnly = results.sessionMatches.filter((row) => row.status === "Only in Teach and Go").length;
    const priorities = [];
    if (needsReviewNames) priorities.push({ title: "Confirm remaining teacher names", detail: `${needsReviewNames} teacher-name mappings are below 90% confidence and should be reviewed before treating teacher totals as final.` });
    if (teacherDrivers.length) priorities.push({ title: "Resolve largest teacher variances", detail: `${teacherDrivers[0].displayName} is the largest teacher-level driver at ${signedHours(teacherDrivers[0].difference)} hours.` });
    if (classOnly || tngOnly) priorities.push({ title: "Check source-only sessions", detail: `${classOnly} sessions appear only in class-list and ${tngOnly} sessions appear only in Teach and Go.` });
    if (dailyDrivers.length) priorities.push({ title: "Review highest variance day", detail: `${formatDate(dailyDrivers[0].date)} has the largest daily variance at ${signedHours(dailyDrivers[0].difference)} hours.` });
    if (!priorities.length) priorities.push({ title: "No major exceptions", detail: "Totals and matched records are within the configured tolerance." });
    return {
      severity: Math.abs(diff) <= TOLERANCE ? "ok" : "warn",
      headline: Math.abs(diff) <= TOLERANCE ? "The two sources reconcile at the total-hour level." : `The class-list and Teach and Go totals differ by ${formatHours(Math.abs(diff))} hours.`,
      narrative: diff > TOLERANCE
        ? "The class-list export contains more scheduled hours than Teach and Go. Focus first on source-only sessions, remaining teacher-name reviews, and the largest teacher variances."
        : diff < -TOLERANCE
          ? "Teach and Go contains more scheduled hours than the class-list export. Focus first on source-only sessions, remaining teacher-name reviews, and the largest teacher variances."
          : "The overall totals match. Use the exception sections to confirm there are no material teacher, session, or data-quality issues.",
      kpis: [
        { label: "Row difference", value: signedNumber(results.overall.classRows - results.overall.tngRows), note: "Class-list rows minus Teach and Go rows." },
        { label: "Teacher variances", value: String(results.teacherRows.filter((row) => row.status !== "Matched").length), note: "Teachers whose total hours differ after name mapping." },
        { label: "Name reviews left", value: String(needsReviewNames), note: "Teacher matches below 90% confidence." },
        { label: "Session exceptions", value: String(results.sessionMatches.filter((row) => row.status !== "Matched").length), note: "Session records that are not exact matches." }
      ],
      priorities,
      sessionCounts,
      teacherDrivers,
      dailyDrivers,
      tngCourses: results.courseRows.filter((row) => row.source === "Teach and Go").slice(0, 8),
      classCourses: results.courseRows.filter((row) => row.source === "Class-list").slice(0, 8)
    };
  }

  function compareDailyTotals(tngSessions, classSessions) {
    const dates = new Set([...tngSessions.map((s) => s.date), ...classSessions.map((s) => s.date)].filter(Boolean));
    return [...dates].map((date) => {
      const tngHours = sum(tngSessions.filter((session) => session.date === date), "durationHours");
      const classHours = sum(classSessions.filter((session) => session.date === date), "durationHours");
      return { date, tngHours, classHours, difference: round2(classHours - tngHours) };
    });
  }

  function renderOverview() {
    const r = state.results;
    const panel = document.getElementById("tab-overview");
    if (!panel) return;
    const max = Math.max(r.overall.tngHours, r.overall.classHours, 1);
    const teacherOptions = r.teacherRows.map((row) => `<option value="${escapeAttr(row.key)}">${escapeHtml(row.displayName)}</option>`).join("");
    const courseOptions = r.courseRows.map((row) => `<option value="${escapeAttr(row.key)}">${escapeHtml(row.source)}: ${escapeHtml(row.displayName)}</option>`).join("");
    const mismatchCounts = countBy(r.sessionMatches, (row) => row.status);
    panel.innerHTML = `
      <div class="overview-grid">
        <article class="chart-card">
          <h3>Overall hour check</h3>
          <p>${overviewSentence(r)}</p>
          <div class="bar-compare">
            <div class="bar-row"><span>TNG</span><div class="bar-track"><div class="bar-fill" style="width:${(r.overall.tngHours / max) * 100}%"></div></div><strong>${formatHours(r.overall.tngHours)}</strong></div>
            <div class="bar-row"><span>Class-list</span><div class="bar-track"><div class="bar-fill csv" style="width:${(r.overall.classHours / max) * 100}%"></div></div><strong>${formatHours(r.overall.classHours)}</strong></div>
          </div>
          <div class="metric-grid">
            <article class="mini-card"><span>Teach and Go rows</span><strong>${r.overall.tngRows.toLocaleString()}</strong></article>
            <article class="mini-card"><span>Class-list rows</span><strong>${r.overall.classRows.toLocaleString()}</strong></article>
            <article class="mini-card"><span>Teacher differences</span><strong>${r.teacherRows.filter((row) => row.status !== "Matched").length}</strong></article>
            <article class="mini-card"><span>Session issues</span><strong>${r.sessionMatches.filter((row) => row.status !== "Matched").length}</strong></article>
          </div>
        </article>
        <aside class="plain-card">
          <h3>Quick hour lookup</h3>
          <label>Teacher
            <select id="teacherLookup"><option value="">Select teacher</option>${teacherOptions}</select>
          </label>
          <div id="teacherLookupResult" class="lookup-result"></div>
          <label>Course
            <select id="courseLookup"><option value="">Select course</option>${courseOptions}</select>
          </label>
          <div id="courseLookupResult" class="lookup-result"></div>
        </aside>
      </div>
      <div class="overview-grid" style="margin-top:18px">
        <article class="plain-card"><h3>Session summary</h3><ul class="status-list">${Object.entries(mismatchCounts).map(([key, value]) => `<li><span>${escapeHtml(key)}</span><strong>${value}</strong></li>`).join("")}</ul></article>
        <article class="plain-card"><h3>Name check summary</h3><ul class="status-list">${state.review.items.map((item) => `<li><span>${escapeHtml(item.tngName)}</span><strong>${escapeHtml(displayMappedTeacher(item.tngKey))}</strong></li>`).slice(0, 12).join("")}</ul></article>
      </div>`;
    bindOverviewLookups();
  }

  function bindOverviewLookups() {
    const teacherSelect = document.getElementById("teacherLookup");
    const courseSelect = document.getElementById("courseLookup");
    teacherSelect.addEventListener("change", () => {
      const row = state.results.teacherRows.find((item) => item.key === teacherSelect.value);
      document.getElementById("teacherLookupResult").innerHTML = row ? lookupCard([
        ["Teach and Go", formatHours(row.tngHours)],
        ["Class-list", formatHours(row.classHours)],
        ["Difference", signedHours(row.difference)],
        ["Sessions", `${row.tngSessions.length} / ${row.classSessions.length}`]
      ]) : "";
    });
    courseSelect.addEventListener("change", () => {
      const row = state.results.courseRows.find((item) => item.key === courseSelect.value);
      document.getElementById("courseLookupResult").innerHTML = row ? lookupCard([
        ["Source", row.source],
        ["Hours", formatHours(row.hours)],
        ["Sessions", row.sessions.length],
        ["Course", row.displayName]
      ]) : "";
    });
  }

  function lookupCard(items) {
    return `<div class="notice ok">${items.map(([label, value]) => `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}`).join("<br>")}</div>`;
  }

  function renderTeachers() {
    const filter = state.filters.teachers;
    const rows = filterTeachers(state.results.teacherRows, filter);
    const panel = document.getElementById("tab-teachers");
    panel.innerHTML = `
      <div class="control-bar">
        <label>Search <input data-filter="teachers" data-field="search" type="search" value="${escapeAttr(filter.search)}" placeholder="Search teacher"></label>
        <label>Status <select data-filter="teachers" data-field="status">
          <option value="all">All statuses</option>
          <option value="matched" ${filter.status === "matched" ? "selected" : ""}>Matched</option>
          <option value="difference" ${filter.status === "difference" ? "selected" : ""}>Difference</option>
        </select></label>
        <label>Sort <select data-filter="teachers" data-field="sort">
          <option value="diffDesc" ${filter.sort === "diffDesc" ? "selected" : ""}>Largest difference</option>
          <option value="nameAsc" ${filter.sort === "nameAsc" ? "selected" : ""}>Name A-Z</option>
          <option value="classDesc" ${filter.sort === "classDesc" ? "selected" : ""}>Class-list hours</option>
          <option value="tngDesc" ${filter.sort === "tngDesc" ? "selected" : ""}>Teach and Go hours</option>
        </select></label>
        <button type="button" class="secondary-button" data-export="teachers"><i data-lucide="download"></i> Export teachers</button>
      </div>
      <div class="table-shell"><table aria-label="Teacher hour comparison">
        <thead><tr><th>Teacher</th><th>Teach and Go</th><th>Class-list</th><th>Difference</th><th>Status</th><th>TNG sessions</th><th>Class-list sessions</th><th>Details</th></tr></thead>
        <tbody>${rows.map(teacherRow).join("") || `<tr><td colspan="8"><div class="empty-state">No teachers match the current filters.</div></td></tr>`}</tbody>
      </table></div>`;
    bindTableControls(panel);
  }

  function teacherRow(row) {
    const statusClass = row.status === "Matched" ? "ok" : "error";
    return `
      <tr>
        <td><strong>${escapeHtml(row.displayName)}</strong></td>
        <td>${formatHours(row.tngHours)}</td>
        <td>${formatHours(row.classHours)}</td>
        <td><span class="diff-pill">${signedHours(row.difference)}</span></td>
        <td><span class="status-pill ${statusClass}">${row.status}</span></td>
        <td>${row.tngSessions.length}</td>
        <td>${row.classSessions.length}</td>
        <td><button class="ghost-button expand-button" data-expand="teacher:${escapeAttr(row.key)}" type="button"><i data-lucide="chevron-down"></i> Expand</button></td>
      </tr>
      <tr class="detail-row hidden" data-detail="teacher:${escapeAttr(row.key)}"><td colspan="8">${sessionLists(row.tngSessions, row.classSessions)}</td></tr>`;
  }

  function sessionLists(tngSessions, classSessions) {
    const comparison = compareTeacherSessions(tngSessions, classSessions);
    const rows = comparison.rows.slice(0, 120).map((row) => `
      <tr class="${row.status === "matched" ? "" : "unmatched-session"}">
        <td class="${row.status !== "matched" && row.tng ? "unmatched-cell" : ""}">${row.tng ? sessionMini(row.tng) : `<span class="muted">No Teach and Go match</span>`}</td>
        <td class="${row.status !== "matched" && row.classSession ? "unmatched-cell" : ""}">${row.classSession ? sessionMini(row.classSession) : `<span class="muted">No class-list match</span>`}</td>
        <td><span class="status-pill ${row.status === "matched" ? "ok" : "error"}">${row.status === "matched" ? "Matched" : "Unmatched"}</span></td>
      </tr>`).join("");
    return `
      <div class="session-compare-summary">
        <span class="status-pill ok">${comparison.matched} matched</span>
        <span class="status-pill error">${comparison.tngOnly} only in Teach and Go</span>
        <span class="status-pill error">${comparison.classOnly} only in class-list</span>
      </div>
      <div class="table-shell session-compare-shell">
        <table class="session-compare-table" aria-label="Teacher session comparison">
          <thead><tr><th>Teach and Go</th><th>Class-list</th><th>Status</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="3"><div class="empty-state">No sessions to compare.</div></td></tr>`}</tbody>
        </table>
      </div>`;
  }

  function compareTeacherSessions(tngSessions, classSessions) {
    const usedClass = new Set();
    const rows = [];
    let matched = 0;
    tngSessions
      .slice()
      .sort(compareSessionOrder)
      .forEach((tng) => {
        let best = null;
        classSessions.forEach((classSession, index) => {
          if (usedClass.has(index)) return;
          const score = teacherDetailSessionScore(tng, classSession);
          if (!best || score > best.score) best = { classSession, index, score };
        });
        if (best && best.score >= 85) {
          usedClass.add(best.index);
          matched += 1;
          rows.push({ status: "matched", tng, classSession: best.classSession });
        } else {
          rows.push({ status: "unmatched", tng, classSession: null });
        }
      });
    classSessions
      .slice()
      .sort(compareSessionOrder)
      .forEach((classSession) => {
        const originalIndex = classSessions.indexOf(classSession);
        if (!usedClass.has(originalIndex)) rows.push({ status: "unmatched", tng: null, classSession });
      });
    rows.sort((a, b) => compareSessionOrder(a.tng || a.classSession, b.tng || b.classSession));
    return {
      rows,
      matched,
      tngOnly: rows.filter((row) => row.tng && !row.classSession).length,
      classOnly: rows.filter((row) => !row.tng && row.classSession).length
    };
  }

  function teacherDetailSessionScore(tng, classSession) {
    let score = 0;
    if (tng.date && tng.date === classSession.date) score += 35;
    if (tng.startTime && tng.startTime === classSession.startTime) score += 30;
    if (Math.abs(tng.durationHours - classSession.durationHours) <= TOLERANCE) score += 25;
    if (textSimilarity(tng.courseDisplayName, classSession.courseDisplayName) >= 0.45) score += 10;
    return score;
  }

  function compareSessionOrder(a, b) {
    return (a.date || "").localeCompare(b.date || "") || (a.startTime || "").localeCompare(b.startTime || "") || (a.courseDisplayName || "").localeCompare(b.courseDisplayName || "");
  }

  function sessionMini(session) {
    return `<div class="session-mini"><strong>${formatDate(session.date)} ${escapeHtml(session.startTime)}</strong><span>${escapeHtml(session.courseDisplayName)} • ${formatHours(session.durationHours)}</span></div>`;
  }

  function renderCourses() {
    const filter = state.filters.courses;
    const rows = filterCourses(state.results.courseRows, filter);
    const panel = document.getElementById("tab-courses");
    panel.innerHTML = `
      <div class="notice warning">Course names are summarized per source. They are not treated as verified cross-source matches yet.</div>
      <div class="control-bar">
        <label>Search <input data-filter="courses" data-field="search" type="search" value="${escapeAttr(filter.search)}" placeholder="Search course"></label>
        <label>Source <select data-filter="courses" data-field="source">
          <option value="all">Both sources</option>
          <option value="Teach and Go" ${filter.source === "Teach and Go" ? "selected" : ""}>Teach and Go</option>
          <option value="Class-list" ${filter.source === "Class-list" ? "selected" : ""}>Class-list</option>
        </select></label>
        <label>Sort <select data-filter="courses" data-field="sort">
          <option value="hoursDesc" ${filter.sort === "hoursDesc" ? "selected" : ""}>Largest hours</option>
          <option value="nameAsc" ${filter.sort === "nameAsc" ? "selected" : ""}>Course A-Z</option>
        </select></label>
        <button type="button" class="secondary-button" data-export="courses"><i data-lucide="download"></i> Export courses</button>
      </div>
      <div class="table-shell"><table aria-label="Course hour summary">
        <thead><tr><th>Course</th><th>Source</th><th>Hours</th><th>Sessions</th><th>Details</th></tr></thead>
        <tbody>${rows.map(courseRow).join("") || `<tr><td colspan="5"><div class="empty-state">No courses match the current filters.</div></td></tr>`}</tbody>
      </table></div>`;
    bindTableControls(panel);
  }

  function courseRow(row) {
    return `
      <tr>
        <td><strong>${escapeHtml(row.displayName)}</strong></td>
        <td>${escapeHtml(row.source)}</td>
        <td>${formatHours(row.hours)}</td>
        <td>${row.sessions.length}</td>
        <td><button class="ghost-button expand-button" data-expand="course:${escapeAttr(row.key)}" type="button"><i data-lucide="chevron-down"></i> Expand</button></td>
      </tr>
      <tr class="detail-row hidden" data-detail="course:${escapeAttr(row.key)}"><td colspan="5"><ul class="session-list">${row.sessions.slice(0, 80).map((s) => `<li>${formatDate(s.date)} ${s.startTime} • ${escapeHtml(s.teacherDisplayName)} • ${formatHours(s.durationHours)}</li>`).join("")}</ul></td></tr>`;
  }

  function renderSessions() {
    const filter = state.filters.sessions;
    const statuses = ["all", ...Object.keys(countBy(state.results.sessionMatches, (row) => row.status))];
    const rows = state.results.sessionMatches.filter((row) => {
      const haystack = `${row.teacher} ${row.tngCourse} ${row.classCourse} ${row.reason}`.toLowerCase();
      return (filter.status === "all" || row.status === filter.status) && (!filter.search || haystack.includes(filter.search.toLowerCase()));
    });
    const panel = document.getElementById("tab-sessions");
    panel.innerHTML = `
      <div class="filter-chips">${statuses.map((status) => `<button class="chip ${filter.status === status ? "is-active" : ""}" data-session-status="${escapeAttr(status)}" type="button">${escapeHtml(status)}</button>`).join("")}</div>
      <div class="control-bar">
        <label>Search <input id="sessionSearch" type="search" value="${escapeAttr(filter.search)}" placeholder="Search teacher, course, reason"></label>
        <button type="button" class="secondary-button" data-export="sessions"><i data-lucide="download"></i> Export sessions</button>
      </div>
      <div class="table-shell"><table aria-label="Session matching">
        <thead><tr><th>Date</th><th>Time</th><th>Teacher</th><th>TNG course</th><th>Class-list course</th><th>TNG hours</th><th>Class hours</th><th>Diff</th><th>Confidence</th><th>Status</th><th>Reason</th></tr></thead>
        <tbody>${rows.map(sessionRow).join("") || `<tr><td colspan="11"><div class="empty-state">No sessions match the current filters.</div></td></tr>`}</tbody>
      </table></div>`;
    panel.querySelectorAll("[data-session-status]").forEach((button) => button.addEventListener("click", () => {
      state.filters.sessions.status = button.dataset.sessionStatus;
      renderSessions();
    }));
    panel.querySelector("#sessionSearch").addEventListener("input", (event) => {
      state.filters.sessions.search = event.target.value;
      renderSessions();
    });
    panel.querySelector("[data-export='sessions']").addEventListener("click", exportSessions);
  }

  function sessionRow(row) {
    const statusClass = row.status === "Matched" ? "ok" : row.status === "Probable Match" ? "warn" : "error";
    return `<tr>
      <td>${formatDate(row.date)}</td><td>${escapeHtml(row.time)}</td><td>${escapeHtml(row.teacher)}</td>
      <td>${escapeHtml(row.tngCourse)}</td><td>${escapeHtml(row.classCourse)}</td>
      <td>${formatHours(row.tngDuration)}</td><td>${formatHours(row.classDuration)}</td><td>${signedHours(row.difference)}</td>
      <td>${row.confidence}%</td><td><span class="status-pill ${statusClass}">${row.status}</span></td><td>${escapeHtml(row.reason)}</td>
    </tr>`;
  }

  function renderQuality() {
    const warnings = state.results.warnings;
    const panel = document.getElementById("tab-quality");
    panel.innerHTML = `
      <div class="control-bar"><button type="button" class="secondary-button" data-export="quality"><i data-lucide="download"></i> Export warnings</button></div>
      <div class="table-shell"><table aria-label="Data quality warnings">
        <thead><tr><th>Source</th><th>Row</th><th>Warning</th></tr></thead>
        <tbody>${warnings.map((w) => `<tr><td>${escapeHtml(w.source)}</td><td>${escapeHtml(w.row)}</td><td>${escapeHtml(w.message)}</td></tr>`).join("") || `<tr><td colspan="3"><div class="empty-state">No parsing warnings.</div></td></tr>`}</tbody>
      </table></div>`;
    panel.querySelector("[data-export='quality']").addEventListener("click", exportQuality);
  }

  function renderTeacherSettings() {
    const panel = document.getElementById("tab-settings");
    panel.innerHTML = `
      <div class="notice ok">Teacher-name mappings are stored only in this browser.</div>
      <div class="table-shell">
        <table aria-label="Teacher mappings"><thead><tr><th>Teach and Go</th><th>Class-list mapping</th></tr></thead>
        <tbody>${state.review.items.map(teacherReviewRow).join("")}</tbody></table>
      </div>
      <div class="footer-actions" style="margin-top:16px">
        <button id="rerunMappingsBtn" type="button" class="primary-button"><i data-lucide="refresh-cw"></i> Save Names & Re-run</button>
        <button id="resetMappingsBtn" type="button" class="danger-button"><i data-lucide="trash-2"></i> Reset teacher mappings</button>
      </div>`;
    panel.querySelector("#rerunMappingsBtn").addEventListener("click", saveTeacherReviewAndRun);
    panel.querySelector("#resetMappingsBtn").addEventListener("click", () => {
      state.mappings = {};
      saveMappings();
      state.review = buildTeacherReview(state.parsed.tng.sessions, state.parsed.classList.sessions);
      state.results = reconcile();
      renderResults();
    });
  }

  function bindTableControls(panel) {
    panel.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("input", () => {
        state.filters[input.dataset.filter][input.dataset.field] = input.value;
        renderActiveTab();
      });
    });
    panel.querySelectorAll("[data-expand]").forEach((button) => {
      button.addEventListener("click", () => {
        panel.querySelector(`[data-detail="${cssEscape(button.dataset.expand)}"]`)?.classList.toggle("hidden");
      });
    });
    panel.querySelectorAll("[data-export]").forEach((button) => {
      if (button.dataset.export === "teachers") button.addEventListener("click", exportTeachers);
      if (button.dataset.export === "courses") button.addEventListener("click", exportCourses);
    });
  }

  function filterTeachers(rows, filter) {
    let out = rows.filter((row) => !filter.search || row.displayName.toLowerCase().includes(filter.search.toLowerCase()));
    if (filter.status !== "all") out = out.filter((row) => filter.status === "matched" ? row.status === "Matched" : row.status !== "Matched");
    out = [...out];
    if (filter.sort === "nameAsc") out.sort((a, b) => a.displayName.localeCompare(b.displayName));
    if (filter.sort === "classDesc") out.sort((a, b) => b.classHours - a.classHours);
    if (filter.sort === "tngDesc") out.sort((a, b) => b.tngHours - a.tngHours);
    if (filter.sort === "diffDesc") out.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
    return out;
  }

  function filterCourses(rows, filter) {
    let out = rows.filter((row) => !filter.search || row.displayName.toLowerCase().includes(filter.search.toLowerCase()));
    if (filter.source !== "all") out = out.filter((row) => row.source === filter.source);
    out = [...out];
    if (filter.sort === "nameAsc") out.sort((a, b) => a.displayName.localeCompare(b.displayName));
    if (filter.sort === "hoursDesc") out.sort((a, b) => b.hours - a.hours);
    return out;
  }

  function aggregateTeachers(sessions) {
    const map = new Map();
    sessions.forEach((session) => {
      if (!session.teacherKey) return;
      if (!map.has(session.teacherKey)) map.set(session.teacherKey, { key: session.teacherKey, name: session.teacherDisplayName, hours: 0, sessions: 0 });
      const row = map.get(session.teacherKey);
      row.hours += session.durationHours;
      row.sessions += 1;
      if (session.teacherDisplayName.length > row.name.length) row.name = session.teacherDisplayName;
    });
    map.forEach((row) => row.hours = round2(row.hours));
    return map;
  }

  function displayMappedTeacher(tngKey) {
    const mapped = state.mappings[tngKey];
    const classTeacher = aggregateTeachers(state.parsed.classList.sessions).get(mapped);
    if (mapped === "__none__") return "No match";
    return classTeacher ? classTeacher.name : "No match";
  }

  function exportTeachers() {
    downloadCsv(fileName("teachers"), state.results.teacherRows.map((row) => ({
      teacher: row.displayName,
      teach_and_go_hours: row.tngHours,
      class_list_hours: row.classHours,
      difference: row.difference,
      status: row.status,
      teach_and_go_sessions: row.tngSessions.length,
      class_list_sessions: row.classSessions.length
    })));
  }

  function exportCourses() {
    downloadCsv(fileName("courses"), state.results.courseRows.map((row) => ({
      source: row.source,
      course: row.displayName,
      hours: row.hours,
      sessions: row.sessions.length
    })));
  }

  function exportSessions() {
    downloadCsv(fileName("sessions"), state.results.sessionMatches.map((row) => ({
      status: row.status,
      date: row.date,
      time: row.time,
      teacher: row.teacher,
      tng_course: row.tngCourse,
      class_course: row.classCourse,
      tng_duration: row.tngDuration,
      class_duration: row.classDuration,
      difference: row.difference,
      confidence: row.confidence,
      reason: row.reason
    })));
  }

  function exportQuality() {
    downloadCsv(fileName("warnings"), state.results.warnings);
  }

  function exportCombinedReport() {
    exportTeachers();
    downloadJson(fileName("combined-report").replace(".csv", ".json"), {
      generatedAt: state.results.generatedAt,
      branch: state.results.branch,
      range: state.results.range,
      overall: state.results.overall,
      teachers: state.results.teacherRows,
      courses: state.results.courseRows,
      sessions: state.results.sessionMatches,
      warnings: state.results.warnings,
      mappings: state.mappings
    });
  }

  function fileName(kind) {
    const branch = normalizeCompact(state.results.branch) || "branch";
    const month = state.results.range.start ? state.results.range.start.slice(0, 7) : "unknown-month";
    return `keaes-hours-cross-check-${branch}-${month}-${kind}.csv`;
  }

  function downloadCsv(name, rows) {
    const bodyRows = rows.length ? rows : [{}];
    const headers = Object.keys(bodyRows[0]);
    const csv = [headers.join(","), ...bodyRows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
    downloadBlob(name, "text/csv;charset=utf-8", csv);
  }

  function downloadJson(name, payload) {
    downloadBlob(name, "application/json", JSON.stringify(payload, null, 2));
  }

  function downloadBlob(name, type, content) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function showStep(name) {
    els.uploadStep.classList.toggle("is-active", name === "upload");
    els.reviewStep.classList.toggle("is-active", name === "review");
    els.resultsStep.classList.toggle("is-active", name === "results");
    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshIcons();
  }

  function resetAll() {
    state.files = { tng: null, csv: null };
    state.parsed = null;
    state.review = null;
    state.results = null;
    els.tngFile.value = "";
    els.csvFile.value = "";
    renderUploadState();
    showStep("upload");
  }

  function overviewSentence(results) {
    const diff = results.overall.classHours - results.overall.tngHours;
    if (Math.abs(diff) <= TOLERANCE) return "Overall hours match within tolerance after teacher-name verification.";
    return `Class-list is ${diff > 0 ? "higher" : "lower"} than Teach and Go by ${formatHours(Math.abs(diff))} hours.`;
  }

  function parseDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
    }
    if (typeof value === "number" && window.XLSX) {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) return `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}`;
    }
    const text = clean(value);
    if (!text) return "";
    let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) return `${match[3]}-${pad(match[2])}-${pad(match[1])}`;
    match = text.match(/^([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{4})$/);
    if (match) {
      const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(match[1].slice(0, 3).toLowerCase()) + 1;
      return month ? `${match[3]}-${pad(month)}-${pad(match[2])}` : "";
    }
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? "" : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseHours(value) {
    if (typeof value === "number") return round2(value);
    const text = clean(value);
    if (!text) return NaN;
    if (/^\d+:\d{2}$/.test(text)) {
      const [h, m] = text.split(":").map(Number);
      return round2(h + m / 60);
    }
    const number = Number(text.replace(/,/g, ""));
    return Number.isFinite(number) ? round2(number) : NaN;
  }

  function parseTimeRange(value, duration) {
    if (value instanceof Date || typeof value === "number") {
      const startTime = parseClock(value);
      return { startTime, endTime: addHours(startTime, duration) };
    }
    const text = clean(value);
    const match = text.match(/(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/);
    if (match) return { startTime: `${pad(match[1])}:${pad(match[2])}`, endTime: `${pad(match[3])}:${pad(match[4])}` };
    const startTime = parseClock(text);
    return { startTime, endTime: addHours(startTime, duration) };
  }

  function parseClock(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
    if (typeof value === "number" && value >= 0 && value < 1) {
      const minutes = Math.round(value * 24 * 60);
      return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
    }
    const text = clean(value);
    const match = text.match(/^(\d{1,2}):(\d{2})$/);
    return match ? `${pad(match[1])}:${pad(match[2])}` : "";
  }

  function addHours(startTime, hours) {
    if (!startTime || !Number.isFinite(hours)) return "";
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + Math.round(hours * 60);
    return `${pad(Math.floor((total % 1440) / 60))}:${pad(total % 60)}`;
  }

  function detectDateRange(sessions) {
    const dates = sessions.map((session) => session.date).filter(Boolean).sort();
    return { start: dates[0] || "", end: dates[dates.length - 1] || "" };
  }

  function normalizeRow(row) {
    const out = {};
    Object.entries(row).forEach(([key, value]) => out[normalizeCompact(key)] = value);
    return out;
  }

  function emptyRow(row) {
    return Object.values(row || {}).every((value) => !clean(value));
  }

  function teacherSimilarity(a, b) {
    const aa = personKey(a);
    const bb = personKey(b);
    if (!aa || !bb) return 0;
    if (aa === bb) return 1;
    const aTokens = clean(a).toLowerCase().split(/\s+/).filter(Boolean);
    const bTokens = clean(b).toLowerCase().split(/\s+/).filter(Boolean);
    const firstA = aTokens[0] || "";
    const firstB = bTokens[0] || "";
    const firstScore = firstA && firstB ? textSimilarity(firstA, firstB) : 0;
    const prefixScore = aa.startsWith(bb) || bb.startsWith(aa) ? 0.88 : 0;
    return Math.max(textSimilarity(aa, bb), firstScore * 0.9, prefixScore);
  }

  function textSimilarity(a, b) {
    const aa = normalizeCompact(a);
    const bb = normalizeCompact(b);
    if (!aa || !bb) return 0;
    const longer = aa.length >= bb.length ? aa : bb;
    const shorter = aa.length >= bb.length ? bb : aa;
    return (longer.length - levenshtein(longer, shorter)) / longer.length;
  }

  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i += 1) {
      for (let j = 1; j <= a.length; j += 1) {
        matrix[i][j] = b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  }

  function loadMappings() {
    try {
      return JSON.parse(localStorage.getItem(ALIAS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveMappings() {
    try {
      localStorage.setItem(ALIAS_KEY, JSON.stringify(state.mappings));
    } catch (error) {
      console.warn("Teacher mappings could not be saved locally.", error);
    }
  }

  function clean(value) {
    return String(value ?? "").normalize("NFKC").replace(/^\uFEFF/, "").replace(/\s+/g, " ").trim();
  }

  function personKey(value) {
    return clean(value).toLowerCase().replace(/[.’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function courseKey(value) {
    return normalizeCompact(value);
  }

  function normalizeCompact(value) {
    return clean(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");
  }

  function warning(source, row, message, raw) {
    return { source, row, message, raw };
  }

  function sum(rows, key) {
    return round2(rows.reduce((total, row) => total + (Number(row[key]) || 0), 0));
  }

  function countBy(items, keyFn) {
    return items.reduce((acc, item) => {
      const key = keyFn(item) || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function mostCommon(values) {
    const counts = countBy(values, (value) => value);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  }

  function round2(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function formatDate(value) {
    if (!value) return "Not detected";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  function formatMonth(value) {
    if (!value) return "Detected Month";
    const date = new Date(`${value.slice(0, 7)}-01T00:00:00`);
    return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }

  function formatHours(value) {
    return round2(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function signedHours(value) {
    const rounded = round2(value);
    return `${rounded > 0 ? "+" : ""}${formatHours(rounded)}`;
  }

  function signedNumber(value) {
    const number = Number(value) || 0;
    return `${number > 0 ? "+" : ""}${number.toLocaleString()}`;
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  function csvCell(value) {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function cssEscape(value) {
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function cryptoId() {
    return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).replace(/[^a-z0-9-]/gi, "");
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function showError(message) {
    els.uploadError.textContent = message;
    els.uploadError.classList.remove("hidden");
  }

  function clearError() {
    els.uploadError.textContent = "";
    els.uploadError.classList.add("hidden");
  }

  document.documentElement.dataset.keaesAppReady = "ready";
  const publicApi = {
    parseHours,
    parseDate,
    teacherSimilarity,
    textSimilarity,
    parseCsvText,
    parseTeachGo,
    parseClassList,
    buildTeacherReview
  };
  window.KeaesCsvReconciliation = publicApi;
  document.keaesCsvReconciliation = publicApi;
})();
