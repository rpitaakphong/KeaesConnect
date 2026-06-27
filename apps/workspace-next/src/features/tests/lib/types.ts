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
  wordBank?: string[];
  storyTitle?: string;
  story?: string[];
  storyImage?: {
    src: string;
    alt: string;
    maxWidth?: number;
  };
  storyLayout?: "default" | "heroImage";
  questions: TestQuestion[];
};

export type TestQuestion = SingleChoiceQuestion | MultiChoiceQuestion | MultiTextQuestion | TextQuestion;

export type QuestionBase = {
  id: string;
  number: number;
  prompt: string;
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
  normalizer?: "text" | "time" | "set" | "keywords" | "arrowDown";
  keywords?: string[][];
  reviewRecommended?: boolean;
};

export type SingleChoiceQuestion = QuestionBase & {
  type: "singleChoice";
  choices: Array<{ value: string; label: string; image?: string; alt?: string; visualHtml?: string }>;
  responseShape?: "value" | "object";
};

export type MultiTextQuestion = QuestionBase & {
  type: "multiText";
  fields: Array<{ id: string; label: string; placeholder?: string; visualHtml?: string }>;
  compact?: boolean;
  inlineRows?: Array<{ items: Array<{ text?: string; type?: "input"; id?: string }> }>;
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

export type TestAnswers = Record<string, string | Record<string, string | string[]>>;

export type SubmitResult = {
  attemptId?: string;
  total: number;
  possible: number;
  sections?: Record<string, unknown>;
};
