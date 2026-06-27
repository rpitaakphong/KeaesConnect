"use client";

import * as XLSX from "xlsx";
import type {
  CourseHoursRow,
  DataQualityWarning,
  HoursSourceSession,
  ParsedHoursBundle,
  ParsedHoursSource,
  ReconciliationResults,
  SessionMatch,
  TeacherHoursRow,
  TeacherMappings,
  TeacherReview,
  TeacherReviewCandidate,
  TeacherReviewItem,
} from "@/features/hours-cross-check/types";

export const aliasStorageKey = "keaes-teacher-name-map-v2";
export const hoursTolerance = 0.01;

type RowObject = Record<string, unknown>;
type TeacherAggregate = { hours: number; key: string; name: string; sessions: number };

export async function parseHoursFiles(tngFile: File, classListFile: File): Promise<{ parsed: ParsedHoursBundle; review: TeacherReview }> {
  const [tngRows, classRows] = await Promise.all([readTeachGoFile(tngFile), readCsvFile(classListFile)]);
  const tng = parseTeachGo(tngRows, tngFile.name);
  const classList = parseClassList(classRows, classListFile.name);
  const parsed = {
    branch: mostCommon(classList.sessions.map((session) => session.branch).filter(Boolean)) || "Unknown",
    classList,
    range: detectDateRange([...tng.sessions, ...classList.sessions]),
    tng,
  };
  return { parsed, review: buildTeacherReview(tng.sessions, classList.sessions, loadTeacherMappings()) };
}

export async function readCsvFile(file: File): Promise<RowObject[]> {
  return parseCsvText(await file.text());
}

export async function readTeachGoFile(file: File): Promise<RowObject[]> {
  if (/\.(xlsx|xls)$/i.test(file.name)) return readTeachGoWorkbook(file);
  return readCsvFile(file);
}

export async function readTeachGoWorkbook(file: File): Promise<RowObject[]> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames.find((name) => normalizeCompact(name) === "bydate");
  if (!sheetName) throw new Error('The Teach and Go workbook must contain a sheet named "By Date".');
  const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], { header: 1, raw: true, defval: "" });
  return teachGoObjectsFromSheetRows(rows, sheetName);
}

export function parseCsvText(text: string): RowObject[] {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
  if (!rows.length) return [];
  const headers = rows[0].map(clean);
  return rows.slice(1)
    .filter((row) => row.some((cell) => clean(cell)))
    .map((row) => {
      const object: RowObject = {};
      headers.forEach((header, index) => {
        object[header] = row[index] ?? "";
      });
      return object;
    });
}

export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
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

function teachGoObjectsFromSheetRows(rows: unknown[][], sheetName: string): RowObject[] {
  const detected = detectTeachGoHeader(rows);
  if (!detected) throw new Error(`Could not detect Teach and Go columns in the "${sheetName}" sheet.`);
  const objects: RowObject[] = [];
  for (let rowIndex = detected.headerRowIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] || [];
    if (row.every((cell) => !clean(cell))) continue;
    const text = row.map(clean).join(" ").toLowerCase();
    if (/grand\s*total|subtotal|total\s*hours/.test(text) && row.filter((cell) => clean(cell)).length <= 4) continue;
    objects.push({
      Duration: row[detected.columns.duration] ?? "",
      "Lesson Date": row[detected.columns.lessondate] ?? "",
      "Lesson Time": row[detected.columns.lessontime] ?? "",
      Level: row[detected.columns.level] ?? "",
      Student: row[detected.columns.student] ?? "",
      Subject: row[detected.columns.subject] ?? "",
      Teacher: row[detected.columns.teacher] ?? "",
      __sourceRow: rowIndex + 1,
    });
  }
  return objects;
}

function detectTeachGoHeader(rows: unknown[][]) {
  let best: { columns: Record<string, number>; headerRowIndex: number; score: number } | null = null;
  const sample = rows.slice(0, 40);
  for (let headerRowIndex = 0; headerRowIndex < sample.length; headerRowIndex += 1) {
    const row = sample[headerRowIndex];
    const columns: Record<string, number> = {};
    row.forEach((cell, index) => {
      const kind = classifyTeachGoHeader(cell);
      if (kind && columns[kind] === undefined) columns[kind] = index;
    });
    const required = ["teacher", "lessondate", "duration"];
    const score = Object.keys(columns).length + required.filter((kind) => columns[kind] !== undefined).length * 3;
    if (required.every((kind) => columns[kind] !== undefined) && (!best || score > best.score)) {
      best = { columns, headerRowIndex, score };
    }
  }
  return best;
}

function classifyTeachGoHeader(value: unknown) {
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

export function parseTeachGo(rows: RowObject[], fileName: string): ParsedHoursSource {
  const sessions: HoursSourceSession[] = [];
  const warnings: DataQualityWarning[] = [];
  rows.forEach((raw, index) => {
    if (emptyRow(raw)) return;
    const row = normalizeRow(raw);
    const sourceRow = Number(raw.__sourceRow) || index + 2;
    const date = parseDate(row.lessondate);
    const duration = parseHours(row.duration || row.hours);
    const times = parseTimeRange(row.lessontime, duration);
    const teacher = clean(row.teacher);
    const course = clean(row.subject);
    const rowWarnings: string[] = [];
    if (!date) rowWarnings.push("Invalid Lesson Date");
    if (!teacher) rowWarnings.push("Missing Teacher");
    if (!course) rowWarnings.push("Missing Subject");
    if (!Number.isFinite(duration)) rowWarnings.push("Invalid Duration");
    if (!times.startTime) rowWarnings.push("Invalid Lesson Time");
    rowWarnings.forEach((message) => warnings.push(warning("Teach and Go", sourceRow, message, raw)));
    sessions.push({
      branch: "",
      classType: "",
      compareTeacherKey: personKey(teacher),
      courseDisplayName: course,
      courseKey: courseKey(course),
      date,
      durationHours: Number.isFinite(duration) ? round2(duration) : 0,
      endTime: times.endTime,
      platform: "",
      raw,
      source: "tng",
      sourceLabel: "Teach and Go",
      sourceRow,
      startTime: times.startTime,
      teacherDisplayName: teacher,
      teacherKey: personKey(teacher),
      warnings: rowWarnings,
    });
  });
  return { fileName, headers: Object.keys(rows[0] || {}), sessions, warnings };
}

export function parseClassList(rows: RowObject[], fileName: string): ParsedHoursSource {
  const sessions: HoursSourceSession[] = [];
  const warnings: DataQualityWarning[] = [];
  rows.forEach((raw, index) => {
    if (emptyRow(raw)) return;
    const row = normalizeRow(raw);
    const date = parseDate(row.date);
    const duration = parseHours(row.hours);
    const startTime = parseClock(row.starttime);
    const endTime = parseClock(row.endtime) || addHours(startTime, duration);
    const teacher = clean(row.tutor);
    const course = clean(row.subject);
    const rowWarnings: string[] = [];
    if (!date) rowWarnings.push("Invalid Date");
    if (!teacher) rowWarnings.push("Missing Tutor");
    if (!course) rowWarnings.push("Missing Subject");
    if (!Number.isFinite(duration)) rowWarnings.push("Invalid Hours");
    if (!startTime) rowWarnings.push("Invalid Start Time");
    rowWarnings.forEach((message) => warnings.push(warning("Class-list", index + 2, message, raw)));
    sessions.push({
      branch: clean(row.branch),
      classCode: clean(row.classcode),
      classType: clean(row.type),
      compareTeacherKey: personKey(teacher),
      courseDisplayName: course,
      courseKey: courseKey(course),
      date,
      durationHours: Number.isFinite(duration) ? round2(duration) : 0,
      endTime,
      platform: clean(row.platform),
      raw,
      source: "classList",
      sourceLabel: "Class-list",
      sourceRow: index + 2,
      startTime,
      teacherDisplayName: teacher,
      teacherKey: personKey(teacher),
      warnings: rowWarnings,
    });
  });
  return { fileName, headers: Object.keys(rows[0] || {}), sessions, warnings };
}

export function buildTeacherReview(tngSessions: HoursSourceSession[], classSessions: HoursSourceSession[], mappings: TeacherMappings): TeacherReview {
  const tngTeachers = aggregateTeachers(tngSessions);
  const classTeachers = aggregateTeachers(classSessions);
  const rawItems: TeacherReviewItem[] = [...tngTeachers.values()].map((teacher) => {
    const exact = classTeachers.get(teacher.key);
    const saved = mappings[teacher.key];
    const candidates = [...classTeachers.values()]
      .map((candidate) => ({ ...candidate, score: teacherSimilarity(teacher.name, candidate.name) }))
      .filter((candidate) => candidate.score >= 0.6 || candidate.key === saved || candidate.key === teacher.key)
      .sort((a, b) => b.score - a.score || Math.abs(a.hours - teacher.hours) - Math.abs(b.hours - teacher.hours))
      .slice(0, 7);
    if (exact && !candidates.some((candidate) => candidate.key === exact.key)) candidates.unshift({ ...exact, score: 1 });
    if (saved && classTeachers.has(saved) && !candidates.some((candidate) => candidate.key === saved)) candidates.unshift({ ...classTeachers.get(saved) as TeacherReviewCandidate, score: 1 });
    const bestCandidate = candidates[0];
    const autoVerified = bestCandidate && bestCandidate.score >= 0.9;
    const selectedClassKey = saved || (autoVerified ? bestCandidate.key : "");
    const status = saved && saved !== "__none__" ? "Saved" : autoVerified ? "Verified 90%+" : "Needs review";
    return {
      candidates,
      selectedClassKey,
      status,
      tngHours: teacher.hours,
      tngKey: teacher.key,
      tngName: teacher.name,
    };
  });
  const reservedClassKeys = new Set(rawItems
    .filter((item) => item.status !== "Needs review" && item.selectedClassKey && item.selectedClassKey !== "__none__")
    .map((item) => item.selectedClassKey));
  const items = rawItems.map((item) => ({
    ...item,
    candidates: item.status === "Needs review" ? item.candidates.filter((candidate) => !reservedClassKeys.has(candidate.key)) : item.candidates,
  })).sort((a, b) => {
    const statusRank = { "Needs review": 0, "Verified 90%+": 1, Saved: 2 };
    return statusRank[a.status] - statusRank[b.status] || b.tngHours - a.tngHours;
  });
  const unmatchedClassTeachers = [...classTeachers.values()].filter((teacher) => !items.some((item) => item.selectedClassKey && item.selectedClassKey !== "__none__" && item.selectedClassKey === teacher.key));
  return { items, unmatchedClassTeachers };
}

export function reconcile(parsed: ParsedHoursBundle, review: TeacherReview, mappings: TeacherMappings): ReconciliationResults {
  const classTeacherNames = aggregateTeachers(parsed.classList.sessions);
  const tngSessions = parsed.tng.sessions.map((session) => {
    const mappedKey = mappings[session.teacherKey] === "__none__" ? `tng:${session.teacherKey}` : (mappings[session.teacherKey] || session.teacherKey);
    const mappedName = classTeacherNames.get(mappedKey)?.name || session.teacherDisplayName;
    return { ...session, compareTeacherKey: mappedKey, compareTeacherName: mappedName };
  });
  const classSessions = parsed.classList.sessions.map((session) => ({ ...session, compareTeacherKey: session.teacherKey, compareTeacherName: session.teacherDisplayName }));
  const teacherRows = compareTeachers(tngSessions, classSessions);
  const courseRows = summarizeCourses(tngSessions, classSessions);
  const sessionMatches = matchSessions(tngSessions, classSessions);
  const warnings = [
    ...parsed.tng.warnings,
    ...parsed.classList.warnings,
    ...review.unmatchedClassTeachers.map((teacher) => warning("Class-list", "", `Class-list tutor has no verified Teach and Go mapping: ${teacher.name}`, null)),
  ];
  const tngHours = round2(sum(tngSessions, "durationHours"));
  const classHours = round2(sum(classSessions, "durationHours"));
  return {
    branch: parsed.branch,
    classSessions,
    courseRows,
    generatedAt: new Date().toISOString(),
    overall: {
      classHours,
      classRows: classSessions.length,
      courses: new Set([...tngSessions.map((session) => session.courseKey), ...classSessions.map((session) => session.courseKey)]).size,
      difference: round2(classHours - tngHours),
      teachers: new Set([...tngSessions.map((session) => session.compareTeacherKey), ...classSessions.map((session) => session.compareTeacherKey)]).size,
      tngHours,
      tngRows: tngSessions.length,
    },
    range: parsed.range,
    sessionMatches,
    teacherRows,
    title: `${formatMonth(parsed.range.start)} Hours Cross-Check`,
    tngSessions,
    warnings,
  };
}

function compareTeachers(tngSessions: HoursSourceSession[], classSessions: HoursSourceSession[]): TeacherHoursRow[] {
  const map = new Map<string, TeacherHoursRow>();
  const add = (source: "tng" | "class", session: HoursSourceSession) => {
    const key = session.compareTeacherKey;
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, {
        classHours: 0,
        classSessions: [],
        difference: 0,
        displayName: session.compareTeacherName || session.teacherDisplayName,
        key,
        status: "Matched",
        tngHours: 0,
        tngSessions: [],
      });
    }
    const row = map.get(key);
    if (!row) return;
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
    classHours: round2(row.classHours),
    difference: round2(row.classHours - row.tngHours),
    status: (Math.abs(row.classHours - row.tngHours) <= hoursTolerance ? "Matched" : "Difference") as TeacherHoursRow["status"],
    tngHours: round2(row.tngHours),
  })).sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference) || a.displayName.localeCompare(b.displayName));
}

function summarizeCourses(tngSessions: HoursSourceSession[], classSessions: HoursSourceSession[]): CourseHoursRow[] {
  const map = new Map<string, CourseHoursRow>();
  const add = (source: "Teach and Go" | "Class-list", session: HoursSourceSession) => {
    const key = `${source}:${session.courseKey}`;
    if (!map.has(key)) {
      map.set(key, { courseKey: session.courseKey, displayName: session.courseDisplayName || "Unknown course", hours: 0, key, sessions: [], source });
    }
    const row = map.get(key);
    if (!row) return;
    row.hours += session.durationHours;
    row.sessions.push(session);
  };
  tngSessions.forEach((session) => add("Teach and Go", session));
  classSessions.forEach((session) => add("Class-list", session));
  return [...map.values()].map((row) => ({ ...row, hours: round2(row.hours) })).sort((a, b) => b.hours - a.hours || a.displayName.localeCompare(b.displayName));
}

function matchSessions(tngSessions: HoursSourceSession[], classSessions: HoursSourceSession[]): SessionMatch[] {
  const usedClass = new Set<number>();
  const matches: SessionMatch[] = [];
  tngSessions.forEach((tng) => {
    let best: { classIndex: number; classSession: HoursSourceSession; reason: string; score: number; status: SessionMatch["status"] } | null = null;
    for (let index = 0; index < classSessions.length; index += 1) {
      const candidate = classSessions[index];
      if (usedClass.has(index)) continue;
      const scored = scoreSession(tng, candidate);
      if (!best || scored.score > best.score) best = { ...scored, classIndex: index, classSession: candidate };
    }
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

function scoreSession(tng: HoursSourceSession, classSession: HoursSourceSession) {
  let score = 0;
  const reasons: string[] = [];
  const sameDate = tng.date && tng.date === classSession.date;
  const sameStart = tng.startTime && tng.startTime === classSession.startTime;
  const sameTeacher = tng.compareTeacherKey && tng.compareTeacherKey === classSession.compareTeacherKey;
  const sameDuration = Math.abs(tng.durationHours - classSession.durationHours) <= hoursTolerance;
  const similarCourse = textSimilarity(tng.courseDisplayName, classSession.courseDisplayName) >= 0.55;
  if (sameDate) score += 30; else reasons.push("date differs");
  if (sameStart) score += 25; else reasons.push("start time differs");
  if (sameTeacher) score += 25; else reasons.push("teacher differs");
  if (sameDuration) score += 15; else reasons.push("duration differs");
  if (similarCourse) score += 5;
  let status: SessionMatch["status"] = "Needs Review";
  if (score >= 95) status = "Matched";
  else if (sameDate && sameStart && sameTeacher && !sameDuration) status = "Duration Mismatch";
  else if (sameDate && sameStart && sameDuration && !sameTeacher) status = "Teacher Mismatch";
  else if (score >= 80) status = "Probable Match";
  return { reason: reasons.length ? reasons.join("; ") : "Primary key matched.", score, status };
}

function matchRecord(status: SessionMatch["status"], tng: HoursSourceSession | null, classSession: HoursSourceSession | null, score: number, reason: string): SessionMatch {
  const base = tng || classSession;
  return {
    classCourse: classSession?.courseDisplayName || "",
    classDuration: classSession?.durationHours || 0,
    classSession,
    confidence: score,
    date: base?.date || "",
    difference: round2((classSession?.durationHours || 0) - (tng?.durationHours || 0)),
    id: cryptoId(),
    reason,
    status,
    teacher: tng?.compareTeacherName || classSession?.teacherDisplayName || "",
    time: base?.startTime || "",
    tng,
    tngCourse: tng?.courseDisplayName || "",
    tngDuration: tng?.durationHours || 0,
  };
}

export function saveTeacherMappings(mappings: TeacherMappings) {
  localStorage.setItem(aliasStorageKey, JSON.stringify(mappings));
}

export function loadTeacherMappings(): TeacherMappings {
  try {
    return JSON.parse(localStorage.getItem(aliasStorageKey) || "{}") as TeacherMappings;
  } catch {
    return {};
  }
}

export function exportRowsCsv(rows: Array<Record<string, unknown>>) {
  const bodyRows = rows.length ? rows : [{}];
  const headers = Object.keys(bodyRows[0]);
  return [headers.join(","), ...bodyRows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
}

export function teacherExportRows(results: ReconciliationResults) {
  return results.teacherRows.map((row) => ({
    class_list_hours: row.classHours,
    class_list_sessions: row.classSessions.length,
    difference: row.difference,
    status: row.status,
    teach_and_go_hours: row.tngHours,
    teach_and_go_sessions: row.tngSessions.length,
    teacher: row.displayName,
  }));
}

export function courseExportRows(results: ReconciliationResults) {
  return results.courseRows.map((row) => ({
    course: row.displayName,
    hours: row.hours,
    sessions: row.sessions.length,
    source: row.source,
  }));
}

export function sessionExportRows(results: ReconciliationResults) {
  return results.sessionMatches.map((row) => ({
    class_course: row.classCourse,
    class_duration: row.classDuration,
    confidence: row.confidence,
    date: row.date,
    difference: row.difference,
    reason: row.reason,
    status: row.status,
    teacher: row.teacher,
    time: row.time,
    tng_course: row.tngCourse,
    tng_duration: row.tngDuration,
  }));
}

export function fileName(results: ReconciliationResults, kind: string) {
  const branch = normalizeCompact(results.branch) || "branch";
  const month = results.range.start ? results.range.start.slice(0, 7) : "unknown-month";
  return `keaes-hours-cross-check-${branch}-${month}-${kind}.csv`;
}

export function countBy<T>(items: T[], keyFn: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = keyFn(item) || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export function parseDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  if (typeof value === "number") {
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

export function parseHours(value: unknown) {
  if (typeof value === "number") return round2(value);
  const text = clean(value);
  if (!text) return NaN;
  if (/^\d+:\d{2}$/.test(text)) {
    const [hours, minutes] = text.split(":").map(Number);
    return round2(hours + minutes / 60);
  }
  const number = Number(text.replace(/,/g, ""));
  return Number.isFinite(number) ? round2(number) : NaN;
}

export function parseClock(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
  if (typeof value === "number" && value >= 0 && value < 1) {
    const minutes = Math.round(value * 24 * 60);
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  }
  const text = clean(value);
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  return match ? `${pad(match[1])}:${pad(match[2])}` : "";
}

export function parseTimeRange(value: unknown, duration: number) {
  if (value instanceof Date || typeof value === "number") {
    const startTime = parseClock(value);
    return { endTime: addHours(startTime, duration), startTime };
  }
  const text = clean(value);
  const match = text.match(/(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/);
  if (match) return { endTime: `${pad(match[3])}:${pad(match[4])}`, startTime: `${pad(match[1])}:${pad(match[2])}` };
  const startTime = parseClock(text);
  return { endTime: addHours(startTime, duration), startTime };
}

export function addHours(startTime: string, hours: number) {
  if (!startTime || !Number.isFinite(hours)) return "";
  const [hour, minute] = startTime.split(":").map(Number);
  const total = hour * 60 + minute + Math.round(hours * 60);
  return `${pad(Math.floor((total % 1440) / 60))}:${pad(total % 60)}`;
}

export function teacherSimilarity(a: unknown, b: unknown) {
  const aa = personKey(a);
  const bb = personKey(b);
  if (!aa || !bb) return 0;
  if (aa === bb) return 1;
  const aTokens = clean(a).toLowerCase().split(/\s+/).filter(Boolean);
  const bTokens = clean(b).toLowerCase().split(/\s+/).filter(Boolean);
  const firstScore = aTokens[0] && bTokens[0] ? textSimilarity(aTokens[0], bTokens[0]) : 0;
  const prefixScore = aa.startsWith(bb) || bb.startsWith(aa) ? 0.88 : 0;
  return Math.max(textSimilarity(aa, bb), firstScore * 0.9, prefixScore);
}

export function textSimilarity(a: unknown, b: unknown) {
  const aa = normalizeCompact(a);
  const bb = normalizeCompact(b);
  if (!aa || !bb) return 0;
  const longer = aa.length >= bb.length ? aa : bb;
  const shorter = aa.length >= bb.length ? bb : aa;
  return (longer.length - levenshtein(longer, shorter)) / longer.length;
}

function levenshtein(a: string, b: string) {
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

export function aggregateTeachers(sessions: HoursSourceSession[]): Map<string, TeacherReviewCandidate> {
  const map = new Map<string, TeacherAggregate>();
  sessions.forEach((session) => {
    if (!session.teacherKey) return;
    if (!map.has(session.teacherKey)) map.set(session.teacherKey, { hours: 0, key: session.teacherKey, name: session.teacherDisplayName, sessions: 0 });
    const row = map.get(session.teacherKey);
    if (!row) return;
    row.hours += session.durationHours;
    row.sessions += 1;
    if (session.teacherDisplayName.length > row.name.length) row.name = session.teacherDisplayName;
  });
  return new Map([...map.entries()].map(([key, row]) => [key, { ...row, hours: round2(row.hours), score: 1 }]));
}

function detectDateRange(sessions: HoursSourceSession[]) {
  const dates = sessions.map((session) => session.date).filter(Boolean).sort();
  return { end: dates[dates.length - 1] || "", start: dates[0] || "" };
}

function normalizeRow(row: RowObject) {
  const out: RowObject = {};
  Object.entries(row).forEach(([key, value]) => {
    out[normalizeCompact(key)] = value;
  });
  return out;
}

function emptyRow(row: RowObject) {
  return Object.values(row || {}).every((value) => !clean(value));
}

export function clean(value: unknown) {
  return String(value ?? "").normalize("NFKC").replace(/^\uFEFF/, "").replace(/\s+/g, " ").trim();
}

function personKey(value: unknown) {
  return clean(value).toLowerCase().replace(/[.’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function courseKey(value: unknown) {
  return normalizeCompact(value);
}

export function normalizeCompact(value: unknown) {
  return clean(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");
}

function warning(source: string, row: number | string, message: string, raw: RowObject | null): DataQualityWarning {
  return { message, raw, row, source };
}

function sum<T extends Record<string, unknown>>(rows: T[], key: keyof T) {
  return round2(rows.reduce((total, row) => total + (Number(row[key]) || 0), 0));
}

function mostCommon(values: string[]) {
  const counts = countBy(values, (value) => value);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

export function round2(value: unknown) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function pad(value: unknown) {
  return String(value).padStart(2, "0");
}

export function formatDate(value: string) {
  if (!value) return "Not detected";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function formatMonth(value: string) {
  if (!value) return "Detected Month";
  const date = new Date(`${value.slice(0, 7)}-01T00:00:00`);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function formatHours(value: unknown) {
  return round2(value).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export function signedHours(value: unknown) {
  const rounded = round2(value);
  return `${rounded > 0 ? "+" : ""}${formatHours(rounded)}`;
}

export function signedNumber(value: unknown) {
  const number = Number(value) || 0;
  return `${number > 0 ? "+" : ""}${number.toLocaleString()}`;
}

export function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function cryptoId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`.replace(/[^a-z0-9-]/gi, "");
}
