export type StudentProfile = {
  fullName: string;
  nickname: string;
  dateOfBirth: string;
  subject: string;
  level: string;
  testDate: string;
  testId: string;
  assignmentToken: string;
};

export type TestDefinition = {
  id: string;
  title: string;
  subject: string;
  level: string;
  totalPoints: number;
  status: "active" | "draft" | "legacy";
  durationMinutes?: number;
  audioSrc?: string;
  audioMode?: "standard" | "lockedOnceStarted";
  answerPayload?: "default" | "rwAnswers";
  aiShortAnswerRubrics?: Record<string, string>;
  sections: TestSection[];
};

export type TestSection = {
  id: string;
  label: string;
  title: string;
  hint?: string;
  questionLayout?: "cards" | "grouped";
  groupByQuestionNumber?: boolean;
  visuals?: QuestionVisual[];
  wordBank?: string[];
  storyTitle?: string;
  story?: string[];
  storyImage?: {
    src: string;
    alt: string;
    maxWidth?: number;
  };
  storyLayout?: "default" | "heroImage" | "imageFirst";
  questions: TestQuestion[];
};

export type TestQuestion = SingleChoiceQuestion | MultiChoiceQuestion | MultiTextQuestion | TextQuestion | RayDiagramQuestion;

export type QuestionBase = {
  id: string;
  number: number;
  prompt: string;
  hidePrompt?: boolean;
  promptParts?: Array<{ text: string; underline?: boolean }>;
  points: number;
  note?: string;
  visuals?: QuestionVisual[];
  visualHtml?: string;
  grading?: QuestionGrading;
};

export type QuestionVisual =
  | {
    type: "image";
    src: string;
    alt: string;
    maxWidth?: number;
  }
  | {
    type: "pictograph";
  }
  | {
    type: "solidFaces";
  }
  | {
    type: "clock";
    label: string;
    hour: number;
    minute: number;
  };

export type QuestionGrading =
  | {
    mode: "auto";
    display: string;
    parts: AnswerPart[];
    scoreThresholds?: Array<{ minCorrect: number; points: number }>;
  }
  | {
    mode: "aiSplit";
    display: string;
    contentTerms: string[];
  };

export type AnswerPart = {
  id: string;
  accepted: string[];
  points: number;
  normalizer?: "text" | "time" | "set" | "contains" | "keywords" | "arrowDown";
  keywords?: string[][];
  reviewRecommended?: boolean;
};

export type SingleChoiceQuestion = QuestionBase & {
  type: "singleChoice";
  choices: Array<{ value: string; label: string; image?: string; alt?: string; visualHtml?: string }>;
  choiceTable?: {
    headers: string[];
    rows: Array<{ value: string; cells: string[] }>;
  };
  responseShape?: "value" | "object";
};

export type MultiTextQuestion = QuestionBase & {
  type: "multiText";
  fields: Array<{ id: string; label: string; placeholder?: string; visualHtml?: string }>;
  compact?: boolean;
  inlineRows?: Array<{ className?: string; items: Array<{ text?: string; type?: "input"; id?: string }> }>;
  rankRows?: Array<{ label: string; items: Array<{ text: string; id: string }> }>;
  answerTable?: {
    headers: string[];
    rows: Array<{ cells: Array<{ text?: string; type?: "input"; id?: string; suffix?: string }> }>;
  };
  followupFieldIds?: string[];
};

export type MultiChoiceQuestion = QuestionBase & {
  type: "multiChoice";
  choices: Array<{ value: string; label: string; visualHtml?: string }>;
};

export type TextQuestion = QuestionBase & {
  type: "text";
  inputMode?: "text" | "number" | "textarea";
  placeholder?: string;
};

export type RayDiagramQuestion = QuestionBase & {
  type: "rayDiagram";
  backgroundSrc: string;
  backgroundAlt: string;
  geometry: {
    incidence: { x: number; y: number };
    incidentSource: { x: number; y: number };
    eye: { x: number; y: number };
    normalTolerance: number;
    labelRegion: { minX: number; maxX: number; minY: number; maxY: number };
    eyeTolerance: number;
    angleToleranceDegrees: number;
  };
};

export type TestAnswers = Record<string, string | Record<string, string | string[]>>;

export type SubmitResult = {
  attemptId?: string;
  total: number;
  possible: number;
  sections?: Record<string, unknown>;
};
