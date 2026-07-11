import { field, mathQ } from "@/features/tests/content/math-olympiad/helpers";
import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const prefix = "summer-math-level-1";
const assetBase = "/test-assets/summer-math/level-1";

const answer = (number: number, prompt: string, accepted: string[], extra: Partial<Extract<TestQuestion, { type: "multiText" }>> = {}) => (
  mathQ(prefix, number, 1, prompt, [field("answer", "Answer", 1, accepted)], extra)
);

export const summerMathLevel1Pretest: TestDefinition = {
  id: "summer-math-level-1-pretest",
  title: "Summer Math Level 1 Pre-test",
  subject: "Math",
  level: "Summer Math Level 1",
  status: "active",
  durationMinutes: 40,
  totalPoints: 30,
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Fill in the missing number.",
      hint: "Complete each number pattern.",
      questions: [
        mathQ(prefix, 1, 1, "2, 4, __, 8, __", [
          field("a", "First blank", 0.5, ["6"]),
          field("b", "Second blank", 0.5, ["10"]),
        ], { hidePrompt: true, inlineRows: [{ className: "summer-math-sequence-row", items: sequenceItems(["2", "4", { id: "a" }, "8", { id: "b" }]) }] }),
        mathQ(prefix, 2, 1, "__, 25, 30, __, 40", [
          field("a", "First blank", 0.5, ["20"]),
          field("b", "Second blank", 0.5, ["35"]),
        ], { hidePrompt: true, inlineRows: [{ className: "summer-math-sequence-row", items: sequenceItems([{ id: "a" }, "25", "30", { id: "b" }, "40"]) }] }),
        mathQ(prefix, 3, 1, "__, 20, __, 40, 50", [
          field("a", "First blank", 0.5, ["10"]),
          field("b", "Second blank", 0.5, ["30"]),
        ], { hidePrompt: true, inlineRows: [{ className: "summer-math-sequence-row", items: sequenceItems([{ id: "a" }, "20", { id: "b" }, "40", "50"]) }] }),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Add.",
      questions: [
        answer(4, "12 + 4 =", ["16"]),
        answer(5, "20 + 6 =", ["26"]),
        answer(6, "8 + 7 =", ["15"]),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Subtract.",
      questions: [
        answer(7, "15 - 1 =", ["14"]),
        answer(8, "28 - 4 =", ["24"]),
        answer(9, "10 - 3 =", ["7"]),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Study the picture graph and answer the questions.",
      questionLayout: "grouped",
      visuals: [{ type: "image", src: `${assetBase}/dessert-picture-graph.svg`, alt: "Desserts in David's shop picture graph", maxWidth: 720 }],
      questions: [
        answer(10, "Which dessert is displayed the least?", ["cake"]),
        answer(11, "How many pieces of macaron are displayed?", ["7"]),
        answer(12, "Which dessert counts to 9?", ["cupcake", "cupcakes"]),
        answer(13, "Which dessert counts to 8?", ["cookie", "cookies"]),
        answer(14, "How many cherries are topped in each cupcake?", ["1", "one"]),
        answer(15, "How many desserts are there altogether?", ["30"]),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Write greater or smaller in the blanks.",
      questions: [
        answer(16, "12 is ___ than 13.", ["smaller", "less"]),
        answer(17, "57 is ___ than 48.", ["greater", "bigger", "larger"]),
        answer(18, "10 is ___ than 100.", ["smaller", "less"]),
        answer(19, "66 is ___ than 56.", ["greater", "bigger", "larger"]),
        answer(20, "18 is ___ than 81.", ["smaller", "less"]),
      ],
    },
    {
      id: "part6",
      label: "Part VI",
      title: "Write what time is shown in each clock.",
      questions: [
        answer(21, "Clock 1", ["6:30", "6.30", "6 30", "six thirty"], { visuals: [{ type: "clock", label: "Clock 1", hour: 6, minute: 30 }] }),
        answer(22, "Clock 2", ["4:00", "4.00", "4", "4 00", "four o'clock", "four oclock"], { visuals: [{ type: "clock", label: "Clock 2", hour: 4, minute: 0 }] }),
        answer(23, "Clock 3", ["1:45", "1.45", "1 45", "one forty five"], { visuals: [{ type: "clock", label: "Clock 3", hour: 1, minute: 45 }] }),
      ],
    },
    {
      id: "part7",
      label: "Part VII",
      title: "Write the number in word form.",
      questions: [
        answer(24, "8", ["eight"]),
        answer(25, "12", ["twelve"]),
        answer(26, "21", ["twenty one", "twenty-one"]),
        answer(27, "14", ["fourteen"]),
      ],
    },
    {
      id: "part8",
      label: "Part VIII",
      title: "Write the following in numeral form.",
      questions: [
        answer(28, "Thirty two =", ["32"]),
        answer(29, "Seventy six =", ["76"]),
        answer(30, "Fifty one =", ["51"]),
      ],
    },
  ],
};

function sequenceItems(values: Array<string | { id: string }>) {
  return values.map((value) => (typeof value === "string" ? { text: value } : { type: "input" as const, id: value.id }));
}
