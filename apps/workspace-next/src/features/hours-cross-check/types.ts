export type SourceKind = "tng" | "classList";

export type HoursSourceSession = {
  branch: string;
  classCode?: string;
  classType: string;
  compareTeacherKey: string;
  compareTeacherName?: string;
  courseDisplayName: string;
  courseKey: string;
  date: string;
  durationHours: number;
  endTime: string;
  platform: string;
  raw: Record<string, unknown>;
  source: SourceKind;
  sourceLabel: string;
  sourceRow: number | string;
  startTime: string;
  teacherDisplayName: string;
  teacherKey: string;
  warnings: string[];
};

export type ParsedHoursSource = {
  fileName: string;
  headers: string[];
  sessions: HoursSourceSession[];
  warnings: DataQualityWarning[];
};

export type DataQualityWarning = {
  message: string;
  raw?: Record<string, unknown> | null;
  row: number | string;
  source: string;
};

export type TeacherReviewCandidate = {
  hours: number;
  key: string;
  name: string;
  score: number;
  sessions: number;
};

export type TeacherReviewItem = {
  candidates: TeacherReviewCandidate[];
  selectedClassKey: string;
  status: "Needs review" | "Saved" | "Verified 90%+";
  tngHours: number;
  tngKey: string;
  tngName: string;
};

export type TeacherReview = {
  items: TeacherReviewItem[];
  unmatchedClassTeachers: TeacherReviewCandidate[];
};

export type TeacherHoursRow = {
  classHours: number;
  classSessions: HoursSourceSession[];
  difference: number;
  displayName: string;
  key: string;
  status: "Matched" | "Difference";
  tngHours: number;
  tngSessions: HoursSourceSession[];
};

export type CourseHoursRow = {
  courseKey: string;
  displayName: string;
  hours: number;
  key: string;
  sessions: HoursSourceSession[];
  source: "Teach and Go" | "Class-list";
};

export type SessionMatch = {
  classCourse: string;
  classDuration: number;
  classSession: HoursSourceSession | null;
  confidence: number;
  date: string;
  difference: number;
  id: string;
  reason: string;
  status: "Matched" | "Probable Match" | "Duration Mismatch" | "Teacher Mismatch" | "Needs Review" | "Only in Teach and Go" | "Only in Class-list";
  teacher: string;
  time: string;
  tng: HoursSourceSession | null;
  tngCourse: string;
  tngDuration: number;
};

export type ReconciliationResults = {
  branch: string;
  classSessions: HoursSourceSession[];
  courseRows: CourseHoursRow[];
  generatedAt: string;
  overall: {
    classHours: number;
    classRows: number;
    courses: number;
    difference: number;
    teachers: number;
    tngHours: number;
    tngRows: number;
  };
  range: { end: string; start: string };
  sessionMatches: SessionMatch[];
  teacherRows: TeacherHoursRow[];
  title: string;
  tngSessions: HoursSourceSession[];
  warnings: DataQualityWarning[];
};

export type ParsedHoursBundle = {
  branch: string;
  classList: ParsedHoursSource;
  range: { end: string; start: string };
  tng: ParsedHoursSource;
};

export type TeacherMappings = Record<string, string>;
