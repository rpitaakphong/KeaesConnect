import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (!path.extname(file)) file += '.ts';
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const exports = {};
  cache.set(file, exports);
  vm.runInNewContext(out, { exports, require: name => name.startsWith('@/') ? load(path.join(root, name.slice(2))) : require(name) }, { filename: file });
  return exports;
}
const test = load(path.join(root, 'features/tests/content/ks2-science/progress-test-1.ts')).ks2ScienceProgressTest1;
const score = load(path.join(root, 'features/tests/lib/local-scoring.ts')).scoreTestLocally;
// https://primarytools.co.uk/files/Tests/KS2/science2012/PrimaryTools.co.uk-2012SciKS2MarkScheme.pdf
// Independently transcribed from the 2012 STA Test B mark scheme, printed pp.20-35.
const expected = {
  '1a': 'transparent', '1b': 'eats_animals', '1c': { start_food_chain: 'true', catch_food: 'false', use_sunlight: 'true' }, '1d-i': 'microscopic', '1d-ii': 'break_down_waste',
  '2a': 'vibrate', '2b': { position1: 'C', position2: 'A', position3: 'B', position4: 'D' }, '2c': 'pitch', '2d': { readings_12_15_14: 'quite_hard', readings_8_10_6: 'gently', readings_16_19_21: 'very_hard' }, '2e': 'reliability', '2f': 'force_varied',
  '3a': '15-18', '3b': '13', '3c': { place_affects_length: 'supported', more_in_short: 'not_supported' }, '3d': 'wind', '3e': 'reproduction',
  '4a': 'dissolving', '4b': 'larger_particles', '4c': 'c_bubbles', '4d': { A: 'coconut', B: 'salt', C: 'bicarbonate_of_soda', D: 'flour' },
  '5a': 'make_food', '5b': 'temperature', '5c': 'stopwatch', '5d': { choice1: 'celery_length', choice2: 'water_amount' },
  '6a': 'top_left', '6b': 'blocks_light', '6c': 'earth_rotates', '6d': 'difficult', '6e': { colour: 'false', shape: 'true', eyes: 'false', sun_only: 'false' },
  '7a': 'length_tool', '7b': { surface: 'same', height: 'different', size: 'same', mass: 'same' }, '7c': 'drop_bounce', '7d': { x: '0', y: '0' },
  '8a': { wax_melts: 'reversible', smoke: 'non_reversible' }, '8b': { height: 'taller', time: 'longer' }, '8c': '23', '8d': 'a'
};
const fullAnswers = Object.fromEntries(Object.entries(expected).map(([id, value]) => [`ks2-sci-pt1-${id}`, value]));
const allCorrect = score(test, fullAnswers);
const questions = test.sections.flatMap(s => s.questions);
const cases = [];
function rowScore(question, value) {
  const result = score({ ...test, sections: [{ id: 'audit', label: 'Audit', questions: [question] }] }, { [question.id]: value });
  return Object.values(result.sections).flat()[0].score;
}
function check(question, value, expectedScore, detail) {
  const actual = rowScore(question, value);
  cases.push({ question: question.id.replace('ks2-sci-pt1-', ''), detail, answer: value, expected: expectedScore, actual, pass: actual === expectedScore, key: databaseAnswerKey(question) });
}
function databaseAnswerKey(question) {
  const grading = { ...question.grading };
  delete grading.mode;
  return JSON.parse(JSON.stringify({ source: 'mathMultiPart', id: question.id, points: question.points, status: 'official-adapted', ...grading }));
}
for (const q of questions) {
  const id = q.id.replace('ks2-sci-pt1-', '');
  check(q, expected[id], q.points, 'official complete answer');
  check(q, undefined, 0, 'blank');
  if (q.type === 'singleChoice') {
    for (const choice of q.choices) check(q, choice.value, choice.value === expected[id] ? q.points : 0, 'choice ' + choice.value);
  }
  if (['1c', '2d', '3c', '4d', '6e', '7b', '7d', '8a'].includes(id)) {
    const fields = Object.keys(expected[id]);
    for (let mask = 0; mask < (1 << fields.length); mask++) {
      const value = Object.fromEntries(fields.map((f, i) => [f, (mask >> i) & 1 ? expected[id][f] : '']));
      const n = fields.filter((f, i) => (mask >> i) & 1).length;
      let want = n === fields.length ? q.points : 0;
      if (id === '4d') want = n === 4 ? 2 : n >= 2 ? 1 : 0;
      if (id === '6e' || id === '7b') want = n === 4 ? 2 : n === 3 ? 1 : 0;
      check(q, value, want, `correct/blank combination ${mask}`);
    }
  }
  if (id === '5d') {
    const accepted = new Set(['celery_length', 'water_amount', 'glass_size', 'food_colouring', 'leaf_area', 'light']);
    const options = q.fields[0].options.map(o => o.value);
    for (let a = 0; a < options.length; a++) {
      for (let b = a + 1; b < options.length; b++) {
        check(q, { choice1: options[a], choice2: options[b] }, accepted.has(options[a]) && accepted.has(options[b]) ? 1 : 0, 'distinct control pair');
      }
    }
  }
  if (id === '8b') {
    for (const height of ['taller', 'shorter', 'wider']) {
      for (const time of ['longer', 'shorter', 'same amount of time']) {
        const correct = (height === 'taller' && time === 'longer') || (height === 'shorter' && time === 'shorter');
        check(q, { height, time }, correct ? 1 : 0, 'relationship combination');
      }
    }
  }
  if (id === '8c') {
    for (const value of ['20', '20.9', '21', '21.5', '22', '23', '23.0', '23.5', '24', '25', '25.5', '26', '26.1', '27']) {
      check(q, value, Number(value) >= 21 && Number(value) <= 26 ? 1 : 0, 'numeric tolerance');
    }
  }
}

assert.equal(questions.length, 37);
assert.equal(allCorrect.possible, 40);
assert.equal(allCorrect.total, 40);
assert.equal(score(test, {}).total, 0);
assert.equal(cases.length, 297, 'Retain the original audit coverage');
const auditCaseCount = cases.length;
const candleReading = questions.find(q => q.id === 'ks2-sci-pt1-8c');
for (const value of ['', ' ', '23 minutes', '23junk', '2+3', '0x17', '2.3e1', 'NaN', 'Infinity', ['23']]) {
  check(candleReading, value, 0, 'reject non-decimal response');
}
for (const value of [' 23.0 ', '+23', '21.000', '26.000', '23.']) {
  check(candleReading, value, 1, 'equivalent finite decimal');
}
for (const value of ['20.999', '26.001']) check(candleReading, value, 0, 'outside inclusive bounds');
const relationship = questions.find(q => q.id === 'ks2-sci-pt1-8b');
check(relationship, { height: 'shorter' }, 0, 'incomplete relationship');
check(relationship, { time: 'shorter' }, 0, 'incomplete relationship');
const legacyText = { ...candleReading, grading: { mode: 'auto', display: '23', parts: [{ id: 'answer', accepted: ['23'], points: 1 }] } };
check(legacyText, '23', 1, 'legacy exact text matching');
check(legacyText, '23.0', 0, 'numeric behavior is opt-in');
const bank = load(path.join(root, 'features/tests/content/ks2-science/progress-test-1.json'));
for (const [index, section] of test.sections.entries()) {
  assert.equal(section.visualPlacement, 'perQuestion');
  assert.equal(section.questions[0].groupIntro.lead, bank.sections[index].introduction);
  for (const q of section.questions) {
    for (const visual of q.visuals || []) assert.ok(fs.existsSync(path.resolve(root, '../public', '.' + visual.src)), visual.src);
  }
}
const { getAllTestDefinitions } = load(path.join(root, 'features/tests/content/registry.ts'));
for (const other of getAllTestDefinitions().filter(t => ![test.id, 'ks2-science-assessment-test'].includes(t.id))) {
  for (const section of other.sections) assert.equal(section.visualPlacement, undefined, other.id);
}
const failures = cases.filter(c => !c.pass);
assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
export { test, score, load, cases, fullAnswers, databaseAnswerKey };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Verified 37 question parts, 40/40 primary answers, ${auditCaseCount} original audit cases and ${cases.length - auditCaseCount} additional edge cases. Other tests retain their existing visual placement.`);
}
