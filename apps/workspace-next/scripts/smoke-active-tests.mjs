import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createClient } from "@supabase/supabase-js";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "../..");
const srcRoot = path.join(appRoot, "src");
const outputRoot = path.join(repoRoot, "output", "playwright");
const runId = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z");
const runDir = path.join(outputRoot, `active-test-smoke-${runId}`);

mkdirSync(runDir, { recursive: true });
loadDotEnv(path.join(appRoot, ".env.local"));

const options = parseArgs(process.argv.slice(2));
const baseUrl = normalizeBaseUrl(options.baseUrl || process.env.E2E_BASE_URL || "http://127.0.0.1:3000");
const staffEmail = process.env.E2E_STAFF_EMAIL || process.env.STAFF_EMAIL || "";
const staffPassword = process.env.E2E_STAFF_PASSWORD || process.env.STAFF_PASSWORD || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const fixedDob = options.dob || process.env.E2E_STUDENT_DOB || "2014-01-15";
const fixedTestDate = options.testDate || new Date().toISOString().slice(0, 10);
const headless = options.headful ? false : process.env.E2E_HEADLESS !== "false";
const submitTimeoutMs = Number(options.submitTimeoutMs || process.env.E2E_SUBMIT_TIMEOUT_MS || 90000);

let devServer = null;

main()
  .then((summary) => {
    process.exitCode = summary.failed > 0 ? 1 : 0;
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    if (devServer) devServer.kill("SIGTERM");
  });

async function main() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local.");
  }
  if (!staffEmail || !staffPassword) {
    throw new Error(
      "Missing staff credentials. Run with E2E_STAFF_EMAIL and E2E_STAFF_PASSWORD for an account with generate_links and view_reports permissions.",
    );
  }

  const { chromium } = await importPlaywright();
  const registry = loadTsModule(path.join(srcRoot, "features/tests/content/registry.ts"));
  const allDefinitions = registry.getAllTestDefinitions();
  const selectedIds = options.testIds.length ? new Set(options.testIds) : null;
  const definitionActiveTests = allDefinitions.filter((test) => test.status === "active" && (!selectedIds || selectedIds.has(test.id)));

  if (definitionActiveTests.length === 0) {
    throw new Error("No active tests matched the requested filter.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const signIn = await supabase.auth.signInWithPassword({ email: staffEmail, password: staffPassword });
  if (signIn.error) throw new Error(`Staff sign-in failed: ${signIn.error.message}`);

  const databaseStatuses = await getDatabaseStatuses(supabase, definitionActiveTests.map((test) => test.id));
  const activeTests = definitionActiveTests.filter((test) => databaseStatuses.get(test.id)?.status === "active");
  const inactiveDefinitions = allDefinitions.filter((test) => test.status !== "active");
  const skippedInactiveActiveDefs = definitionActiveTests.filter((test) => databaseStatuses.get(test.id)?.status !== "active");
  const limitedTests = options.limit ? activeTests.slice(0, options.limit) : activeTests;
  if (limitedTests.length === 0) {
    throw new Error("No tests are active in both the registry and the Supabase tests catalog.");
  }

  await ensureServer(baseUrl);

  const browser = await chromium.launch({ headless });
  const results = [];
  try {
    const adminContext = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    const adminPage = await adminContext.newPage();
    await loginAdminThroughUi(adminPage, baseUrl, staffEmail, staffPassword);
    await openAdminTests(adminPage, baseUrl);
    for (const test of limitedTests) {
      const startedAt = new Date().toISOString();
      const result = {
        testId: test.id,
        title: test.title,
        startedAt,
        status: "pending",
        assignmentToken: "",
        attemptId: "",
        scoreTotal: null,
        scorePossible: null,
        expectedPossible: expectedPossible(test),
        objectiveExpected: 0,
        manualReviewPoints: 0,
        missingPoints: null,
        hasAiGrading: hasAiGrading(test),
        screenshot: "",
        adminVerified: false,
        error: "",
      };
      results.push(result);
      console.log(`Running ${test.id}...`);
      try {
        const assignmentUrl = await generateAssignmentThroughAdminUi(adminPage, test);
        result.assignmentToken = new URL(assignmentUrl).searchParams.get("assignment") || "";
        if (!result.assignmentToken) throw new Error(`Generated admin URL did not contain an assignment token: ${assignmentUrl}`);
        const answers = buildAnswers(test);
        const profile = buildProfile(test, result.assignmentToken, fixedDob, fixedTestDate);
        const submitResult = await submitThroughBrowser(browser, baseUrl, test, result.assignmentToken, profile, answers, submitTimeoutMs);
        result.attemptId = submitResult.attemptId || "";
        result.scoreTotal = Number(submitResult.total);
        result.scorePossible = Number(submitResult.possible);
        result.screenshot = submitResult.screenshot || "";
        result.adminVerified = await verifyAdminResult(supabase, result.attemptId, test.id);
        const scoring = scoringExpectation(test);
        result.objectiveExpected = scoring.objectiveExpected;
        result.manualReviewPoints = scoring.manualReviewPoints;
        result.missingPoints = Math.max(0, result.scorePossible - result.scoreTotal);

        const objectiveFullCredit = !result.hasAiGrading
          && nearlyEqual(result.scorePossible, result.expectedPossible)
          && result.scoreTotal >= result.objectiveExpected
          && result.missingPoints <= result.manualReviewPoints;
        const aiCompleted = result.hasAiGrading && Boolean(result.attemptId) && result.scorePossible === result.expectedPossible;
        if (!result.adminVerified) throw new Error("Submission returned an attempt id, but get_admin_result did not verify it.");
        if (!objectiveFullCredit && !aiCompleted) {
          throw new Error(
            `Unexpected score ${result.scoreTotal}/${result.scorePossible}; expected possible ${result.expectedPossible}, objective ${result.objectiveExpected}, manual-review allowance ${result.manualReviewPoints}.`,
          );
        }
        result.status = "passed";
      } catch (error) {
        result.status = "failed";
        result.error = error instanceof Error ? error.message : String(error);
        result.screenshot = error?.screenshotPath || await safeFailureScreenshot(browser, test.id);
        console.error(`Failed ${test.id}: ${result.error}`);
      }
      result.finishedAt = new Date().toISOString();
      writeArtifacts(results, allDefinitions, inactiveDefinitions, skippedInactiveActiveDefs);
    }
    await adminContext.close();
  } finally {
    await browser.close();
  }

  const blockedDrafts = await verifyInactiveDraftsBlocked(supabase, inactiveDefinitions);
  const summary = writeArtifacts(results, allDefinitions, inactiveDefinitions, skippedInactiveActiveDefs, blockedDrafts);
  console.log(`\nSmoke report: ${summary.reportPath}`);
  console.log(`JSON report: ${summary.jsonPath}`);
  console.log(`${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped.`);
  return summary;
}

function parseArgs(args) {
  const parsed = {
    baseUrl: "",
    dob: "",
    headful: false,
    limit: 0,
    submitTimeoutMs: "",
    testDate: "",
    testIds: [],
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--headful") parsed.headful = true;
    else if (arg === "--base-url") parsed.baseUrl = args[++index] || "";
    else if (arg === "--dob") parsed.dob = args[++index] || "";
    else if (arg === "--test-date") parsed.testDate = args[++index] || "";
    else if (arg === "--limit") parsed.limit = Number(args[++index] || 0);
    else if (arg === "--submit-timeout-ms") parsed.submitTimeoutMs = args[++index] || "";
    else if (arg === "--test-id") parsed.testIds.push(args[++index] || "");
    else if (arg.startsWith("--test-id=")) parsed.testIds.push(arg.slice("--test-id=".length));
  }
  parsed.testIds = parsed.testIds.filter(Boolean);
  return parsed;
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

async function importPlaywright() {
  try {
    return await import("playwright");
  } catch {
    throw new Error("Playwright is unavailable. Run `npm install` in apps/workspace-next, then retry `npm run smoke:active-tests`.");
  }
}

async function ensureServer(url) {
  if (await canFetch(url)) return;

  const logPath = path.join(runDir, "dev-server.log");
  const log = [];
  devServer = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1"], {
    cwd: appRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  devServer.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    log.push(text);
    writeFileSync(logPath, log.join(""));
  });
  devServer.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    log.push(text);
    writeFileSync(logPath, log.join(""));
  });

  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (await canFetch(url)) return;
    await delay(500);
  }
  throw new Error(`Dev server did not become reachable at ${url}. See ${logPath}`);
}

async function canFetch(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function getDatabaseStatuses(supabase, testIds) {
  const { data, error } = await supabase.from("tests").select("id,status").in("id", testIds);
  if (error) throw new Error(`Could not read tests catalog from Supabase: ${error.message}`);
  return new Map((data || []).map((row) => [String(row.id), { status: String(row.status || "") }]));
}

async function createAssignment(supabase, testId) {
  const { data, error } = await supabase.rpc("create_test_assignment", { p_test_id: testId });
  if (error) throw new Error(`create_test_assignment failed: ${error.message}`);
  const assignment = Array.isArray(data) ? data[0] : data;
  if (!assignment?.assignment_token) throw new Error("create_test_assignment did not return an assignment token.");
  return assignment;
}

async function loginAdminThroughUi(page, baseUrl, email, password) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Continue to Dashboard" }).click();
  await page.waitForURL((url) => url.pathname === "/dashboard", { timeout: 20000 });
}

async function openAdminTests(page, baseUrl) {
  await page.goto(`${baseUrl}/admin/tests`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Available tests", { timeout: 20000 });
  await page.waitForSelector("text=Database mode", { timeout: 20000 }).catch(() => {});
}

async function generateAssignmentThroughAdminUi(page, test) {
  await openAdminTests(page, page.url().replace(/\/admin\/tests.*$/, ""));
  const testButton = page.locator("button.test-list-item").filter({ hasText: test.title }).first();
  await testButton.waitFor({ timeout: 20000 });
  await testButton.click();
  const shareUrlInput = page.getByLabel("Share URL");
  await shareUrlInput.fill("").catch(() => {});
  await page.getByRole("button", { name: "Generate assignment link" }).click();
  await page.waitForFunction(() => {
    const labels = Array.from(document.querySelectorAll("label"));
    const shareLabel = labels.find((label) => label.textContent?.includes("Share URL"));
    const input = shareLabel?.querySelector("input");
    return Boolean(input?.value && input.value.includes("assignment="));
  }, null, { timeout: 20000 });
  return shareUrlInput.inputValue();
}

function buildProfile(test, assignmentToken, dateOfBirth, testDate) {
  return {
    fullName: `E2E Smoke ${runId} ${test.id}`,
    nickname: "Smoke",
    dateOfBirth,
    subject: test.subject,
    level: test.level,
    testDate,
    testId: test.id,
    assignmentToken,
  };
}

function buildAnswers(test) {
  return Object.fromEntries(test.sections.flatMap((section) => section.questions.map((question) => [question.id, answerForQuestion(question)])));
}

function answerForQuestion(question) {
  if (!question.grading) return "";
  if (question.grading.mode === "aiSplit") return aiAnswerForQuestion(question);

  if (question.type === "singleChoice") {
    const value = question.grading.parts.find((part) => part.id === "answer")?.accepted?.[0] || "";
    return question.responseShape === "object" ? { answer: value } : value;
  }

  if (question.type === "text") {
    const part = question.grading.parts.find((item) => item.id === "answer") || question.grading.parts[0];
    return answerForPart(part);
  }

  const answer = {};
  for (const part of question.grading.parts) {
    const nextAnswer = answerForPart(part);
    answer[part.id] = mergePartAnswer(answer[part.id], nextAnswer);
  }
  return answer;
}

function answerForPart(part) {
  if (part.normalizer === "set") return [...part.accepted];
  if (part.normalizer === "keywords" && part.keywords?.length) return part.keywords.map((group) => group.join(" ")).join(" ");
  return part.accepted?.[0] || "";
}

function mergePartAnswer(current, next) {
  if (!current) return next;
  if (!next) return current;
  if (Array.isArray(current) && Array.isArray(next)) return Array.from(new Set([...current, ...next]));
  if (Array.isArray(current)) return current;
  if (Array.isArray(next)) return next;
  return `${current} ${next}`.replace(/\s+/g, " ").trim();
}

function aiAnswerForQuestion(question) {
  const terms = question.grading.contentTerms || [];
  if (terms.length) return `${terms[0]} is the answer because it matches the question.`;
  return question.grading.display || "This is a complete short answer.";
}

async function submitThroughBrowser(browser, baseUrl, test, assignmentToken, profile, answers, timeoutMs) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();
  const storageKey = assignmentToken || test.id;
  const startUrl = `${baseUrl}/tests/${test.id}/start?assignment=${encodeURIComponent(assignmentToken)}`;
  const takeUrl = `${baseUrl}/tests/${test.id}/take?assignment=${encodeURIComponent(assignmentToken)}`;

  try {
    await page.goto(startUrl, { waitUntil: "networkidle" });
    await page.waitForSelector('button:has-text("Start test"):not([disabled])', { timeout: 15000 });
    await page.getByLabel("Full name").fill(profile.fullName);
    await page.getByLabel("Nickname").fill(profile.nickname);
    await page.getByLabel("Date of birth").fill(profile.dateOfBirth);
    await page.getByLabel("Test date").fill(profile.testDate);
    await page.getByRole("button", { name: "Start test" }).click();
    await page.waitForURL(
      (url) => url.pathname === `/tests/${test.id}/take` && url.searchParams.get("assignment") === assignmentToken,
      { timeout: 15000 },
    );
    await page.getByRole("heading", { name: test.title }).waitFor({ timeout: 15000 });
    await page.evaluate(
      ({ answersValue, storageKeyValue }) => {
        window.sessionStorage.setItem(`keaes-test-answers-v1:${storageKeyValue}`, JSON.stringify(answersValue));
      },
      { answersValue: answers, storageKeyValue: storageKey },
    );
    await page.goto(takeUrl, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: test.title }).waitFor({ timeout: 15000 });
    await page.getByRole("button", { name: "Review and Submit" }).click();
    const submitAttemptResponse = waitForSubmitAttemptResponse(page, timeoutMs);
    await page.getByRole("button", { name: "Submit test" }).click();
    await page.waitForSelector("text=Total score", { timeout: timeoutMs });
    const resultText = await page.locator(".notice").filter({ hasText: "Total score" }).innerText({ timeout: 5000 });
    const match = /Total score\s+([0-9.]+)\/([0-9.]+)/i.exec(resultText.replace(/\s+/g, " "));
    const rpcResult = await submitAttemptResponse;
    const screenshotPath = path.join(runDir, `${test.id}-passed.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await context.close();
    return {
      attemptId: rpcResult?.attemptId || "",
      total: Number(rpcResult?.total ?? (match ? Number(match[1]) : NaN)),
      possible: Number(rpcResult?.possible ?? (match ? Number(match[2]) : NaN)),
      screenshot: screenshotPath,
    };
  } catch (error) {
    const screenshotPath = path.join(runDir, `${test.id}-failed.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    await context.close();
    if (error && typeof error === "object") error.screenshotPath = screenshotPath;
    throw error;
  }
}

function waitForSubmitAttemptResponse(page, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for submit_attempt RPC response."));
    }, timeoutMs);
    async function handleResponse(response) {
      if (!response.url().includes("/rpc/submit_attempt")) return;
      cleanup();
      try {
        resolve(await response.json());
      } catch (error) {
        reject(new Error(`Could not parse submit_attempt response: ${error instanceof Error ? error.message : String(error)}`));
      }
    }
    function cleanup() {
      clearTimeout(timeout);
      page.off("response", handleResponse);
    }
    page.on("response", handleResponse);
  });
}

async function verifyAdminResult(supabase, attemptId, testId) {
  if (!attemptId) return false;
  const { data, error } = await supabase.rpc("get_admin_result", { p_attempt_id: attemptId });
  if (error) throw new Error(`get_admin_result failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return row?.test_id === testId || row?.testId === testId;
}

async function safeFailureScreenshot(browser, testId) {
  const pages = browser.contexts().flatMap((context) => context.pages());
  const page = pages[pages.length - 1];
  if (!page) return "";
  const screenshotPath = path.join(runDir, `${testId}-last-page.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
  return screenshotPath;
}

async function verifyInactiveDraftsBlocked(supabase, inactiveDefinitions) {
  const checks = [];
  for (const test of inactiveDefinitions) {
    const check = { testId: test.id, clientStatus: test.status, blocked: false, message: "" };
    try {
      await createAssignment(supabase, test.id);
      check.message = "Assignment unexpectedly created.";
    } catch (error) {
      check.blocked = true;
      check.message = error instanceof Error ? error.message : String(error);
    }
    checks.push(check);
  }
  return checks;
}

function expectedPossible(test) {
  return test.sections.reduce((sum, section) => sum + section.questions.reduce((partSum, question) => partSum + Number(question.points || 0), 0), 0);
}

function hasAiGrading(test) {
  return test.sections.some((section) => section.questions.some((question) => question.grading?.mode === "aiSplit"));
}

function scoringExpectation(test) {
  const possible = expectedPossible(test);
  const manualReviewPoints = test.sections.reduce((sum, section) => (
    sum + section.questions.reduce((questionSum, question) => questionSum + manualReviewPointsForQuestion(question), 0)
  ), 0);
  return {
    possible,
    objectiveExpected: Math.max(0, possible - manualReviewPoints),
    manualReviewPoints,
  };
}

function manualReviewPointsForQuestion(question) {
  if (!question.grading || question.grading.mode !== "auto") return 0;
  const manualPartPoints = question.grading.parts
    .filter((part) => isManualReviewPart(part))
    .reduce((sum, part) => sum + Number(part.points || 0), 0);
  if (!manualPartPoints) return 0;
  return Math.min(Number(question.points || 0), manualPartPoints);
}

function isManualReviewPart(part) {
  const hasAcceptedAnswers = Array.isArray(part.accepted) && part.accepted.length > 0;
  const hasKeywordScoring = Array.isArray(part.keywords) && part.keywords.length > 0;
  return !hasAcceptedAnswers && !hasKeywordScoring && part.normalizer !== "arrowDown";
}

function nearlyEqual(left, right) {
  return Math.abs(Number(left) - Number(right)) < 0.001;
}

function writeArtifacts(results, allDefinitions, inactiveDefinitions, skippedInactiveActiveDefs, blockedDrafts = []) {
  const passed = results.filter((item) => item.status === "passed").length;
  const failed = results.filter((item) => item.status === "failed").length;
  const skipped = allDefinitions.length - results.length;
  const payload = {
    runId,
    generatedAt: new Date().toISOString(),
    baseUrl,
    totalRegisteredTests: allDefinitions.length,
    selectedActiveTests: results.length,
    passed,
    failed,
    skipped,
    inactiveDefinitions: inactiveDefinitions.map((test) => ({ id: test.id, title: test.title, status: test.status })),
    skippedInactiveActiveDefinitions: skippedInactiveActiveDefs.map((test) => ({ id: test.id, title: test.title })),
    inactiveGenerationChecks: blockedDrafts,
    results,
  };
  const jsonPath = path.join(runDir, "summary.json");
  const reportPath = path.join(runDir, "summary.md");
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  writeFileSync(reportPath, renderMarkdownReport(payload));
  return { ...payload, jsonPath, reportPath };
}

function renderMarkdownReport(payload) {
  const lines = [
    `# Active Test Smoke Verification ${payload.runId}`,
    "",
    `Base URL: ${payload.baseUrl}`,
    `Registered tests: ${payload.totalRegisteredTests}`,
    `Selected active tests: ${payload.selectedActiveTests}`,
    `Passed: ${payload.passed}`,
    `Failed: ${payload.failed}`,
    `Skipped: ${payload.skipped}`,
    "",
    "## Results",
    "",
    "| Status | Test | Score | Objective expected | Manual review | Attempt | Admin verified |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const result of payload.results) {
    const score = result.scoreTotal === null ? "-" : `${result.scoreTotal}/${result.scorePossible}`;
    const objectiveExpected = Number.isFinite(result.objectiveExpected) ? result.objectiveExpected : "-";
    const manualReviewPoints = Number.isFinite(result.manualReviewPoints) ? result.manualReviewPoints : "-";
    lines.push(`| ${result.status} | ${result.testId} | ${score} | ${objectiveExpected} | ${manualReviewPoints} | ${result.attemptId || "-"} | ${result.adminVerified ? "yes" : "no"} |`);
    if (result.error) lines.push(`|  | ${escapePipe(result.error)} |  |  |  |  |  |`);
  }
  if (payload.inactiveGenerationChecks.length) {
    lines.push("", "## Inactive Assignment Checks", "", "| Test | Blocked | Message |", "| --- | --- | --- |");
    for (const check of payload.inactiveGenerationChecks) {
      lines.push(`| ${check.testId} | ${check.blocked ? "yes" : "no"} | ${escapePipe(check.message)} |`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function escapePipe(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, "");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const moduleCache = new Map();

function resolveModule(specifier, parentFile) {
  if (specifier.startsWith("@/")) return resolveFile(path.join(srcRoot, specifier.slice(2)));
  if (specifier.startsWith(".")) return resolveFile(path.resolve(path.dirname(parentFile), specifier));
  return require.resolve(specifier, { paths: [appRoot] });
}

function resolveFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error(`Cannot resolve module ${basePath}`);
  return found;
}

function loadTsModule(filename) {
  const resolved = resolveFile(filename);
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;

  const ts = require(path.join(appRoot, "node_modules/typescript"));
  const source = readFileSync(resolved, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: resolved,
  }).outputText;

  const cjsModule = { exports: {} };
  moduleCache.set(resolved, cjsModule);
  function localRequire(specifier) {
    if (specifier.startsWith("@/") || specifier.startsWith(".")) return loadTsModule(resolveModule(specifier, resolved));
    return require(resolveModule(specifier, resolved));
  }

  const fn = new Function("require", "module", "exports", "__filename", "__dirname", output);
  fn(localRequire, cjsModule, cjsModule.exports, resolved, path.dirname(resolved));
  return cjsModule.exports;
}
