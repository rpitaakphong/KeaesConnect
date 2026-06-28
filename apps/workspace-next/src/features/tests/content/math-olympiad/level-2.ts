import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/math-olympiad/level-2";
const field = (id: string, label: string, placeholder = "answer") => ({ id, label, placeholder });
const answer = (id: string, accepted: string[], points: number, normalizer: "text" | "time" = "text") => ({ id, accepted, points, normalizer });
const choice = (value: string, label = value) => ({ value, label });
type QuestionExtras = Partial<Pick<TestQuestion, "note" | "visuals">>;

const q = (number: number, points: number, prompt: string, fields: ReturnType<typeof field>[], answers: ReturnType<typeof answer>[], display: string, extra: QuestionExtras = {}): TestQuestion => ({
  id: `mo2-q${number}`,
  number,
  points,
  prompt,
  type: "multiText",
  fields,
  grading: { mode: "auto", display, parts: answers },
  ...extra,
});

const single = (number: number, points: number, prompt: string, choices: ReturnType<typeof choice>[], accepted: string[], display: string, extra: QuestionExtras = {}): TestQuestion => ({
  id: `mo2-q${number}`,
  number,
  points,
  prompt,
  type: "singleChoice",
  responseShape: "object",
  choices,
  grading: { mode: "auto", display, parts: [answer("answer", accepted, points)] },
  ...extra,
});

export const mathOlympiad2: TestDefinition = {
  id: "math-olympiad-2",
  title: "Math Olympiad Level 2",
  subject: "Math",
  level: "Math Olympiad 2",
  status: "active",
  totalPoints: 30,
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Numbers and word problems",
      hint: "Write the answers shown by the numbers and pictures.",
      questions: [
        q(1, 2, "Write the following in numerals.", [
          field("a", "6 hundreds 8 tens 2 ones"),
          field("b", "9 hundreds 7 tens"),
        ], [answer("a", ["682"], 1), answer("b", ["970"], 1)], "682, 970"),
        q(2, 1, "Cheryl had 923 marbles. She gave 53 of the marbles to Norman. How many marbles did Cheryl have left?", [
          field("answer", "She had ___ marbles left."),
        ], [answer("answer", ["870"], 1)], "870"),
        q(3, 2, "Hui En sold 156 muffins during a school carnival. Latifah sold 308 muffins. How many more muffins did Latifah sell?", [
          field("answer", "Latifah sold ___ more muffins."),
        ], [answer("answer", ["152"], 2)], "152"),
        q(4, 2, "Subtract.", [
          field("a", "423 - 156"),
          field("b", "856 - 379"),
        ], [answer("a", ["267"], 1), answer("b", ["477"], 1)], "267, 477"),
        q(5, 2, "Mr Chen had 771 oranges at his fruit stall. He sold 345 oranges in the afternoon. How many oranges did he have left?", [
          field("answer", "He had ___ oranges left."),
        ], [answer("answer", ["426"], 2)], "426"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Multiplication, division, measures, and money",
      hint: "Use the operation shown in each question.",
      questions: [
        q(6, 2, "There are 8 flowers on each stalk. There are 3 stalks.", [
          field("a", "3 x 8"),
          field("b", "There are ___ flowers altogether.", "answer in words"),
        ], [answer("a", ["24"], 1), answer("b", ["24", "twenty four", "twenty-four"], 1)], "24, twenty four", {
          visuals: [{ type: "image", src: `${assetBase}/m2_q6.png`, alt: "Three flower stalks with eight flowers on each stalk", maxWidth: 520 }],
        }),
        q(7, 3, "Divide.", [
          field("a", "16 / 2"),
          field("b", "18 / 2"),
          field("c", "30 / 5"),
          field("d", "24 / 4"),
          field("e", "27 / 3"),
          field("f", "100 / 10"),
        ], [
          answer("a", ["8"], 0.5),
          answer("b", ["9"], 0.5),
          answer("c", ["6"], 0.5),
          answer("d", ["6"], 0.5),
          answer("e", ["9"], 0.5),
          answer("f", ["10"], 0.5),
        ], "8, 9, 6, 6, 9, 10"),
        q(8, 2, "Pencil A is 6 cm. Pencil B is 11 cm.", [
          field("a", "Which pencil is shorter?"),
          field("b", "How much shorter is it?"),
        ], [answer("a", ["A", "Pencil A"], 1), answer("b", ["5", "5 cm"], 1)], "Pencil A, 5 cm", {
          visuals: [{ type: "image", src: `${assetBase}/m2_q8.png`, alt: "Pencil A and Pencil B with length arrows", maxWidth: 520 }],
        }),
        q(9, 2, "The total mass of a table and a chair is 22 kg. The mass of the chair is 10 kg. What is the mass of the table?", [
          field("answer", "The mass of the table is ___ kg."),
        ], [answer("answer", ["12", "12 kg"], 2)], "12 kg"),
        q(10, 2, "Mrs Lee left the house with $120. She had $70 left after buying groceries. How much did her groceries cost?", [
          field("answer", "Her groceries cost $___"),
        ], [answer("answer", ["50", "$50"], 2)], "$50"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Fractions, time, comparison, graphs, and shapes",
      hint: "Choose or write the best answer.",
      questions: [
        single(11, 1, "Circle the figures shown that are one-quarter shaded.", [
          choice("a", "A only"),
          choice("b-c", "B and C"),
          choice("all", "A, B, and C"),
        ], ["b-c"], "B and C", {
          visuals: [{ type: "image", src: `${assetBase}/m2_q11.png`, alt: "Three shaded figures labelled A, B, and C", maxWidth: 520 }],
        }),
        q(12, 2, "Fill in the blanks with the correct time.", [
          field("a", "It is 1 hour after 8.00 p.m."),
          field("b", "It is 30 minutes after 4.00 p.m."),
        ], [
          answer("a", ["9.00 p.m.", "9:00 pm", "9 pm"], 1, "time"),
          answer("b", ["4.30 p.m.", "4:30 pm", "4.30 pm"], 1, "time"),
        ], "9.00 p.m., 4.30 p.m.", {
          visuals: [
            { type: "clock", label: "8.00 p.m.", hour: 8, minute: 0 },
            { type: "clock", label: "4.00 p.m.", hour: 4, minute: 0 },
          ],
        }),
        single(13, 2, "Container A holds ___ water than Container B.", [
          choice("more"),
          choice("less"),
        ], ["less"], "less", {
          visuals: [{ type: "image", src: `${assetBase}/m2_q13.png`, alt: "Container A and Container B poured into measuring glasses", maxWidth: 560 }],
        }),
        q(14, 3, "The pictograph shows pupils' favourite colours.", [
          field("a", "___ pupils like blue most."),
          field("b", "___ pupils like red most."),
          field("c", "___ more pupils prefer yellow to blue."),
          field("d", "5 more pupils prefer green to ___."),
          field("e", "3 more pupils prefer ___ to red."),
          field("f", "There are ___ pupils in the group."),
        ], [
          answer("a", ["4"], 0.5),
          answer("b", ["3"], 0.5),
          answer("c", ["2"], 0.5),
          answer("d", ["red"], 0.5),
          answer("e", ["yellow"], 0.5),
          answer("f", ["21"], 0.5),
        ], "4, 3, 2, red, yellow, 21", {
          visuals: [{ type: "pictograph" }],
        }),
        q(15, 2, "Name the shape of each shaded face.", [
          field("a", "Brick shaded face"),
          field("b", "Cheese shaded face"),
        ], [answer("a", ["rectangle"], 1), answer("b", ["triangle"], 1)], "rectangle, triangle", {
          visuals: [{ type: "solidFaces" }],
        }),
      ],
    },
  ],
};
