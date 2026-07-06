import { field, mathChoice, mathQ } from "@/features/tests/content/math-olympiad/helpers";
import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const prefix = "summer-math-level-2";
const assetBase = "/test-assets/summer-math/level-2";

const answer = (number: number, prompt: string, accepted: string[], extra: Partial<Extract<TestQuestion, { type: "multiText" }>> = {}) => (
  mathQ(prefix, number, 1, prompt, [field("answer", "Answer", 1, accepted)], extra)
);

const relationChoices = [
  { value: "parallel", label: "Parallel" },
  { value: "intersecting", label: "Intersecting" },
  { value: "perpendicular", label: "Perpendicular" },
];

const compareChoices = [
  { value: "gt", label: ">" },
  { value: "lt", label: "<" },
  { value: "eq", label: "=" },
];

export const summerMathLevel2Pretest: TestDefinition = {
  id: "summer-math-level-2-pretest",
  title: "Summer Math Level 2 Pre-test",
  subject: "Math",
  level: "Summer Math Level 2",
  status: "draft",
  durationMinutes: 40,
  totalPoints: 30,
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Multiply.",
      questions: [
        answer(1, "52 x 3 =", ["156"]),
        answer(2, "123 x 2 =", ["246"]),
        answer(3, "404 x 5 =", ["2020", "2,020"]),
        answer(4, "11 x 6 =", ["66"]),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Write the number in expanded form.",
      questions: [
        answer(5, "910", ["900 + 10", "900+10", "900 + 10 + 0", "900+10+0"]),
        answer(6, "7,108", ["7000 + 100 + 8", "7000+100+8", "7,000 + 100 + 8", "7,000+100+8"]),
        answer(7, "10,375", ["10000 + 300 + 70 + 5", "10000+300+70+5", "10,000 + 300 + 70 + 5", "10,000+300+70+5"]),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Divide.",
      questions: [
        answer(8, "42 / 7 =", ["6"]),
        answer(9, "25 / 5 =", ["5"]),
        answer(10, "15 / 3 =", ["5"]),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Round off to the underlined digit.",
      questions: [
        answer(11, "72,380 =", ["72400", "72,400"], { promptParts: [{ text: "72," }, { text: "3", underline: true }, { text: "80 =" }] }),
        answer(12, "2,624 =", ["3000", "3,000"], { promptParts: [{ text: "" }, { text: "2", underline: true }, { text: ",624 =" }] }),
        answer(13, "429 =", ["429"], { promptParts: [{ text: "42" }, { text: "9", underline: true }, { text: " =" }] }),
        answer(14, "10,256 =", ["10000", "10,000"], { promptParts: [{ text: "1" }, { text: "0", underline: true }, { text: ",256 =" }] }),
        answer(15, "9,991 =", ["9990", "9,990"], { promptParts: [{ text: "9,9" }, { text: "9", underline: true }, { text: "1 =" }] }),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Study the graph and answer the questions.",
      questionLayout: "grouped",
      visuals: [{ type: "image", src: `${assetBase}/quiz-points-bar-graph.svg`, alt: "Quiz points bar graph for Teams A through H", maxWidth: 720 }],
      questions: [
        answer(16, "Which team won the contest?", ["Team H", "H"]),
        answer(17, "How many points did Team F score?", ["50"]),
        answer(18, "How many more points did Team D score than Team G?", ["40"]),
        answer(19, "Which teams scored equally?", ["Team C and Team F", "C and F", "Team F and Team C", "F and C"]),
        answer(20, "How many teams scored less than 100 points?", ["6"]),
      ],
    },
    {
      id: "part6",
      label: "Part VI",
      title: "Write intersecting, parallel or perpendicular to describe the lines.",
      questions: [
        mathChoice(prefix, 21, 1, "Describe these lines.", relationChoices, ["parallel"], { visualHtml: parallelLines() }),
        mathChoice(prefix, 22, 1, "Describe these lines.", relationChoices, ["intersecting"], { visualHtml: intersectingLines() }),
        mathChoice(prefix, 23, 1, "Describe these lines.", relationChoices, ["perpendicular"], { visualHtml: perpendicularLines() }),
      ],
    },
    {
      id: "part7",
      label: "Part VII",
      title: "Write the fraction for each shape.",
      questions: [
        answer(24, "What fraction is shaded?", ["1/3"], { visualHtml: thirdsVisual() }),
        answer(25, "What fraction is shaded?", ["2/5"], { visualHtml: starFractionVisual() }),
        answer(26, "What fraction is shaded?", ["2/10", "1/5"], { visualHtml: tenthsVisual() }),
      ],
    },
    {
      id: "part8",
      label: "Part VIII",
      title: "Compare the fractions.",
      hint: "Choose greater than, less than, or equal to.",
      questions: [
        mathChoice(prefix, 27, 1, "2/4 ___ 1/4", compareChoices, ["gt"]),
        mathChoice(prefix, 28, 1, "3/10 ___ 8/10", compareChoices, ["lt"]),
        mathChoice(prefix, 29, 1, "1/2 ___ 2/4", compareChoices, ["eq"]),
        mathChoice(prefix, 30, 1, "7/7 ___ 1/8", compareChoices, ["gt"]),
      ],
    },
  ],
};

function lineSvg(content: string, label: string) {
  return `<svg class="diagram-svg" viewBox="0 0 420 180" role="img" aria-label="${label}"><rect width="420" height="180" fill="#fff"/>${content}</svg>`;
}

function parallelLines() {
  return lineSvg(`<line x1="70" y1="65" x2="350" y2="65" stroke="#213b4d" stroke-width="6"/><line x1="70" y1="115" x2="350" y2="115" stroke="#213b4d" stroke-width="6"/>`, "Two parallel horizontal lines");
}

function intersectingLines() {
  return lineSvg(`<line x1="95" y1="35" x2="325" y2="145" stroke="#213b4d" stroke-width="6"/><line x1="325" y1="35" x2="95" y2="145" stroke="#213b4d" stroke-width="6"/>`, "Two intersecting diagonal lines");
}

function perpendicularLines() {
  return lineSvg(`<line x1="210" y1="30" x2="210" y2="150" stroke="#213b4d" stroke-width="6"/><line x1="90" y1="90" x2="330" y2="90" stroke="#213b4d" stroke-width="6"/><rect x="210" y="90" width="24" height="24" fill="none" stroke="#213b4d" stroke-width="4"/>`, "Perpendicular lines");
}

function thirdsVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 320 180" role="img" aria-label="Rectangle split into thirds with one third shaded"><rect width="320" height="180" fill="#fff"/><rect x="100" y="30" width="120" height="120" fill="#fff" stroke="#213b4d" stroke-width="5"/><rect x="100" y="30" width="120" height="40" fill="#0f7db8"/><line x1="100" y1="70" x2="220" y2="70" stroke="#213b4d" stroke-width="4"/><line x1="100" y1="110" x2="220" y2="110" stroke="#213b4d" stroke-width="4"/></svg>`;
}

function starFractionVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 320 220" role="img" aria-label="Star split into five parts with two parts shaded"><rect width="320" height="220" fill="#fff"/><g transform="translate(160 110)"><path d="M0 -90 L22 -28 L88 -28 L35 12 L55 78 L0 38 L-55 78 L-35 12 L-88 -28 L-22 -28 Z" fill="#fff" stroke="#213b4d" stroke-width="5"/><path d="M0 -90 L22 -28 L0 0 L-22 -28 Z" fill="#facc15" stroke="#213b4d" stroke-width="3"/><path d="M-22 -28 L0 0 L-35 12 L-88 -28 Z" fill="#facc15" stroke="#213b4d" stroke-width="3"/><line x1="0" y1="0" x2="35" y2="12" stroke="#213b4d" stroke-width="3"/><line x1="0" y1="0" x2="55" y2="78" stroke="#213b4d" stroke-width="3"/><line x1="0" y1="0" x2="-55" y2="78" stroke="#213b4d" stroke-width="3"/></g></svg>`;
}

function tenthsVisual() {
  const verticals = Array.from({ length: 4 }, (_, index) => `<line x1="${112 + index * 36}" y1="40" x2="${112 + index * 36}" y2="120" stroke="#213b4d" stroke-width="3"/>`).join("");
  return `<svg class="diagram-svg" viewBox="0 0 360 170" role="img" aria-label="Ten-square grid with two shaded"><rect width="360" height="170" fill="#fff"/><rect x="40" y="40" width="180" height="80" fill="#fff" stroke="#213b4d" stroke-width="5"/><rect x="40" y="40" width="72" height="40" fill="#6b2fa0"/><line x1="40" y1="80" x2="220" y2="80" stroke="#213b4d" stroke-width="3"/>${verticals}</svg>`;
}
