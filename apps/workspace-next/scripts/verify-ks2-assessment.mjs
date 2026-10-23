import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, score, databaseAnswerKey } from './verify-ks2-science.mjs';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const test = load(path.join(app, 'src/features/tests/content/ks2-science/assessment-test.ts')).ks2ScienceAssessmentTest;
const questions = test.sections.flatMap(section => section.questions);
const expected = {
  '1a': 'swim', '1b': { 'Long probing beak': 'mud_animals', 'Hooked tearing beak': 'meat', 'Short strong beak': 'seeds' }, '1c': 'reproduce',
  '2a': 'sieve', '2b': { cake_before: 'liquid', cake_after: 'solid', butter_before: 'solid', butter_after: 'liquid', ice_before: 'liquid', ice_after: 'solid' },
  '2c': { cake: 'false', eggs: 'false', sugar: 'true', candles: 'false', ice: 'true' }, '2d': 'evaporation', '2e': 'cold',
  '3a': { fastest: 'squirrel', cat_mass: '7', rabbit_rate: '205' }, '3b': 'inverse', '3c': '100',
  '4a': { 'Seaweed B': 'gutweed', 'Seaweed C': 'lettuce', 'Seaweed D': 'serrated' }, '4b': 'up', '4c': 'trunk_high',
  '4d': { choice1: 'water', choice2: 'anchor', choice3: 'minerals' },
  '5a-i': { path: 'closed', components: 'all' }, '5a-ii': 'cell', '5b': 'reflects_more', '5c': 'correct',
  '6a': 'muscles', '6b': 'exercise_diet', '6c': { sleeves: 'true', many: 'false', same_place: 'true' }, '6d': 'increase',
  '7a': 'insulator', '7b': '25', '7c': { material: 'bubble_wrap', evidence: 'highest_final' },
  '8a': 'seed_type', '8b': { choice1: 'soil', choice2: 'water' }, '8c': 'hidden_root', '8d': 'reliable', '8e': 'b',
  '9a': { soil_water: 'true', sand_soil: 'false', salt_water: 'false' }, '9b': 'no_holes', '9c': 'evaporate_water',
};
const prefix = 'ks2-sci-assessment-';
const fullAnswers = Object.fromEntries(Object.entries(expected).map(([id, value]) => [prefix + id, value]));
const cases = [];
function check(q, answer, wanted, detail) {
  const result = score({ ...test, sections: [{ id: 'audit', label: 'Audit', questions: [q] }] }, { [q.id]: answer });
  cases.push({ id: q.id, answer, expected: wanted, actual: result.total, detail });
}
const thresholds = {
  '2c': n => n === 5 ? 2 : n === 4 ? 1 : 0,
  '3a': n => n === 3 ? 2 : n === 2 ? 1 : 0,
  '5a-i': n => n,
  '6c': n => n === 3 ? 2 : n === 2 ? 1 : 0,
  '7c': n => n,
};
function combinations(values, n) {
  if (n === 0) return [[]];
  return values.flatMap((v, i) => combinations(values.slice(i + 1), n - 1).map(rest => [v, ...rest]));
}
for (const q of questions) {
  const id = q.id.slice(prefix.length);
  check(q, expected[id], q.points, 'model answer');
  check(q, undefined, 0, 'blank');
  if (q.type === 'singleChoice') {
    const correct = id === '4c' ? ['trunk_high', 'branches_spread'] : [expected[id]];
    for (const choice of q.choices) check(q, choice.value, correct.includes(choice.value) ? q.points : 0, 'choice ' + choice.value);
    check(q, '', 0, 'explicit blank choice');
  } else if (q.type === 'multiText' && !['4d', '8b'].includes(id)) {
    const fields = Object.keys(expected[id]);
    for (let mask = 0; mask < 1 << fields.length; mask++) {
      const values = Object.fromEntries(fields.map((f, i) => [f, mask & 1 << i ? expected[id][f] : '']));
      const correct = fields.filter((_, i) => mask & 1 << i).length;
      check(q, values, thresholds[id] ? thresholds[id](correct) : correct === fields.length ? q.points : 0, 'correct/blank mask ' + mask);
    }
  } else if (q.type === 'multiText') {
    const accepted = id === '4d' ? ['water', 'anchor', 'minerals'] : ['soil', 'water', 'depth', 'light', 'tray'];
    for (const values of combinations(q.fields[0].options.map(option => option.value), q.fields.length)) {
      for (const ordered of [values, [...values].reverse()]) {
        check(q, Object.fromEntries(ordered.map((v, i) => ['choice' + (i + 1), v])), values.every(v => accepted.includes(v)) ? q.points : 0, 'distinct choices');
      }
    }
    check(q, { choice1: accepted[0] }, 0, 'incomplete selection');
  }
}
const q3c = questions.find(q => q.id === prefix + '3c');
const q7b = questions.find(q => q.id === prefix + '7b');
for (const value of ['71', '71.0', '100', '100.0', '100.5', '129', '129.000', ' +100 ', '100.', '\u00a0100\ufeff']) check(q3c, value, 1, 'finite reading in range');
for (const value of ['25', '25.0', '025.00', '+25', ' 25.000 ']) check(q7b, value, 1, 'equivalent temperature');
for (const value of ['70', '70.999', '129.001', '130']) check(q3c, value, 0, 'outside inclusive interval');
for (const value of ['24.999', '25.001']) check(q7b, value, 0, 'wrong temperature');
for (const q of [q3c, q7b]) {
  for (const value of ['', ' ', '100 bpm', '25 C', '100junk', '1e2', '0x64', 'NaN', 'Infinity', '9'.repeat(400), ['100'], 100, null, {}]) check(q, value, 0, 'invalid numeric input');
}
assert.equal(test.sections.length, 9);
assert.equal(questions.length, 34);
assert.equal(test.totalPoints, 40);
assert.equal(score(test, fullAnswers).total, 40);
assert.equal(score(test, {}).total, 0);
assert.equal(score(test, { ...fullAnswers, [prefix + '4c']: 'branches_spread', [prefix + '3c']: '100.0', [prefix + '7b']: '25.0' }).total, 40);
const assets = new Set();
for (const section of test.sections) {
  assert.equal(section.visualPlacement, 'perQuestion');
  for (const q of section.questions) {
    for (const v of q.visuals || []) assets.add(v.src);
    for (const choice of q.choices || []) if (choice.image) assets.add(choice.image);
  }
}
assert.equal(assets.size, 21);
for (const asset of assets) assert.ok(fs.existsSync(path.join(app, 'public', asset)), asset);
assert.ok(cases.length >= 350, 'Keep the full question/partial-credit/numeric coverage');
const failures = cases.filter(c => c.actual !== c.expected);
assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
export { test, questions, cases, fullAnswers, databaseAnswerKey };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Verified Assessment Test: 9 sections, 34 parts, 40/40 model answers, zero for blanks, ${cases.length} scoring cases and 21 assets.`);
}
