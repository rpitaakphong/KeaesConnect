import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");

loadDotEnv(path.join(appRoot, ".env.local"));

const contracts = {
  "english-literacy-2": ["el2-q21", "el2-q22", "el2-q23", "el2-q24"],
  "english-literacy-3": ["el3-q26", "el3-q27", "el3-q28", "el3-q29", "el3-q30"],
  "english-literacy-4": ["el4-q26", "el4-q27", "el4-q28", "el4-q29", "el4-q30"],
  "english-literacy-5": ["el5-q26", "el5-q27", "el5-q28", "el5-q29", "el5-q30"],
  "spip-year-7-english-pre": ["spip-y7e-w1"],
  "spip-year-8-english-pre": ["spip-y8e-w1", "spip-y8e-w2"],
};

const options = parseArgs(process.argv.slice(2));
const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

async function main() {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.");
  }
  if (options.nonblank && !options.testId) {
    throw new Error("Use --nonblank together with --test-id to avoid unintended live grading requests.");
  }
  if (options.testId && !contracts[options.testId]) {
    throw new Error(`Unknown grader contract: ${options.testId}`);
  }

  const selectedContracts = options.testId
    ? [[options.testId, contracts[options.testId]]]
    : Object.entries(contracts);

  for (const [testId, questionIds] of selectedContracts) {
    const answers = questionIds.map((questionId) => ({
      questionId,
      prompt: "Deployment contract verification",
      answer: options.nonblank ? diagnosticAnswer(testId, questionId) : "",
      rubric: "Return a valid score within the configured range.",
    }));
    const response = await fetch(`${supabaseUrl}/functions/v1/grade-english-literacy`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ testId, assignmentToken: "grader-contract-smoke", answers }),
    });
    const body = await readJson(response);
    if (!response.ok) {
      throw new Error(`${testId}: grader returned HTTP ${response.status}: ${String(body?.error || "Unknown error")}`);
    }
    if (body?.graderContractVersion !== 3) {
      throw new Error(`${testId}: expected grader contract version 3, received ${String(body?.graderContractVersion || "none")}.`);
    }
    for (const questionId of questionIds) {
      const grade = body?.grades?.[questionId];
      if (!grade || typeof grade.score !== "number") {
        throw new Error(`${testId}: missing numeric grade for ${questionId}.`);
      }
      if (testId === "spip-year-8-english-pre" && (grade.score < 0 || grade.score > 10)) {
        throw new Error(`${testId}: ${questionId} returned an out-of-range score of ${grade.score}/10.`);
      }
      if (testId === "spip-year-8-english-pre" && options.nonblank) {
        const rawScore = [
          grade.contentScore,
          grade.communicativeAchievementScore,
          grade.organisationScore,
          grade.languageScore,
        ].reduce((total, value) => total + Number(value || 0), 0);
        if (grade.rawScore !== rawScore || grade.score !== rawScore / 2) {
          throw new Error(`${testId}: ${questionId} did not scale its raw B2 criteria correctly.`);
        }
      }
    }
    console.log(`${testId}: passed (${questionIds.length} grades, contract v${body.graderContractVersion})`);
  }
}

function parseArgs(args) {
  const options = { nonblank: false, testId: "" };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--nonblank") options.nonblank = true;
    else if (arg === "--test-id") options.testId = args[++index] || "";
    else if (arg.startsWith("--test-id=")) options.testId = arg.slice("--test-id=".length);
  }
  return options;
}

function diagnosticAnswer(testId, questionId) {
  if (testId === "spip-year-8-english-pre") {
    return [
      "This is a controlled deployment check for the writing grader.",
      "It contains a relevant response with complete sentences, organised ideas, and appropriate language.",
      "The purpose is only to verify that the configured model returns every required scoring criterion.",
      `The response identifier is ${questionId}.`,
    ].join(" ");
  }
  return "This controlled response verifies that the deployed grading service can return a valid result.";
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function loadDotEnv(filename) {
  if (!existsSync(filename)) return;
  const text = readFileSync(filename, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = unquoteEnv(match[2]);
  }
}

function unquoteEnv(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
