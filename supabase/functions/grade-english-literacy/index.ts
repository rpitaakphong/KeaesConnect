const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ShortAnswer = {
  questionId: string;
  prompt: string;
  answer: string;
  rubric: string;
};

type Grade = {
  questionId: string;
  contentCorrect: boolean;
  writingCorrect: boolean;
  contentScore: number;
  writingScore: number;
  score: number;
  feedback: string;
  apology?: boolean;
  reason?: boolean;
  present?: boolean;
  languageScore?: number;
  communicativeAchievementScore?: number;
  organisationScore?: number;
  wordCount?: number;
};

const allowedByTest: Record<string, Set<string>> = {
  "english-literacy-2": new Set(["el2-q21", "el2-q22", "el2-q23", "el2-q24"]),
  "english-literacy-3": new Set(["el3-q26", "el3-q27", "el3-q28", "el3-q29", "el3-q30"]),
  "english-literacy-4": new Set(["el4-q26", "el4-q27", "el4-q28", "el4-q29", "el4-q30"]),
  "english-literacy-5": new Set(["el5-q26", "el5-q27", "el5-q28", "el5-q29", "el5-q30"]),
  "spip-year-7-english-pre": new Set(["spip-y7e-w1"]),
  "spip-year-8-english-pre": new Set(["spip-y8e-w1", "spip-y8e-w2"]),
};

const expectedCounts: Record<string, number> = {
  "english-literacy-2": 4,
  "english-literacy-3": 5,
  "english-literacy-4": 5,
  "english-literacy-5": 5,
  "spip-year-7-english-pre": 1,
  "spip-year-8-english-pre": 2,
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "OPENAI_API_KEY is not configured" }, 500);
    }

    const payload = await request.json();
    const testId = String(payload?.testId || "");
    if (!allowedByTest[testId]) {
      return jsonResponse({ error: "Unsupported test" }, 400);
    }

    const answers = normalizeAnswers(testId, payload?.answers);
    if (answers.length !== expectedCounts[testId]) {
      return jsonResponse({ error: `Expected ${expectedCounts[testId]} short answers for ${testId}` }, 400);
    }

    const blankGrades = answers
      .filter((answer) => !answer.answer)
      .map((answer) => [
        answer.questionId,
        testId === "spip-year-7-english-pre"
          ? spipBlankGrade(answer.questionId)
          : testId === "spip-year-8-english-pre"
            ? spipYear8BlankGrade(answer.questionId)
            : blankGrade(answer.questionId),
      ]);
    const answersToGrade = answers.filter((answer) => answer.answer);
    const aiGrades = answersToGrade.length
      ? testId === "spip-year-7-english-pre"
        ? await gradeSpipWritingWithOpenAI(apiKey, testId, answersToGrade)
        : testId === "spip-year-8-english-pre"
          ? await gradeSpipYear8WritingWithOpenAI(apiKey, testId, answersToGrade)
          : await gradeWithOpenAI(apiKey, testId, answersToGrade)
      : {};

    return jsonResponse({
      grades: {
        ...Object.fromEntries(blankGrades),
        ...aiGrades,
      },
    });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "AI grading failed" }, 500);
  }
});

function normalizeAnswers(testId: string, value: unknown): ShortAnswer[] {
  if (!Array.isArray(value)) throw new Error("answers must be an array");
  const allowedQuestionIds = allowedByTest[testId];
  return value.map((item) => {
    const answer = item as Record<string, unknown>;
    const questionId = String(answer.questionId || "");
    if (!allowedQuestionIds.has(questionId)) throw new Error(`Unsupported question: ${questionId}`);
    return {
      questionId,
      prompt: String(answer.prompt || ""),
      answer: String(answer.answer || "").trim(),
      rubric: String(answer.rubric || ""),
    };
  });
}

async function gradeSpipWritingWithOpenAI(apiKey: string, testId: string, answers: ShortAnswer[]): Promise<Record<string, Grade>> {
  const model = Deno.env.get("OPENAI_GRADING_MODEL") || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            "You grade a Year 7 English card-writing task worth 5 marks.",
            "The student must write 35-45 words to an English friend, Jo, who invited them to a birthday party they cannot attend.",
            "Award 1 content mark for an apology, 1 content mark for explaining why they cannot go, and 1 content mark for saying what present they are sending.",
            "Award 0, 1, or 2 language marks for understandable age-appropriate English, card-like greeting/signoff or tone, grammar, spelling, clarity, and reasonable adherence to 35-45 words.",
            "Do not require perfect grammar. Penalize blank, random, copied prompt-only, or unrelated answers.",
            "The final score must equal contentScore plus languageScore and must be between 0 and 5.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({ testId, answers }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "spip_writing_grade",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["grades"],
            properties: {
              grades: {
                type: "array",
                minItems: answers.length,
                maxItems: answers.length,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: [
                    "questionId",
                    "apology",
                    "reason",
                    "present",
                    "contentScore",
                    "languageScore",
                    "wordCount",
                    "score",
                    "feedback",
                  ],
                  properties: {
                    questionId: { type: "string", enum: answers.map((answer) => answer.questionId) },
                    apology: { type: "boolean" },
                    reason: { type: "boolean" },
                    present: { type: "boolean" },
                    contentScore: { type: "number", enum: [0, 1, 2, 3] },
                    languageScore: { type: "number", enum: [0, 1, 2] },
                    wordCount: { type: "number" },
                    score: { type: "number", enum: [0, 1, 2, 3, 4, 5] },
                    feedback: { type: "string", maxLength: 260 },
                  },
                },
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI SPIP writing grading request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const text = data.output_text || extractOutputText(data);
  if (!text) throw new Error("OpenAI response did not include SPIP writing grading JSON");
  const parsed = JSON.parse(text) as { grades: Grade[] };
  return Object.fromEntries(parsed.grades.map((grade) => {
    const normalized = normalizeSpipWritingGrade(grade);
    return [normalized.questionId, normalized];
  }));
}

async function gradeSpipYear8WritingWithOpenAI(apiKey: string, testId: string, answers: ShortAnswer[]): Promise<Record<string, Grade>> {
  const model = Deno.env.get("OPENAI_GRADING_MODEL") || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            "You grade two SPIP Year 8 English writing responses using a B2 First-style analytic rubric.",
            "Each response is worth 20 marks: Content 0-5, Communicative Achievement 0-5, Organisation 0-5, and Language 0-5.",
            "Content measures how fully and accurately the response addresses every task point in its supplied prompt.",
            "Communicative Achievement measures genre, register, tone, and effect on the target reader.",
            "Organisation measures coherence, paragraphing, linking, and progression.",
            "Language measures range and control of vocabulary and grammar; errors may occur if meaning remains clear.",
            "The selected Part 2 task is included in that answer's prompt. Grade only against the selected task.",
            "Both responses should contain 140-190 words. Treat the word range as part of task fulfilment, but do not automatically give zero outside it.",
            "Blank, copied-prompt-only, random, or unrelated responses receive zero. The final score must equal the four criterion scores and remain between 0 and 20.",
          ].join(" "),
        },
        { role: "user", content: JSON.stringify({ testId, answers }) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "spip_year_8_writing_grades",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["grades"],
            properties: {
              grades: {
                type: "array",
                minItems: answers.length,
                maxItems: answers.length,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: [
                    "questionId",
                    "contentScore",
                    "communicativeAchievementScore",
                    "organisationScore",
                    "languageScore",
                    "wordCount",
                    "score",
                    "feedback",
                  ],
                  properties: {
                    questionId: { type: "string", enum: answers.map((answer) => answer.questionId) },
                    contentScore: { type: "number", enum: [0, 1, 2, 3, 4, 5] },
                    communicativeAchievementScore: { type: "number", enum: [0, 1, 2, 3, 4, 5] },
                    organisationScore: { type: "number", enum: [0, 1, 2, 3, 4, 5] },
                    languageScore: { type: "number", enum: [0, 1, 2, 3, 4, 5] },
                    wordCount: { type: "number" },
                    score: { type: "number", enum: Array.from({ length: 21 }, (_, index) => index) },
                    feedback: { type: "string", maxLength: 420 },
                  },
                },
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI SPIP Year 8 writing grading request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const text = data.output_text || extractOutputText(data);
  if (!text) throw new Error("OpenAI response did not include SPIP Year 8 writing grading JSON");
  const parsed = JSON.parse(text) as { grades: Grade[] };
  return Object.fromEntries(parsed.grades.map((grade) => {
    const normalized = normalizeSpipYear8WritingGrade(grade);
    return [normalized.questionId, normalized];
  }));
}

function blankGrade(questionId: string): Grade {
  return {
    questionId,
    contentCorrect: false,
    writingCorrect: false,
    contentScore: 0,
    writingScore: 0,
    score: 0,
    feedback: "No answer.",
  };
}

function spipBlankGrade(questionId: string): Grade {
  return {
    questionId,
    contentCorrect: false,
    writingCorrect: false,
    apology: false,
    reason: false,
    present: false,
    contentScore: 0,
    writingScore: 0,
    languageScore: 0,
    wordCount: 0,
    score: 0,
    feedback: "No answer.",
  };
}

function spipYear8BlankGrade(questionId: string): Grade {
  return {
    questionId,
    contentCorrect: false,
    writingCorrect: false,
    contentScore: 0,
    writingScore: 0,
    communicativeAchievementScore: 0,
    organisationScore: 0,
    languageScore: 0,
    wordCount: 0,
    score: 0,
    feedback: "No answer.",
  };
}

async function gradeWithOpenAI(apiKey: string, testId: string, answers: ShortAnswer[]): Promise<Record<string, Grade>> {
  const model = Deno.env.get("OPENAI_GRADING_MODEL") || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            "You grade short written answers for an English literacy assessment for children.",
            "Each answer is worth 1 point split into two criteria.",
            "Award contentScore 0.5 when the student's answer clearly matches the rubric meaning; otherwise 0.",
            "Award writingScore 0.5 when the answer is understandable and age-appropriate in grammar, spelling, capitalization, and sentence clarity; otherwise 0.",
            "Do not require perfect punctuation or adult-level grammar.",
            "A wrong but clearly written answer may receive writingScore 0.5.",
            "A content-correct answer with unclear writing may receive only contentScore 0.5.",
            "Blank, random, unreadable, or unrelated answers receive 0 for both criteria.",
            "The score must equal contentScore plus writingScore.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({ testId, answers }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "english_literacy_split_grades",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["grades"],
            properties: {
              grades: {
                type: "array",
                minItems: answers.length,
                maxItems: answers.length,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: [
                    "questionId",
                    "contentCorrect",
                    "writingCorrect",
                    "contentScore",
                    "writingScore",
                    "score",
                    "feedback",
                  ],
                  properties: {
                    questionId: { type: "string", enum: answers.map((answer) => answer.questionId) },
                    contentCorrect: { type: "boolean" },
                    writingCorrect: { type: "boolean" },
                    contentScore: { type: "number", enum: [0, 0.5] },
                    writingScore: { type: "number", enum: [0, 0.5] },
                    score: { type: "number", enum: [0, 0.5, 1] },
                    feedback: { type: "string", maxLength: 220 },
                  },
                },
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI grading request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const text = data.output_text || extractOutputText(data);
  if (!text) throw new Error("OpenAI response did not include grading JSON");
  const parsed = JSON.parse(text) as { grades: Grade[] };
  return Object.fromEntries(parsed.grades.map((grade) => {
    const normalized = normalizeGrade(grade);
    return [normalized.questionId, normalized];
  }));
}

function normalizeGrade(grade: Grade): Grade {
  const contentScore = grade.contentCorrect || grade.contentScore === 0.5 ? 0.5 : 0;
  const writingScore = grade.writingCorrect || grade.writingScore === 0.5 ? 0.5 : 0;
  const score = (contentScore + writingScore) as 0 | 0.5 | 1;
  return {
    questionId: String(grade.questionId || ""),
    contentCorrect: contentScore === 0.5,
    writingCorrect: writingScore === 0.5,
    contentScore,
    writingScore,
    score,
    feedback: String(grade.feedback || ""),
  };
}

function normalizeSpipWritingGrade(grade: Grade): Grade {
  const contentScore = Math.min(Math.max(Number(grade.contentScore || 0), 0), 3);
  const languageScore = Math.min(Math.max(Number(grade.languageScore ?? grade.writingScore ?? 0), 0), 2);
  const score = Math.min(Math.max(contentScore + languageScore, 0), 5);
  return {
    questionId: String(grade.questionId || ""),
    contentCorrect: contentScore >= 3,
    writingCorrect: languageScore >= 2,
    apology: Boolean(grade.apology),
    reason: Boolean(grade.reason),
    present: Boolean(grade.present),
    contentScore,
    writingScore: languageScore,
    languageScore,
    wordCount: Number(grade.wordCount || 0),
    score,
    feedback: String(grade.feedback || ""),
  };
}

function normalizeSpipYear8WritingGrade(grade: Grade): Grade {
  const contentScore = clampCriterion(grade.contentScore);
  const communicativeAchievementScore = clampCriterion(grade.communicativeAchievementScore);
  const organisationScore = clampCriterion(grade.organisationScore);
  const languageScore = clampCriterion(grade.languageScore);
  const score = Math.min(contentScore + communicativeAchievementScore + organisationScore + languageScore, 20);
  return {
    questionId: String(grade.questionId || ""),
    contentCorrect: contentScore >= 3,
    writingCorrect: languageScore >= 3,
    contentScore,
    writingScore: communicativeAchievementScore + organisationScore + languageScore,
    communicativeAchievementScore,
    organisationScore,
    languageScore,
    wordCount: Math.max(0, Number(grade.wordCount || 0)),
    score,
    feedback: String(grade.feedback || ""),
  };
}

function clampCriterion(value: unknown) {
  return Math.min(Math.max(Math.round(Number(value || 0)), 0), 5);
}

function extractOutputText(data: unknown): string {
  const response = data as { output?: Array<{ content?: Array<{ text?: string }> }> };
  return response.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("") || "";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
