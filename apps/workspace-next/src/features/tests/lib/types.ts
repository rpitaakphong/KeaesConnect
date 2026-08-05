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

export type TestQuestion =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | MultiTextQuestion
  | TextQuestion
  | InlineClozeQuestion
  | WritingChoiceQuestion
  | RayDiagramQuestion
  | DiagramAnnotationQuestion
  | BiologicalDrawingQuestion
  | PracticalGraphQuestion
  | VirtualMeasurementQuestion;

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
    scoringStrategy?: "standard" | "investigationPlan";
  }
  | {
    mode: "dependent";
    display: string;
    rule: DependentScoringRule;
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
  category?: "apparatus" | "method" | "measurements" | "controls" | "processing";
};

export type DependentScoringRule =
  | {
    type: "subtractFrom";
    sourceQuestionId: string;
    sourceField?: string;
    minuend: number;
    tolerance?: number;
    accepted?: string[];
  }
  | {
    type: "mean";
    sourceQuestionId: string;
    sourceField?: string;
    fixedValues: number[];
    decimalPlaces?: number;
    tolerance?: number;
    accepted?: string[];
  }
  | {
    type: "product";
    factors: Array<
      | { value: number }
      | { sourceQuestionId: string; sourceField?: string; measurementId?: string; measurementCalibration?: number }
    >;
    tolerance?: number;
    accepted?: string[];
  }
  | {
    type: "scaledSum";
    sourceQuestionIds: string[];
    multiplier: number;
    tolerance?: number;
    accepted?: string[];
  }
  | {
    type: "density";
    massQuestionId: string;
    volumeQuestionId: string;
    valueField: string;
    unitField: string;
    significantFigures: number;
    unitAccepted: string[];
    tolerance?: number;
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
  fields: Array<{
    id: string;
    label: string;
    placeholder?: string;
    visualHtml?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
  compact?: boolean;
  uniqueOptions?: boolean;
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
  wordRange?: { min: number; max: number };
};

export type InlineClozeQuestion = QuestionBase & {
  type: "inlineCloze";
  title?: string;
  paragraphs: Array<Array<
    | { type: "text"; text: string }
    | { type: "gap"; id: string; number: number; options: Array<{ value: string; label: string }> }
  >>;
};

export type WritingChoiceQuestion = QuestionBase & {
  type: "writingChoice";
  options: Array<{
    value: string;
    label: string;
    title: string;
    prompt: string[];
  }>;
  placeholder?: string;
  wordRange: { min: number; max: number };
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

export type DiagramAnnotationQuestion = QuestionBase & {
  type: "diagramAnnotation";
  variant: "curve" | "arrow" | "point" | "doubleArrow";
  backgroundSrc: string;
  backgroundAlt: string;
  geometry:
    | {
      variant: "curve";
      plot: { minX: number; maxX: number; minY: number; maxY: number };
      optimum: { minX: number; maxX: number };
      baselineTolerance: number;
    }
    | {
      variant: "arrow";
      start: { x: number; y: number };
      peak: { x: number; y: number };
      endpointTolerance: number;
      labelTolerance: number;
    }
    | {
      variant: "point";
      segment: { start: { x: number; y: number }; end: { x: number; y: number } };
      tolerance: number;
    }
    | {
      variant: "doubleArrow";
      start: { x: number; y: number };
      end: { x: number; y: number };
      endpointTolerance: number;
      labelRegion: { minX: number; maxX: number; minY: number; maxY: number };
      label: string;
    };
};

export type BiologicalDrawingQuestion = QuestionBase & {
  type: "biologicalDrawing";
  referenceSrc: string;
  referenceAlt: string;
  canvasAspectRatio?: number;
};

export type PracticalGraphQuestion = QuestionBase & {
  type: "practicalGraph";
  data: Array<{ label: string; y: number }>;
  sourceQuestionId: string;
  sourceFields: { first: string; last: string };
  fixedXValues: number[];
  correctAxes: {
    xQuantity: string;
    xUnit: string;
    yQuantity: string;
    yUnit: string;
  };
  scaleOptions: number[];
  pointTolerance: number;
};

export type VirtualMeasurementQuestion = QuestionBase & {
  type: "virtualMeasurement";
  backgroundSrc: string;
  backgroundAlt: string;
  measurements: Array<{
    id: string;
    label: string;
    unit: string;
    expected: number;
    tolerance: number;
    calibration: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
  }>;
};

export type TestAnswers = Record<string, string | Record<string, string | string[]>>;

export type SubmitResult = {
  attemptId?: string;
  total: number;
  possible: number;
  sections?: Record<string, unknown>;
};
