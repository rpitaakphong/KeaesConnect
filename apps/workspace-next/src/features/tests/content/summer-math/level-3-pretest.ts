import { field, mathChoice, mathQ } from "@/features/tests/content/math-olympiad/helpers";
import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const prefix = "summer-math-level-3";
const assetBase = "/test-assets/summer-math/level-3";

const answer = (number: number, prompt: string, accepted: string[], extra: Partial<Extract<TestQuestion, { type: "multiText" }>> = {}) => (
  mathQ(prefix, number, 1, prompt, [field("answer", "Answer", 1, accepted)], extra)
);

const angleChoices = [
  { value: "acute", label: "Acute" },
  { value: "right", label: "Right" },
  { value: "obtuse", label: "Obtuse" },
];

export const summerMathLevel3Pretest: TestDefinition = {
  id: "summer-math-level-3-pretest",
  title: "Summer Math Level 3 Pre-test",
  subject: "Math",
  level: "Summer Math Level 3",
  status: "active",
  durationMinutes: 40,
  totalPoints: 30,
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Calculate the following problems.",
      questions: [
        answer(1, "102 - 38 - 43 =", ["21"]),
        answer(2, "322 + 98 / 7 - 130 =", ["206"]),
        answer(3, "15,000 / 3,000 + 12 =", ["17"]),
        answer(4, "187 x 4,000 =", ["748000", "748,000"]),
        answer(5, "1,750 / 50 =", ["35"]),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Fill in the blanks with the correct answer.",
      questions: [
        answer(6, "5,190,000 = ___ + 100,000 + 20,000 + 9,000", ["5000000", "5,000,000"]),
        answer(7, "1,003,900 = 1,000,000 + ___ + 900", ["3000", "3,000"]),
        answer(8, "In 4,835,400, the digit 8 stands for ___.", ["800000", "800,000", "eight hundred thousand"]),
        answer(9, "In 8,721,650, the digit 8 stands for ___.", ["8000000", "8,000,000", "eight million"]),
        answer(10, "Find the sum of 80,400 and 9,000 and round off the answer to the nearest thousand.", ["89000", "89,000"]),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Write each fraction as a percent.",
      questions: [
        answer(11, "17/100", ["17", "17%"]),
        answer(12, "25/100", ["25", "25%"]),
        answer(13, "4/5", ["80", "80%"]),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Write each fraction as a decimal.",
      questions: [
        answer(14, "9/10", ["0.9", ".9"]),
        answer(15, "23/100", ["0.23", ".23"]),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Add, subtract or multiply and express each answer in simplest form.",
      questions: [
        answer(16, "2 2/5 + 1 1/5 =", ["3 3/5", "18/5"], { hidePrompt: true, visualHtml: expression(`${mixed("2", "2", "5")} + ${mixed("1", "1", "5")} =`) }),
        answer(17, "3 1/6 + 1 2/3 =", ["4 5/6", "29/6"], { hidePrompt: true, visualHtml: expression(`${mixed("3", "1", "6")} + ${mixed("1", "2", "3")} =`) }),
        answer(18, "4 - 3 2/3 =", ["1/3"], { hidePrompt: true, visualHtml: expression(`4 - ${mixed("3", "2", "3")} =`) }),
        answer(19, "2 11/12 - 1 1/6 =", ["1 3/4", "7/4"], { hidePrompt: true, visualHtml: expression(`${mixed("2", "11", "12")} - ${mixed("1", "1", "6")} =`) }),
        answer(20, "9/10 x 2/3 =", ["3/5"], { hidePrompt: true, visualHtml: expression(`${frac("9", "10")} x ${frac("2", "3")} =`) }),
      ],
    },
    {
      id: "part6",
      label: "Part VI",
      title: "Identify if it is a right, acute or obtuse angle.",
      questions: [
        mathChoice(prefix, 21, 1, "Identify the angle.", angleChoices, ["acute"], { visualHtml: angleImage("q21-acute-angle.png", "Acute angle diagram") }),
        mathChoice(prefix, 22, 1, "Identify the angle.", angleChoices, ["right"], { visualHtml: angleImage("q22-right-angle.png", "Right angle diagram") }),
        mathChoice(prefix, 23, 1, "Identify the angle.", angleChoices, ["obtuse"], { visualHtml: angleImage("q23-obtuse-angle.png", "Obtuse angle diagram") }),
      ],
    },
    {
      id: "part7",
      label: "Part VII",
      title: "Solve the equation.",
      questions: [
        answer(24, "3y = 15. y =", ["5"]),
        answer(25, "5y = 60. y =", ["12"]),
      ],
    },
    {
      id: "part8",
      label: "Part VIII",
      title: "Study the graph and answer the questions.",
      questionLayout: "grouped",
      visuals: [{ type: "image", src: `${assetBase}/donut-double-bar-graph.svg`, alt: "Double bar graph of donut boxes sold in Helen's shops", maxWidth: 760 }],
      questions: [
        answer(26, "How many donut boxes did she sell in week 3?", ["150"]),
        answer(27, "Which week did she sell the least?", ["Week 4", "4"]),
        answer(28, "In week 1 and 2 combined, how many more boxes were sold in Shop A than Shop B?", ["Shop B sold 10 more", "10 fewer", "-10", "B sold 10 more", "10"]),
        answer(29, "Which two weeks did she sell the same total number of boxes?", ["Week 1 and Week 5", "Weeks 1 and 5", "1 and 5", "Week 5 and Week 1"]),
        mathQ(prefix, 30, 1, "Which shop would you rather own? Why?", [field("answer", "Answer", 1, [], "keywords", "Shop A because...")], {
          grading: {
            mode: "auto",
            display: "Shop A because it sold more boxes overall.",
            parts: [{
              id: "answer",
              accepted: [],
              points: 1,
              normalizer: "keywords",
              keywords: [["shop a", "more"], ["shop a", "higher"], ["shop a", "440"], ["a", "20 more"]],
              reviewRecommended: true,
            }],
          },
        }),
      ],
    },
  ],
};

function angleImage(filename: string, alt: string) {
  return `<img class="summer-math-angle-image" src="${assetBase}/${filename}" alt="${alt}">`;
}

function expression(content: string) {
  return `<div class="summer-math-expression" aria-label="Math expression">${content}</div>`;
}

function mixed(whole: string, numerator: string, denominator: string) {
  return `<span class="mixed-number"><span>${whole}</span>${frac(numerator, denominator)}</span>`;
}

function frac(numerator: string, denominator: string) {
  return `<span class="frac"><span>${numerator}</span><span>${denominator}</span></span>`;
}
