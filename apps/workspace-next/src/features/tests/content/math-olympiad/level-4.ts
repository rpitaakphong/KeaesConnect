import { field, imageHtml, mathChoice, mathQ, mathTest } from "@/features/tests/content/math-olympiad/helpers";

const assetBase = "/test-assets/math-olympiad/level-4";
const img = (file: string, alt: string, className = "") => imageHtml(`${assetBase}/${file}`, alt, className);
const choice = (value: string, label: string, visualHtml?: string) => ({ value, label, visualHtml });

export const mathOlympiad4 = mathTest("math-olympiad-4", "Math Olympiad Level 4", "Math Olympiad 4", [
  {
    id: "part1",
    label: "Part I",
    title: "Numerals, rounding, multiplication, and data tables",
    hint: "Use the data given in each question.",
    questions: [
      mathQ("mo4", 1, 1, "Write the following in numerals.", [
        field("a", "Twelve thousand and nine", 0.5, ["12009"]),
        field("b", "Sixty-three thousand and forty-five", 0.5, ["63045"]),
      ]),
      mathQ("mo4", 2, 2, "Fill in the blanks.", [
        field("a", "556 rounded to the nearest ten", 0.67, ["560"]),
        field("b", "9729 rounded to the nearest hundred", 0.67, ["9700"]),
        field("c", "12501 rounded to the nearest thousand", 0.66, ["13000"]),
      ]),
      mathQ("mo4", 3, 1, "Multiply the following.", [
        field("a", "82 x 15", 0.5, ["1230"]),
        field("b", "56 x 27", 0.5, ["1512"]),
      ], { compact: true }),
      mathQ("mo4", 4, 2, "Christine and David have stickers. Christine has 5 times as many as David. David has 172 stickers.", [
        field("a", "How many stickers does Christine have?", 1, ["860"]),
        field("b", "What is the total number of stickers?", 1, ["1032"]),
      ]),
      mathQ("mo4", 5, 3, "Complete the table for Shuli, James, and Ken, then answer the questions.", [
        field("shuli_age", "Shuli age", 0.2, ["9 y 6 m", "9 yr 6 mth", "9 years 6 months", "9y 6m"]),
        field("shuli_height", "Shuli height", 0.2, ["146 cm", "146"]),
        field("shuli_mass", "Shuli mass", 0.2, ["39 kg", "39"]),
        field("james_age", "James age", 0.2, ["10 y 1 m", "10 yr 1 mth", "10 years 1 month", "10y 1m"]),
        field("james_height", "James height", 0.2, ["151 cm", "151"]),
        field("james_mass", "James mass", 0.2, ["42 kg", "42"]),
        field("ken_age", "Ken age", 0.2, ["8 y 8 m", "8 yr 8 mth", "8 years 8 months", "8y 8m"]),
        field("ken_height", "Ken height", 0.2, ["138 cm", "138"]),
        field("ken_mass", "Ken mass", 0.2, ["37 kg", "37"]),
        field("a", "(a) How much older is James than Shuli?", 0.2, ["7 months", "7 mth", "7"]),
        field("b", "(b) How much younger is Ken than Shuli?", 0.2, ["10 months", "10 mth", "10"]),
        field("c", "(c) How much taller is James than Ken?", 0.2, ["13 cm", "13"]),
        field("d", "(d) How much lighter is Ken than Shuli?", 0.2, ["2 kg", "2"]),
        field("e", "(e) What is their total height?", 0.2, ["435 cm", "435"]),
        field("f", "(f) What is their total mass?", 0.2, ["118 kg", "118"]),
      ], {
        visualHtml: pupilFlashcardsVisual(),
        answerTable: {
          headers: ["Name", "Age", "Height", "Mass"],
          rows: [
            { cells: [{ text: "Shuli" }, { type: "input", id: "shuli_age" }, { type: "input", id: "shuli_height" }, { type: "input", id: "shuli_mass" }] },
            { cells: [{ text: "James" }, { type: "input", id: "james_age" }, { type: "input", id: "james_height" }, { type: "input", id: "james_mass" }] },
            { cells: [{ text: "Ken" }, { type: "input", id: "ken_age" }, { type: "input", id: "ken_height" }, { type: "input", id: "ken_mass" }] },
          ],
        },
        followupFieldIds: ["a", "b", "c", "d", "e", "f"],
      }),
    ],
  },
  {
    id: "part2",
    label: "Part II",
    title: "Graphs, fractions, directions, and geometry",
    hint: "Use the diagram or graph information.",
    questions: [
      mathQ("mo4", 6, 3, "The line graph shows shirts sold from Monday to Saturday.", [
        field("a", "Shirts sold on Tuesday", 0.6, ["35"]),
        field("b", "Least number of shirts sold on which day?", 0.6, ["Monday", "Mon"]),
        field("c", "How many fewer shirts on Saturday than Friday?", 0.6, ["10"]),
        field("d", "Money collected from 30 shirts at $20 each", 0.6, ["600", "$600"]),
        field("e", "Total shirts from Monday to Wednesday", 0.6, ["90"]),
      ], { visualHtml: img("m4_q6.png", "Line graph showing shirts sold from Monday to Saturday", "math-booklet-image-wide") }),
      mathQ("mo4", 7, 2, "Arrange the fractions from smallest to greatest.", [
        field("a_3_8", "Question 7(a), 3/8 rank", 0.25, ["2"]),
        field("a_5_12", "Question 7(a), 5/12 rank", 0.25, ["3"]),
        field("a_1_4", "Question 7(a), 1/4 rank", 0.25, ["1"]),
        field("a_5_6", "Question 7(a), 5/6 rank", 0.25, ["4"]),
        field("b_5_6", "Question 7(b), 5/6 rank", 0.25, ["4"]),
        field("b_1_12", "Question 7(b), 1/12 rank", 0.25, ["1"]),
        field("b_2_3", "Question 7(b), 2/3 rank", 0.25, ["2"]),
        field("b_7_9", "Question 7(b), 7/9 rank", 0.25, ["3"]),
      ], {
        rankRows: [
          { label: "(a)", items: [{ text: "3/8", id: "a_3_8" }, { text: "5/12", id: "a_5_12" }, { text: "1/4", id: "a_1_4" }, { text: "5/6", id: "a_5_6" }] },
          { label: "(b)", items: [{ text: "5/6", id: "b_5_6" }, { text: "1/12", id: "b_1_12" }, { text: "2/3", id: "b_2_3" }, { text: "7/9", id: "b_7_9" }] },
        ],
      }),
      mathQ("mo4", 8, 2, "Solve each of the following.", [
        field("a", "1/6 of 30", 1, ["5"]),
        field("b", "3/8 of 32", 1, ["12"]),
      ], { compact: true, visualHtml: fractionOfVisual() }),
      mathQ("mo4", 9, 2, "Fill in the blanks in the direction table.", [
        field("a", "Question 9(a), Jessica will be facing", 0.5, ["North"]),
        field("b", "Question 9(b), Jessica will be facing", 0.5, ["East"]),
        field("c", "Question 9(c), clockwise turn in degrees", 0.5, ["315", "315°"]),
        field("d", "Question 9(d), anticlockwise turn in degrees", 0.5, ["45", "45°"]),
      ], {
        visualHtml: img("m4_q9.png", "Jessica with eight compass directions", "math-booklet-image-medium"),
        answerTable: {
          headers: ["", "Jessica is facing", "If Jessica turns", "She will be facing"],
          rows: [
            { cells: [{ text: "(a)" }, { text: "South" }, { text: "180° clockwise" }, { type: "input", id: "a" }] },
            { cells: [{ text: "(b)" }, { text: "South-west" }, { text: "135° anticlockwise" }, { type: "input", id: "b" }] },
            { cells: [{ text: "(c)" }, { text: "North-west" }, { type: "input", id: "c", suffix: "clockwise" }, { text: "West" }] },
            { cells: [{ text: "(d)" }, { text: "East" }, { type: "input", id: "d", suffix: "anticlockwise" }, { text: "North-east" }] },
          ],
        },
      }),
      mathQ("mo4", 10, 2, "The figure is made up of two squares. Find DE.", [
        field("answer", "DE in cm", 2, ["4", "4 cm"]),
      ], { visualHtml: img("m4_q10.png", "Large square ABCD with smaller square EFGC, AB is 10 cm, GC is 6 cm, find DE", "math-booklet-image-narrow") }),
    ],
  },
  {
    id: "part3",
    label: "Part III",
    title: "Decimals, distance, time, area, and symmetry",
    hint: "Give exact answers.",
    questions: [
      mathQ("mo4", 11, 2, "Fill in the blanks with the missing decimals.", [
        field("a", "27.308 = 27 + 0.3 + ___", 1, ["0.008"]),
        field("b", "8.467 = 8 + 0.4 + ___ + 0.007", 1, ["0.06"]),
      ], { compact: true }),
      mathQ("mo4", 12, 2, "Jim cycled from his home to the market and then to his school.", [
        field("answer", "Total distance in km", 2, ["13.13", "13 13/100"]),
      ], { visualHtml: img("m4_q12.png", "Route from Home to Market to School showing 5.38 km and 7 3/4 km", "math-booklet-image-route") }),
      mathQ("mo4", 13, 2, "Write down the times using the 12-hour and 24-hour clocks.", [
        field("a", "Write 10.45 a.m. in 24-hour clock", 0.5, ["10:45", "10.45"], "time"),
        field("b", "Write 10.45 p.m. in 24-hour clock", 0.5, ["22:45", "22.45"], "time"),
        field("c", "Write 01 35 in 12-hour clock", 0.5, ["1:35 a.m.", "1.35 a.m.", "1:35 am"], "time"),
        field("d", "Write 13 35 in 12-hour clock", 0.5, ["1:35 p.m.", "1.35 p.m.", "1:35 pm"], "time"),
      ]),
      mathQ("mo4", 14, 2, "Find the perimeter and area of the figure.", [
        field("a", "Perimeter", 1, ["48 cm", "48"]),
        field("b", "Area", 1, ["119 cm2", "119 cm²", "119"]),
      ], { visualHtml: img("m4_q14.png", "Composite figure with dimensions 4 cm, 5 cm, 4 cm, 8 cm, and 3 cm", "math-booklet-image-area") }),
      mathChoice("mo4", 15, 2, "Choose the figure with symmetrical shape.", [
        choice("correct", "A", symmetryOption(true)),
        choice("not-reflected", "B", symmetryOption(false)),
        choice("shifted", "C", shiftedOption()),
      ], ["correct"]),
    ],
  },
]);

function pupilFlashcardsVisual() {
  const cards = [
    ["Shuli", "Age: 9 yr 6 mth", "Height: 146 cm", "Mass: 39 kg"],
    ["James", "Age: 10 yr 1 mth", "Height: 151 cm", "Mass: 42 kg"],
    ["Ken", "Age: 8 yr 8 mth", "Height: 138 cm", "Mass: 37 kg"],
  ];
  return `<div class="pupil-flashcards" role="img" aria-label="Data flashcards for Shuli, James, and Ken">${cards.map((card) => `<section class="pupil-flashcard"><strong>${card[0]}</strong><span>${card[1]}</span><span>${card[2]}</span><span>${card[3]}</span></section>`).join("")}</div>`;
}

function fractionOfVisual() {
  return `<svg class="diagram-svg fraction-quantity-visual" viewBox="0 0 560 180" role="img" aria-label="Fraction of quantities"><rect width="560" height="180" fill="#fff"/><circle cx="170" cy="90" r="55" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><path d="M170 90L170 35A55 55 0 0 1 217 118Z" fill="#79d1d8"/><text x="170" y="166" font-size="15" font-weight="900" text-anchor="middle">1/6 of 30</text><rect x="330" y="45" width="120" height="90" fill="#fff" stroke="#213b4d" stroke-width="4"/><rect x="330" y="45" width="45" height="90" fill="#79d1d8"/><text x="390" y="166" font-size="15" font-weight="900" text-anchor="middle">3/8 of 32</text></svg>`;
}

function symmetryOption(correct: boolean) {
  const right = correct ? "M65 25L100 55L65 85" : "M65 25L90 50L65 85";
  return `<svg viewBox="0 0 130 110" aria-hidden="true"><rect width="130" height="110" fill="#fff"/><line x1="65" y1="10" x2="65" y2="100" stroke="#213b4d" stroke-width="2" stroke-dasharray="4 4"/><path d="M65 25L30 55L65 85" fill="#e9fbf8" stroke="#213b4d" stroke-width="3"/><path d="${right}" fill="#e9fbf8" stroke="#213b4d" stroke-width="3"/></svg>`;
}

function shiftedOption() {
  return `<svg viewBox="0 0 130 110" aria-hidden="true"><rect width="130" height="110" fill="#fff"/><line x1="65" y1="10" x2="65" y2="100" stroke="#213b4d" stroke-width="2" stroke-dasharray="4 4"/><path d="M65 25L30 55L65 85" fill="#e9fbf8" stroke="#213b4d" stroke-width="3"/><path d="M72 18L108 50L72 78" fill="#e9fbf8" stroke="#213b4d" stroke-width="3"/></svg>`;
}
