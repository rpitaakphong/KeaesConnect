export type CatalogTest = {
  id: string;
  title: string;
  subject: string;
  level: string;
  status: string;
  totalPoints?: number;
  appPath?: string;
  runtime: "next-shared-engine";
};

export type TestAssignment = {
  assignment_token: string;
  branch?: "ram" | "ekamai" | "";
  test_id: string;
  title?: string;
  subject?: string;
  level?: string;
};

export type AdminResult = {
  branch: "ram" | "ekamai" | "";
  createdBy: {
    email: string;
    id: string;
    name: string;
  };
  id: string;
  testId: string;
  testTitle: string;
  student: {
    fullName: string;
    nickname: string;
    dateOfBirth: string;
    subject: string;
    level: string;
    testDate: string;
  };
  score: {
    total: number;
    possible: number;
    percent: number;
  };
  partScores: AdminPartScore[];
  answers: AdminAnswer[];
  submittedAt: string;
};

export type AdminPartScore = {
  part: string;
  total: number;
  possible: number;
};

export type AdminAnswer = {
  part: string;
  prompt: string;
  response: string;
  correctAnswer: string;
  correct: boolean;
  score: number;
  possible: number;
  gradingDetails?: Record<string, unknown> | null;
  transcript?: string | null;
};
