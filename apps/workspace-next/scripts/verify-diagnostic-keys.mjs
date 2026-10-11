import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const cache = new Map();
function load(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = { exports: {} };
  cache.set(filename, loaded);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const localRequire = (name) => name.startsWith("@/")
    ? load(path.join(appRoot, "src", `${name.slice(2)}.ts`))
    : require(name);
  new Function("require", "module", "exports", source)(localRequire, loaded, loaded.exports);
  return loaded.exports;
}

const { cieIgcseCombinedSciencePaper3Diagnostic: test } = load(path.join(appRoot, "src/features/tests/content/igcse-combined-science/paper-3-diagnostic.ts"));
const { scoreTestLocally } = load(path.join(appRoot, "src/features/tests/lib/local-scoring.ts"));
const questions = test.sections.flatMap((section) => section.questions);
const answers = Object.fromEntries(questions.map((q) => {
  const fields = {};
  for (const part of q.grading.parts) {
    if (q.grading.scoringStrategy === "highestCorrect" && fields[part.id]) continue;
    const value = part.normalizer === "keywords" ? part.keywords[0].join(" ") : part.accepted[0];
    if (part.normalizer === "set") fields[part.id] = [...part.accepted];
    else if (part.normalizer === "contains") fields[part.id] = [...(fields[part.id] || []), value];
    else fields[part.id] = fields[part.id] ? `${fields[part.id]} ${value}` : value;
  }
  return [q.id, q.type === "text" || q.type === "singleChoice" ? fields.answer : fields];
}));
assert.equal(questions.length, 53);
assert.equal(scoreTestLocally(test, answers).total, 80);

const cases = [
  ["q1a", { aName: "cell membrane", dFunction: "respiration", vacuoleLetter: "G", vacuoleFunction: "support" }, 4],
  ["q1b", { first: "tissue", second: "wrong", third: "organ system" }, 0],
  ["q1b", { first: "organ", second: "organ system", third: "tissue" }, 1],
  ["q3aii", { selected: ["carnivore"] }, 1],
  ["q3aii", { selected: ["carnivore", "tertiary consumer", "herbivore"] }, 0],
  ["q5a", { refineryGas: "heating", gasoline: "fuel" }, 1],
  ["q5biii", { test: "bromine water", aObservation: "stays orange", bObservation: "wrong" }, 1],
  ["q5biii", { test: "wrong", aObservation: "stays orange", bObservation: "colourless" }, 1],
  ["q5biii", { test: "wrong", aObservation: "stays orange", bObservation: "wrong" }, 0],
  ["q6cii", "A lighted splint gives a pop", 1],
  ["q7aiii", { working: "0.15 * 2.0 * 5.5", answer: "wrong" }, 1],
  ["q7aiii", { answer: "1.65" }, 2],
  ["q8ai", { answer: "30380 N" }, 3],
  ["q8ai", { answer: "30380" }, 2],
  ["q8ai", { working: "3100 * 9.8", answer: "wrong" }, 1],
  ["q9b", { water: "floats", ethanol: "sinks", explanation: "wrong" }, 1],
  ["q9b", { water: "wrong", ethanol: "wrong", explanation: "Poly(ethene) is less dense than water but more dense than ethanol" }, 1],
  ["q9c", { ethanol: "Y", sulfur: "X", explanation: "wrong" }, 0],
  ["q9c", { ethanol: "wrong", sulfur: "wrong", explanation: "Sulfur is solid with a regular particle arrangement; ethanol is liquid with an irregular arrangement" }, 1],
  ["q9di", { answer: "3.333" }, 0],
  ["q9di", { answer: "3.33" }, 2],
];
for (const [suffix, answer, expected] of cases) {
  const questionId = `cie-igcse-cs-p3-diagnostic-${suffix}`;
  const result = scoreTestLocally(test, { [questionId]: answer });
  const row = Object.values(result.sections).flat().find((row) => row.questionId === questionId);
  assert.equal(row.score, expected, `${suffix}: ${JSON.stringify(answer)}`);
}

if (process.argv.includes("--database")) {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const login = await client.auth.signInWithPassword({ email: process.env.E2E_STAFF_EMAIL, password: process.env.E2E_STAFF_PASSWORD });
  if (login.error) throw login.error;
  const { data: rows, error } = await client.from("test_questions").select("id,prompt,points,answer_key").eq("test_id", test.id);
  if (error) throw error;
  assert.equal(rows.length, questions.length);
  for (const q of questions) {
    const row = rows.find((row) => row.id === q.id);
    const grading = { ...q.grading };
    delete grading.mode;
    assert.equal(row.prompt, q.prompt);
    assert.equal(row.points, q.points);
    assert.deepEqual(row.answer_key, JSON.parse(JSON.stringify({ source: "mathMultiPart", id: q.id, points: q.points, status: "official-adapted", ...grading })));
  }
  await Promise.all(cases.map(async ([suffix, answer, expected]) => {
    const questionId = `cie-igcse-cs-p3-diagnostic-${suffix}`;
    const row = rows.find((row) => row.id === questionId);
    const result = await client.rpc("answer_score", { p_question_id: questionId, p_answer_key: row.answer_key, p_response: "", p_answers: { [questionId]: answer } });
    if (result.error) throw result.error;
    assert.equal(Number(result.data), expected, `Database ${suffix}: ${JSON.stringify(answer)}`);
  }));
  process.stdout.write(`Supabase matches all ${rows.length} registry keys and passes ${cases.length} scoring regressions.\n`);
} else if (process.argv.includes("--sql")) {
  const literal = (value) => `'${value.replaceAll("'", "''")}'`;
  const rows = test.sections.flatMap((section) => section.questions.map((q) => {
    const grading = { ...q.grading };
    delete grading.mode;
    const key = { source: "mathMultiPart", id: q.id, points: q.points, status: "official-adapted", ...grading };
    return `(${literal(q.id)}, ${literal(test.id)}, ${literal(section.label)}, ${literal(q.prompt)}, ${literal(JSON.stringify(key))}::jsonb, null, ${q.points}, ${questions.indexOf(q) + 1})`;
  }));
  process.stdout.write(`-- Cambridge 0653/03/SP/25: https://www.cambridgeinternational.org/Images/672378-2025-specimen-mark-scheme-paper-3-.pdf\n-- Current diagnostic UI adaptations; historical attempts are preserved.\ninsert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position) values\n${rows.join(",\n")}\non conflict (id) do update set part = excluded.part, prompt = excluded.prompt, answer_key = excluded.answer_key, points = excluded.points, position = excluded.position;\n`);
} else {
  process.stdout.write(`Verified ${questions.length} questions, 80/80 model score, and ${cases.length} marking regressions.\n`);
}
